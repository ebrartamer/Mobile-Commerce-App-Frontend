import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateProfile } from '../redux/features/auth/authSlice';

const AccountInfoScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                ...formData,
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user]);

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            formErrors.name = 'Ad Soyad zorunludur';
            isValid = false;
        }

        if (!formData.email.trim()) {
            formErrors.email = 'E-posta zorunludur';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Geçerli bir e-posta adresi giriniz';
            isValid = false;
        }

        if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            formErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
            isValid = false;
        }

        if (isChangingPassword) {
            if (!formData.currentPassword) {
                formErrors.currentPassword = 'Mevcut şifre zorunludur';
                isValid = false;
            }

            if (!formData.newPassword) {
                formErrors.newPassword = 'Yeni şifre zorunludur';
                isValid = false;
            } else if (formData.newPassword.length < 6) {
                formErrors.newPassword = 'Şifre en az 6 karakter olmalıdır';
                isValid = false;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                formErrors.confirmPassword = 'Şifreler eşleşmiyor';
                isValid = false;
            }
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        const updateData = {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber
        };

        if (isChangingPassword) {
            updateData.password = formData.newPassword;
            updateData.currentPassword = formData.currentPassword;
        }

        dispatch(updateProfile(updateData))
            .unwrap()
            .then(() => {
                Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
                setIsEditing(false);
                setIsChangingPassword(false);
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            })
            .catch((error) => {
                Alert.alert('Hata', error || 'Profil güncellenirken bir hata oluştu');
            });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsChangingPassword(false);
        setFormData({
            ...formData,
            name: user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hesap Bilgilerim</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                        {!isEditing && (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Icon name="pencil" size={16} color="#ff6b00" />
                                <Text style={styles.editButtonText}>Düzenle</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <TextInput
                            style={[
                                styles.input,
                                !isEditing && styles.disabledInput,
                                errors.name && styles.inputError
                            ]}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Ad Soyad"
                            editable={isEditing}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>E-posta</Text>
                        <TextInput
                            style={[
                                styles.input,
                                !isEditing && styles.disabledInput,
                                errors.email && styles.inputError
                            ]}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            placeholder="E-posta"
                            keyboardType="email-address"
                            editable={isEditing}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Telefon</Text>
                        <TextInput
                            style={[
                                styles.input,
                                !isEditing && styles.disabledInput,
                                errors.phoneNumber && styles.inputError
                            ]}
                            value={formData.phoneNumber}
                            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                            placeholder="Telefon"
                            keyboardType="phone-pad"
                            editable={isEditing}
                        />
                        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                    </View>
                </View>

                {isEditing && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setIsChangingPassword(!isChangingPassword)}
                            >
                                <Icon name={isChangingPassword ? 'times' : 'lock'} size={16} color="#ff6b00" />
                                <Text style={styles.editButtonText}>
                                    {isChangingPassword ? 'İptal' : 'Şifre Değiştir'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {isChangingPassword && (
                            <>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Mevcut Şifre</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.currentPassword && styles.inputError
                                        ]}
                                        value={formData.currentPassword}
                                        onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                                        placeholder="Mevcut Şifre"
                                        secureTextEntry
                                    />
                                    {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Yeni Şifre</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.newPassword && styles.inputError
                                        ]}
                                        value={formData.newPassword}
                                        onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                                        placeholder="Yeni Şifre"
                                        secureTextEntry
                                    />
                                    {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Şifre Tekrar</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.confirmPassword && styles.inputError
                                        ]}
                                        value={formData.confirmPassword}
                                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                                        placeholder="Şifre Tekrar"
                                        secureTextEntry
                                    />
                                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                                </View>
                            </>
                        )}
                    </View>
                )}

                {isEditing && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Kaydet</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    backButton: {
        padding: 8
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    placeholder: {
        width: 36
    },
    content: {
        flex: 1,
        padding: 16
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editButtonText: {
        fontSize: 14,
        color: '#ff6b00',
        marginLeft: 4
    },
    formGroup: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff'
    },
    disabledInput: {
        backgroundColor: '#f9f9f9',
        color: '#666'
    },
    inputError: {
        borderColor: '#F44336'
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 8
    },
    saveButton: {
        backgroundColor: '#ff6b00',
        marginLeft: 8
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default AccountInfoScreen; 