import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getMyOrders } from '../redux/features/orders/orderSlice';

const MyOrdersScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getMyOrders()).then(() => setRefreshing(false));
    };

    const handleViewOrderDetails = (orderId) => {
        navigation.navigate('OrderDetails', { orderId });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Hazırlanıyor':
                return '#FFC107'; // Sarı
            case 'Kargoya Verildi':
                return '#2196F3'; // Mavi
            case 'Teslim Edildi':
                return '#4CAF50'; // Yeşil
            case 'İptal Edildi':
                return '#F44336'; // Kırmızı
            default:
                return '#757575'; // Gri
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Hazırlanıyor':
                return 'clock-o';
            case 'Kargoya Verildi':
                return 'truck';
            case 'Teslim Edildi':
                return 'check-circle';
            case 'İptal Edildi':
                return 'times-circle';
            default:
                return 'question-circle';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleViewOrderDetails(item._id)}
        >
            <View style={styles.orderHeader}>
                <View style={styles.orderNumberContainer}>
                    <Text style={styles.orderNumberLabel}>Sipariş No:</Text>
                    <Text style={styles.orderNumber}>#{item._id.slice(-6).toUpperCase()}</Text>
                </View>
                <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>

            <View style={styles.orderInfo}>
                <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Toplam Tutar:</Text>
                    <Text style={styles.orderInfoValue}>{item.totalAmount} TL</Text>
                </View>
                <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Ürün Sayısı:</Text>
                    <Text style={styles.orderInfoValue}>{item.orderItems.length}</Text>
                </View>
                <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Ödeme Yöntemi:</Text>
                    <Text style={styles.orderInfoValue}>{item.paymentMethod}</Text>
                </View>
            </View>

            <View style={styles.orderStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Icon name={getStatusIcon(item.status)} size={12} color="#fff" style={styles.statusIcon} />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#999" />
            </View>
        </TouchableOpacity>
    );

    const renderEmptyOrders = () => (
        <View style={styles.emptyContainer}>
            <Icon name="shopping-bag" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Henüz siparişiniz bulunmuyor</Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Ana Sayfa')}
            >
                <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && !refreshing && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff6b00" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Siparişlerim</Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyOrders}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff6b00']}
                    />
                }
            />
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
    placeholder: {
        width: 36,
    },
    listContainer: {
        flexGrow: 1,
        padding: 16,
    },
    orderItem: {
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
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderNumberLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
    },
    orderInfo: {
        marginBottom: 12,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderInfoLabel: {
        fontSize: 14,
        color: '#666',
    },
    orderInfoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    orderStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusIcon: {
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#ff6b00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyOrdersScreen; 