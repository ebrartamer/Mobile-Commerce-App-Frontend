import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getOrderById, cancelOrder, clearSelectedOrder } from '../redux/features/orders/orderSlice';

const OrderDetailsScreen = ({ route, navigation }) => {
    const { orderId } = route.params;
    const dispatch = useDispatch();
    const { selectedOrder, isLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getOrderById(orderId));

        // Temizleme işlemi
        return () => {
            dispatch(clearSelectedOrder());
        };
    }, [dispatch, orderId]);

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
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    const handleCancelOrder = () => {
        Alert.alert(
            'Sipariş İptali',
            'Bu siparişi iptal etmek istediğinize emin misiniz?',
            [
                {
                    text: 'Vazgeç',
                    style: 'cancel'
                },
                {
                    text: 'İptal Et',
                    onPress: () => {
                        dispatch(cancelOrder(orderId))
                            .unwrap()
                            .then(() => {
                                Alert.alert('Başarılı', 'Siparişiniz başarıyla iptal edildi.');
                            })
                            .catch((error) => {
                                Alert.alert('Hata', error || 'Sipariş iptal edilirken bir hata oluştu.');
                            });
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    if (isLoading || !selectedOrder) {
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
                <Text style={styles.headerTitle}>Sipariş Detayı</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Sipariş Özeti */}
                <View style={styles.section}>
                    <View style={styles.orderHeader}>
                        <View>
                            <Text style={styles.orderNumberLabel}>Sipariş No:</Text>
                            <Text style={styles.orderNumber}>#{selectedOrder._id.slice(-6).toUpperCase()}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                            <Icon name={getStatusIcon(selectedOrder.status)} size={12} color="#fff" style={styles.statusIcon} />
                            <Text style={styles.statusText}>{selectedOrder.status}</Text>
                        </View>
                    </View>
                    <View style={styles.orderInfo}>
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Sipariş Tarihi:</Text>
                            <Text style={styles.orderInfoValue}>{formatDate(selectedOrder.createdAt)}</Text>
                        </View>
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Toplam Tutar:</Text>
                            <Text style={styles.orderInfoValue}>{selectedOrder.totalAmount} TL</Text>
                        </View>
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Ödeme Yöntemi:</Text>
                            <Text style={styles.orderInfoValue}>{selectedOrder.paymentMethod}</Text>
                        </View>
                    </View>
                </View>

                {/* Teslimat Adresi */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressName}>{selectedOrder.shippingAddress.fullName}</Text>
                        <Text style={styles.addressPhone}>{selectedOrder.shippingAddress.phoneNumber}</Text>
                        <Text style={styles.addressText}>
                            {selectedOrder.shippingAddress.fullAddress}, {selectedOrder.shippingAddress.neighborhood}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}
                        </Text>
                    </View>
                </View>

                {/* Sipariş Ürünleri */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sipariş Ürünleri</Text>
                    {selectedOrder.orderItems.map((item, index) => (
                        <View key={index} style={styles.productItem}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                {item.color && <Text style={styles.productVariant}>Renk: {item.color}</Text>}
                                {item.size && <Text style={styles.productVariant}>Beden: {item.size}</Text>}
                                <View style={styles.productPriceRow}>
                                    <Text style={styles.productPrice}>{item.price.toFixed(2)} TL</Text>
                                    <Text style={styles.productQuantity}>x{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Fiyat Özeti */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fiyat Özeti</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Ürünler Toplamı</Text>
                        <Text style={styles.priceValue}>{selectedOrder.itemsPrice.toFixed(2)} TL</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Kargo Ücreti</Text>
                        <Text style={styles.priceValue}>
                            {selectedOrder.shippingPrice > 0 ? `${selectedOrder.shippingPrice.toFixed(2)} TL` : 'Ücretsiz'}
                        </Text>
                    </View>
                    {selectedOrder.taxPrice > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Vergi</Text>
                            <Text style={styles.priceValue}>{selectedOrder.taxPrice.toFixed(2)} TL</Text>
                        </View>
                    )}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Toplam</Text>
                        <Text style={styles.totalValue}>{selectedOrder.totalAmount} TL</Text>
                    </View>
                </View>
            </ScrollView>

            {/* İptal Butonu - Sadece "Hazırlanıyor" durumundaki siparişler için göster */}
            {selectedOrder.status === 'Hazırlanıyor' && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelOrder}
                    >
                        <Text style={styles.cancelButtonText}>Siparişi İptal Et</Text>
                    </TouchableOpacity>
                </View>
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
    placeholder: {
        width: 36,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    orderNumberLabel: {
        fontSize: 14,
        color: '#666',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
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
    orderInfo: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
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
    addressContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    addressName: {
        fontSize: 16,
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
    productItem: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    productVariant: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    productPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    productQuantity: {
        fontSize: 14,
        color: '#666',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6b00',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
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

export default OrderDetailsScreen; 