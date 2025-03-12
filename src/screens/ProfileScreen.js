import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { logout } from '../redux/features/auth/authSlice';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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

    const navigateToOrders = () => {
        navigation.navigate('MyOrders');
    };

    const navigateToAddresses = () => {
        navigation.navigate('MyAddresses');
    };

    const navigateToAccountInfo = () => {
        navigation.navigate('AccountInfo');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Icon name="user-circle" size={80} color="#ff6b00" />
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'kullanici@example.com'}</Text>
                </View>

                <View style={styles.menuItems}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={navigateToAccountInfo}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Icon name="user" size={20} color="#2196F3" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuText}>Hesap Bilgilerim</Text>
                            <Text style={styles.menuSubText}>Kişisel bilgilerinizi düzenleyin</Text>
                        </View>
                        <Icon name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={navigateToOrders}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
                            <Icon name="shopping-bag" size={20} color="#FFC107" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuText}>Siparişlerim</Text>
                            <Text style={styles.menuSubText}>Sipariş geçmişinizi görüntüleyin</Text>
                        </View>
                        <Icon name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={navigateToAddresses}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Icon name="map-marker" size={20} color="#4CAF50" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuText}>Adreslerim</Text>
                            <Text style={styles.menuSubText}>Teslimat adreslerinizi yönetin</Text>
                        </View>
                        <Icon name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                            <Icon name="heart" size={20} color="#F44336" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuText}>Favorilerim</Text>
                            <Text style={styles.menuSubText}>Favori ürünlerinizi görüntüleyin</Text>
                        </View>
                        <Icon name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                            <Icon name="bell" size={20} color="#00BCD4" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuText}>Bildirimler</Text>
                            <Text style={styles.menuSubText}>Bildirim ayarlarınızı yönetin</Text>
                        </View>
                        <Icon name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuItem, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                            <Icon name="sign-out" size={20} color="#F44336" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuText, styles.logoutText]}>Çıkış Yap</Text>
                            <Text style={styles.menuSubText}>Hesabınızdan güvenli çıkış yapın</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Versiyon 1.0.0</Text>
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
        marginVertical: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    userEmail: {
        fontSize: 14,
        color: '#666'
    },
    menuItems: {
        marginTop: 8
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    menuTextContainer: {
        flex: 1
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4
    },
    menuSubText: {
        fontSize: 12,
        color: '#999'
    },
    logoutButton: {
        marginTop: 24
    },
    logoutText: {
        color: '#F44336'
    },
    versionContainer: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingVertical: 16
    },
    versionText: {
        fontSize: 12,
        color: '#999'
    }
});

export default ProfileScreen; 