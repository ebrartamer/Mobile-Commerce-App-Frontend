import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Switch,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const NotificationsScreen = ({ navigation }) => {
    const [notificationSettings, setNotificationSettings] = useState({
        orderUpdates: true,
        promotions: true,
        priceAlerts: false,
        stockAlerts: true,
        appUpdates: true
    });

    const toggleSetting = (key) => {
        setNotificationSettings(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    // Örnek bildirimler
    const notifications = [
        {
            id: '1',
            title: 'Siparişiniz Kargoya Verildi',
            message: 'TRY123456 numaralı siparişiniz kargoya verildi.',
            date: '12 Mar 2023',
            isRead: false,
            type: 'order'
        },
        {
            id: '2',
            title: 'Özel İndirim Fırsatı',
            message: 'Seçili ürünlerde %50\'ye varan indirimler sizi bekliyor!',
            date: '10 Mar 2023',
            isRead: true,
            type: 'promotion'
        },
        {
            id: '3',
            title: 'Favori Ürününüzde İndirim',
            message: 'Favorilerinize eklediğiniz ürün şimdi indirimde!',
            date: '8 Mar 2023',
            isRead: true,
            type: 'price'
        }
    ];

    const renderNotificationItem = ({ item }) => {
        let iconName = 'bell';
        let iconColor = '#ff6b00';
        
        switch (item.type) {
            case 'order':
                iconName = 'shopping-bag';
                iconColor = '#4CAF50';
                break;
            case 'promotion':
                iconName = 'tag';
                iconColor = '#2196F3';
                break;
            case 'price':
                iconName = 'percent';
                iconColor = '#F44336';
                break;
            default:
                iconName = 'bell';
        }
        
        return (
            <View style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                    <Icon name={iconName} size={20} color={iconColor} />
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationDate}>{item.date}</Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bildirimler</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
                    
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Sipariş Güncellemeleri</Text>
                        <Switch
                            value={notificationSettings.orderUpdates}
                            onValueChange={() => toggleSetting('orderUpdates')}
                            trackColor={{ false: '#d9d9d9', true: '#ff6b0050' }}
                            thumbColor={notificationSettings.orderUpdates ? '#ff6b00' : '#f4f3f4'}
                        />
                    </View>
                    
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Kampanya ve İndirimler</Text>
                        <Switch
                            value={notificationSettings.promotions}
                            onValueChange={() => toggleSetting('promotions')}
                            trackColor={{ false: '#d9d9d9', true: '#ff6b0050' }}
                            thumbColor={notificationSettings.promotions ? '#ff6b00' : '#f4f3f4'}
                        />
                    </View>
                    
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Fiyat Uyarıları</Text>
                        <Switch
                            value={notificationSettings.priceAlerts}
                            onValueChange={() => toggleSetting('priceAlerts')}
                            trackColor={{ false: '#d9d9d9', true: '#ff6b0050' }}
                            thumbColor={notificationSettings.priceAlerts ? '#ff6b00' : '#f4f3f4'}
                        />
                    </View>
                    
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Stok Uyarıları</Text>
                        <Switch
                            value={notificationSettings.stockAlerts}
                            onValueChange={() => toggleSetting('stockAlerts')}
                            trackColor={{ false: '#d9d9d9', true: '#ff6b0050' }}
                            thumbColor={notificationSettings.stockAlerts ? '#ff6b00' : '#f4f3f4'}
                        />
                    </View>
                    
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Uygulama Güncellemeleri</Text>
                        <Switch
                            value={notificationSettings.appUpdates}
                            onValueChange={() => toggleSetting('appUpdates')}
                            trackColor={{ false: '#d9d9d9', true: '#ff6b0050' }}
                            thumbColor={notificationSettings.appUpdates ? '#ff6b00' : '#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Son Bildirimler</Text>
                    <FlatList
                        data={notifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
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
    container: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    settingText: {
        fontSize: 16,
        color: '#333'
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    unreadItem: {
        backgroundColor: '#fff9f5'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    notificationContent: {
        flex: 1
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    },
    notificationDate: {
        fontSize: 12,
        color: '#999'
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ff6b00',
        alignSelf: 'center'
    }
});

export default NotificationsScreen; 