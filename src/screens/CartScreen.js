import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart, updateCartItem, clearCart } from '../redux/features/cart/cartSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const CartScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { cart, isLoading, isError, message } = useSelector((state) => state.cart);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getCart());
        setRefreshing(false);
    };

    const handleRemoveItem = (itemId) => {
        Alert.alert(
            'Ürünü Sil',
            'Bu ürünü sepetten çıkarmak istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Sil',
                    onPress: () => dispatch(removeFromCart(itemId))
                }
            ]
        );
    };

    const handleUpdateQuantity = (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    };

    const handleClearCart = () => {
        Alert.alert(
            'Sepeti Temizle',
            'Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Temizle',
                    onPress: () => dispatch(clearCart())
                }
            ]
        );
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            Alert.alert('Hata', 'Sepetinizde ürün bulunmuyor.');
            return;
        }
        navigation.navigate('Checkout');
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem} >
            <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                {item.color && <Text style={styles.itemVariant}>Renk: {item.color}</Text>}
                {item.size && <Text style={styles.itemVariant}>Beden: {item.size}</Text>}
                <View style={styles.priceContainer}>
                    {item.discountedPrice && item.discountedPrice < item.price ? (
                        <>
                            <Text style={styles.discountedPrice}>{item.discountedPrice.toFixed(2)} TL</Text>
                            <Text style={styles.originalPrice}>{item.price.toFixed(2)} TL</Text>
                        </>
                    ) : (
                        <Text style={styles.price}>{item.price.toFixed(2)} TL</Text>
                    )}
                </View>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                >
                    <Icon name="minus" size={12} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                >
                    <Icon name="plus" size={12} color="#333" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item._id)}
            >
                <Icon name="trash" size={20} color="#ff3b30" />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={styles.emptyCart}>
            <Icon name="shopping-cart" size={60} color="#ccc" />
            <Text style={styles.emptyCartText}>Sepetiniz boş</Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Ana Sayfa')}
            >
                <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && !cart) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff6b00" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{message}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(getCart())}
                >
                    <Text style={styles.retryText}>Tekrar Dene</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sepetim</Text>
                {cart && cart.items && cart.items.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearCart}
                    >
                        <Text style={styles.clearButtonText}>Temizle</Text>
                    </TouchableOpacity>
                )}
            </View>

            {cart && (
                <FlatList
                    data={cart.items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyCart}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            )}

            {cart && cart.items && cart.items.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Toplam Ürün:</Text>
                            <Text style={styles.summaryValue}>{cart.totalItems}</Text>
                        </View>
                        {cart.totalPrice !== cart.totalDiscountedPrice && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>İndirim:</Text>
                                <Text style={styles.discountValue}>
                                    -{(cart.totalPrice - cart.totalDiscountedPrice).toFixed(2)} TL
                                </Text>
                            </View>
                        )}
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Toplam:</Text>
                            <Text style={styles.totalValue}>{cart.totalDiscountedPrice.toFixed(2)} TL</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={handleCheckout}
                    >
                        <Text style={styles.checkoutButtonText}>Siparişi Tamamla</Text>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        color: '#ff6b00',
        fontWeight: '600',
    },
    listContainer: {
        flexGrow: 1,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    itemVariant: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff6b00',
        marginRight: 6,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    quantityButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 8,
    },
    removeButton: {
        padding: 8,
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyCartText: {
        fontSize: 18,
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
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    summaryContainer: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    discountValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4CAF50',
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
    checkoutButton: {
        backgroundColor: '#ff6b00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff3b30',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#ff6b00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default CartScreen; 