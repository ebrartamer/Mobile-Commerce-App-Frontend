import React, { useEffect } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { logout, reset } from '../redux/features/auth/authSlice';
import { TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, isSuccess, isError, message } = useSelector((state) => state.auth);
    
    useEffect(() => {
        // Çıkış yapıldığında login sayfasına yönlendir
        if (!isAuthenticated) {
            navigation.replace('Login');
        }
        
        return () => {
            dispatch(reset());
        };
    }, [isAuthenticated, navigation, dispatch]);
    
    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Çıkış Yap',
                    onPress: () => {
                        dispatch(logout());
                    },
                    style: 'destructive'
                }
            ]
        );
    };
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}> 
               
                
                <View style={styles.content}>
                    <Icon name="home" size={50} color="#ff6b00" />
                    <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
                    <Text style={styles.infoText}>Bu uygulama bir e-ticaret uygulaması prototipidir.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    logo: {
        width: 60,
        height: 60
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoutText: {
        marginLeft: 5,
        color: 'red',
        fontWeight: '500'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333'
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});

export default HomeScreen;
