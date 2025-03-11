import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { logout } from '../redux/features/auth/authSlice';

const ProfileScreen = () => {
    const dispatch = useDispatch();

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
                <View style={styles.profileHeader}>
                    <Icon name="user-circle" size={80} color="#ff6b00" />
                    <Text style={styles.userName}>Kullanıcı Adı</Text>
                </View>

                <View style={styles.menuItems}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="user" size={24} color="#333" />
                        <Text style={styles.menuText}>Hesap Bilgilerim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="shopping-bag" size={24} color="#333" />
                        <Text style={styles.menuText}>Siparişlerim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="map-marker" size={24} color="#333" />
                        <Text style={styles.menuText}>Adreslerim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="credit-card" size={24} color="#333" />
                        <Text style={styles.menuText}>Ödeme Yöntemlerim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuItem, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Icon name="sign-out" size={24} color="red" />
                        <Text style={[styles.menuText, styles.logoutText]}>Çıkış Yap</Text>
                    </TouchableOpacity>
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
        flex: 1,
        padding: 16
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333'
    },
    menuItems: {
        marginTop: 20
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333'
    },
    logoutButton: {
        marginTop: 20
    },
    logoutText: {
        color: 'red'
    }
});

export default ProfileScreen; 