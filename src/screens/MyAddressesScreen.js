import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../redux/features/addresses/addressSlice';

const MyAddressesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { addresses, isLoading } = useSelector((state) => state.addresses || { addresses: [], isLoading: false });
    
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        neighborhood: '',
        fullAddress: '',
        isDefault: false
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getAddresses());
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            title: '',
            fullName: '',
            phoneNumber: '',
            province: '',
            district: '',
            neighborhood: '',
            fullAddress: '',
            isDefault: false
        });
        setErrors({});
    };

    const handleAddAddress = () => {
        setIsAddingAddress(true);
        setIsEditingAddress(false);
        setSelectedAddress(null);
        resetForm();
    };

    const handleEditAddress = (address) => {
        setIsEditingAddress(true);
        setIsAddingAddress(false);
        setSelectedAddress(address);
        setFormData({
            title: address.title || '',
            fullName: address.fullName || '',
            phoneNumber: address.phoneNumber || '',
            province: address.province || '',
            district: address.district || '',
            neighborhood: address.neighborhood || '',
            fullAddress: address.fullAddress || '',
            isDefault: address.isDefault || false
        });
    };

    const handleDeleteAddress = (addressId) => {
        Alert.alert(
            'Adres Sil',
            'Bu adresi silmek istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Sil',
                    onPress: () => {
                        dispatch(deleteAddress(addressId))
                            .unwrap()
                            .then(() => {
                                Alert.alert('Başarılı', 'Adres başarıyla silindi');
                            })
                            .catch((error) => {
                                Alert.alert('Hata', error || 'Adres silinirken bir hata oluştu');
                            });
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.title.trim()) {
            formErrors.title = 'Adres başlığı zorunludur';
            isValid = false;
        }

        if (!formData.fullName.trim()) {
            formErrors.fullName = 'Ad Soyad zorunludur';
            isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
            formErrors.phoneNumber = 'Telefon numarası zorunludur';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            formErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
            isValid = false;
        }

        if (!formData.province.trim()) {
            formErrors.province = 'İl zorunludur';
            isValid = false;
        }

        if (!formData.district.trim()) {
            formErrors.district = 'İlçe zorunludur';
            isValid = false;
        }

        if (!formData.neighborhood.trim()) {
            formErrors.neighborhood = 'Mahalle zorunludur';
            isValid = false;
        }

        if (!formData.fullAddress.trim()) {
            formErrors.fullAddress = 'Açık adres zorunludur';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSaveAddress = () => {
        if (!validateForm()) {
            return;
        }

        if (isEditingAddress && selectedAddress) {
            dispatch(updateAddress({ addressId: selectedAddress._id, addressData: formData }))
                .unwrap()
                .then(() => {
                    Alert.alert('Başarılı', 'Adres başarıyla güncellendi');
                    setIsEditingAddress(false);
                    setSelectedAddress(null);
                    resetForm();
                })
                .catch((error) => {
                    Alert.alert('Hata', error || 'Adres güncellenirken bir hata oluştu');
                });
        } else {
            dispatch(addAddress(formData))
                .unwrap()
                .then(() => {
                    Alert.alert('Başarılı', 'Adres başarıyla eklendi');
                    setIsAddingAddress(false);
                    resetForm();
                })
                .catch((error) => {
                    Alert.alert('Hata', error || 'Adres eklenirken bir hata oluştu');
                });
        }
    };

    const handleCancel = () => {
        setIsAddingAddress(false);
        setIsEditingAddress(false);
        setSelectedAddress(null);
        resetForm();
    };

    const renderAddressItem = ({ item }) => (
        <View style={styles.addressItem}>
            <View style={styles.addressHeader}>
                <View style={styles.addressTitleContainer}>
                    <Text style={styles.addressTitle}>{item.title}</Text>
                    {item.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Varsayılan</Text>
                        </View>
                    )}
                </View>
                <View style={styles.addressActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditAddress(item)}
                    >
                        <Icon name="pencil" size={16} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAddress(item._id)}
                    >
                        <Icon name="trash" size={16} color="#F44336" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.addressContent}>
                <Text style={styles.addressName}>{item.fullName}</Text>
                <Text style={styles.addressPhone}>{item.phoneNumber}</Text>
                <Text style={styles.addressText}>
                    {item.fullAddress}, {item.neighborhood}, {item.district}, {item.province}
                </Text>
            </View>
        </View>
    );

    const renderAddressForm = () => (
        <ScrollView style={styles.formContainer}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Adres Başlığı</Text>
                <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Ev, İş vb."
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                    style={[styles.input, errors.fullName && styles.inputError]}
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    placeholder="Ad Soyad"
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Telefon Numarası</Text>
                <TextInput
                    style={[styles.input, errors.phoneNumber && styles.inputError]}
                    value={formData.phoneNumber}
                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                    placeholder="05XX XXX XX XX"
                    keyboardType="phone-pad"
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>İl</Text>
                <TextInput
                    style={[styles.input, errors.province && styles.inputError]}
                    value={formData.province}
                    onChangeText={(text) => setFormData({ ...formData, province: text })}
                    placeholder="İl"
                />
                {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>İlçe</Text>
                <TextInput
                    style={[styles.input, errors.district && styles.inputError]}
                    value={formData.district}
                    onChangeText={(text) => setFormData({ ...formData, district: text })}
                    placeholder="İlçe"
                />
                {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Mahalle</Text>
                <TextInput
                    style={[styles.input, errors.neighborhood && styles.inputError]}
                    value={formData.neighborhood}
                    onChangeText={(text) => setFormData({ ...formData, neighborhood: text })}
                    placeholder="Mahalle"
                />
                {errors.neighborhood && <Text style={styles.errorText}>{errors.neighborhood}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Açık Adres</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.fullAddress && styles.inputError]}
                    value={formData.fullAddress}
                    onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
                    placeholder="Sokak, Bina No, Daire No vb."
                    multiline
                    numberOfLines={3}
                />
                {errors.fullAddress && <Text style={styles.errorText}>{errors.fullAddress}</Text>}
            </View>

            <View style={styles.checkboxContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                >
                    <Icon
                        name={formData.isDefault ? 'check-square-o' : 'square-o'}
                        size={20}
                        color={formData.isDefault ? '#ff6b00' : '#666'}
                    />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Varsayılan adres olarak ayarla</Text>
            </View>

            <View style={styles.formButtons}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveAddress}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderEmptyAddresses = () => (
        <View style={styles.emptyContainer}>
            <Icon name="map-marker" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Henüz adres eklenmemiş</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAddress}
            >
                <Text style={styles.addButtonText}>Adres Ekle</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Adreslerim</Text>
                {!isAddingAddress && !isEditingAddress && (
                    <TouchableOpacity
                        style={styles.addAddressButton}
                        onPress={handleAddAddress}
                    >
                        <Icon name="plus" size={20} color="#ff6b00" />
                    </TouchableOpacity>
                )}
            </View>

            {isLoading && !addresses.length ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#ff6b00" />
                </View>
            ) : isAddingAddress || isEditingAddress ? (
                renderAddressForm()
            ) : (
                <FlatList
                    data={addresses}
                    renderItem={renderAddressItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyAddresses}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    addAddressButton: {
        padding: 8,
    },
    listContainer: {
        flexGrow: 1,
        padding: 16,
    },
    addressItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    addressTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    defaultBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    defaultText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    addressActions: {
        flexDirection: 'row',
    },
    editButton: {
        padding: 4,
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    addressContent: {
        marginBottom: 8,
    },
    addressName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: '#ff6b00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    formButtons: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        padding: 14,
        backgroundColor: '#ff6b00',
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default MyAddressesScreen; 