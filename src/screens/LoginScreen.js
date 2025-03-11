import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../redux/features/auth/authSlice';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  
  const { isLoading, isError, isSuccess, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Başarılı giriş durumunda ana sayfaya yönlendir
    if (isAuthenticated) {
      navigation.replace('Home');
    }

    // Hata durumunda alert göster
    if (isError) {
      Alert.alert('Giriş Başarısız', message);
      dispatch(reset());
    }

    // Başarılı giriş durumunda alert göster
    if (isSuccess) {
      Alert.alert('Giriş Başarılı', 'Başarıyla giriş yaptınız.');
      navigation.replace('Home');
    }

    // Durumu sıfırla
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, isError, isSuccess, message, dispatch, navigation]);

  // Form doğrulama
  const validate = () => {
    const errors = {};
    
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
    
    setFormErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  // Giriş işlemi
  const handleLogin = () => {
    if (validate()) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginBox}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/mobil-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>ProntoShop</Text>
        </View>
        
        <Text style={styles.heading}>Hoş Geldiniz</Text>
        <Text style={styles.subheading}>Giriş yapmak için bilgilerinizi giriniz</Text>

        <View style={styles.formContainer}>
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
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Hesabınız yok mu?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Kayıt Ol</Text>
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
  loginBox: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    marginBottom: 10,
    width: 100,
    height: 100,
  },
  logoText: {
    fontSize: 36,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#ff6b00',
    fontSize: 12,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#ff6b00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
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

export default LoginScreen; 