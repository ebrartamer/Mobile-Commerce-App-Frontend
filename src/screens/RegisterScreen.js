import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../redux/features/auth/authSlice";
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message, isAuthenticated } = useSelector((state) => state.auth);  
    
    useEffect(() => {
        // Başarılı kayıt durumunda giriş sayfasına yönlendir
        if (isSuccess) {
            Alert.alert('Kayıt Başarılı', 'Hesabınız başarıyla oluşturuldu. Lütfen giriş yapın.');
            navigation.navigate('Login');
        }

        // Hata durumunda alert göster
        if (isError) {
            Alert.alert('Kayıt Başarısız', message);
            dispatch(reset());
        }

        // Durumu sıfırla
        return () => {
            dispatch(reset());
            
        };
    }, [isSuccess, isError, message, navigation, dispatch]);
    
    const validate = () => {
        const errors = {};
        
        if (!name) {
            errors.name = 'Ad Soyad gereklidir';
        }
        
        if (!email) {
            errors.email = 'Email adresi gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Geçerli bir email adresi giriniz';
        }
        
        if (!password) {
            errors.password = 'Şifre gereklidir';
        } else if (password.length < 6) {
            errors.password = 'Şifre en az 6 karakter olmalıdır';
        }
        
        if (!confirmPassword) {
            errors.confirmPassword = 'Şifre tekrarı gereklidir';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Şifreler eşleşmiyor';
        }
        
        if (phoneNumber && !/^\d{10}$/.test(phoneNumber.replace(/\s/g, ''))) {
            errors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
        }
        
        setFormErrors(errors);
        
        return Object.keys(errors).length === 0;
    };

    const handleRegister = () => {
        if (validate()) {
            dispatch(register({ 
                name, 
                email, 
                password,
                phoneNumber 
            }));
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.registerBox}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/mobil-logo.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>ProntoShop</Text>
                </View>
                
                <Text style={styles.heading}>Hesap Oluştur</Text>
                <Text style={styles.subheading}>Kayıt olmak için bilgilerinizi giriniz</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <TextInput 
                            style={[styles.input, formErrors.name ? styles.inputError : null]}
                            placeholder="Ad Soyad giriniz"
                            value={name}
                            onChangeText={setName}
                        />
                        {formErrors.name ? (
                            <Text style={styles.errorText}>{formErrors.name}</Text>
                        ) : null}
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={[styles.input, formErrors.email ? styles.inputError : null]}
                            placeholder="Email adresinizi giriniz"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {formErrors.email ? (
                            <Text style={styles.errorText}>{formErrors.email}</Text>
                        ) : null}
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefon Numarası (İsteğe Bağlı)</Text>
                        <TextInput 
                            style={[styles.input, formErrors.phoneNumber ? styles.inputError : null]}
                            placeholder="Telefon numaranızı giriniz"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                        {formErrors.phoneNumber ? (
                            <Text style={styles.errorText}>{formErrors.phoneNumber}</Text>
                        ) : null}
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Şifre</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput 
                                style={[styles.passwordInput, formErrors.password ? styles.inputError : null]}
                                placeholder="Şifrenizi giriniz"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity 
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons 
                                    name={showPassword ? 'eye-off' : 'eye'} 
                                    size={24} 
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {formErrors.password ? (
                            <Text style={styles.errorText}>{formErrors.password}</Text>
                        ) : null}
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Şifre Tekrarı</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput 
                                style={[styles.passwordInput, formErrors.confirmPassword ? styles.inputError : null]}
                                placeholder="Şifrenizi tekrar giriniz"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity 
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons 
                                    name={showPassword ? 'eye-off' : 'eye'} 
                                    size={24} 
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {formErrors.confirmPassword ? (
                            <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
                        ) : null}
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                        )}
                    </TouchableOpacity>
                    
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Zaten hesabınız var mı?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Giriş Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    registerBox: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        marginBottom: 10,
        width: 80,
        height: 80,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff6b00',
        marginBottom: 5,
    },
    subheading: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    registerButton: {
        backgroundColor: '#ff6b00',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#ff6b00',
        fontSize: 14,
        fontWeight: '500',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    passwordInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderWidth: 0,
    },
    eyeIcon: {
        padding: 10,
    },
});

export default RegisterScreen;
