import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getCart, clearCart } from '../redux/features/cart/cartSlice';
import { createOrder } from '../redux/features/orders/orderSlice';

const CheckoutScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { cart, isLoading } = useSelector((state) => state.cart);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        neighborhood: '',
        fullAddress: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Kapıda Ödeme');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!shippingAddress.fullName.trim()) {
            formErrors.fullName = 'Ad Soyad zorunludur';
            isValid = false;
        }

        if (!shippingAddress.phoneNumber.trim()) {
            formErrors.phoneNumber = 'Telefon numarası zorunludur';
            isValid = false;
        } else if (!/^\d{10}$/.test(shippingAddress.phoneNumber.replace(/\D/g, ''))) {
            formErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
            isValid = false;
        }

        if (!shippingAddress.province.trim()) {
            formErrors.province = 'İl zorunludur';
            isValid = false;
        }

        if (!shippingAddress.district.trim()) {
            formErrors.district = 'İlçe zorunludur';
            isValid = false;
        }

        if (!shippingAddress.neighborhood.trim()) {
            formErrors.neighborhood = 'Mahalle zorunludur';
            isValid = false;
        }

        if (!shippingAddress.fullAddress.trim()) {
            formErrors.fullAddress = 'Açık adres zorunludur';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handlePlaceOrder = () => {
        if (!validateForm()) {
            return;
        }

        const orderData = {
            shippingAddress,
            paymentMethod
        };

        dispatch(createOrder(orderData))
            .unwrap()
            .then(() => {
                Alert.alert(
                    'Sipariş Onayı',
                    'Siparişiniz başarıyla oluşturuldu!',
                    [
                        {
                            text: 'Tamam',
                            onPress: () => {
                                dispatch(clearCart());
                                navigation.navigate('Ana Sayfa');
                            }
                        }
                    ]
                );
            })
            .catch((error) => {
                Alert.alert('Hata', error || 'Sipariş oluşturulurken bir hata oluştu.');
            });
    };

    if (isLoading || !cart) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff6b00" />
            </View>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sipariş</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Sepetinizde ürün bulunmuyor.</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Ana Sayfa')}
                    >
                        <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
                <Text style={styles.headerTitle}>Sipariş</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <TextInput
                            style={[styles.input, errors.fullName && styles.inputError]}
                            value={shippingAddress.fullName}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, fullName: text })}
                            placeholder="Ad Soyad"
                        />
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Telefon Numarası</Text>
                        <TextInput
                            style={[styles.input, errors.phoneNumber && styles.inputError]}
                            value={shippingAddress.phoneNumber}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, phoneNumber: text })}
                            placeholder="05XX XXX XX XX"
                            keyboardType="phone-pad"
                        />
                        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>İl</Text>
                        <TextInput
                            style={[styles.input, errors.province && styles.inputError]}
                            value={shippingAddress.province}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, province: text })}
                            placeholder="İl"
                        />
                        {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>İlçe</Text>
                        <TextInput
                            style={[styles.input, errors.district && styles.inputError]}
                            value={shippingAddress.district}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, district: text })}
                            placeholder="İlçe"
                        />
                        {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mahalle</Text>
                        <TextInput
                            style={[styles.input, errors.neighborhood && styles.inputError]}
                            value={shippingAddress.neighborhood}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, neighborhood: text })}
                            placeholder="Mahalle"
                        />
                        {errors.neighborhood && <Text style={styles.errorText}>{errors.neighborhood}</Text>}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Açık Adres</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, errors.fullAddress && styles.inputError]}
                            value={shippingAddress.fullAddress}
                            onChangeText={(text) => setShippingAddress({ ...shippingAddress, fullAddress: text })}
                            placeholder="Sokak, Bina No, Daire No vb."
                            multiline
                            numberOfLines={3}
                        />
                        {errors.fullAddress && <Text style={styles.errorText}>{errors.fullAddress}</Text>}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            paymentMethod === 'Kapıda Ödeme' && styles.selectedPaymentOption
                        ]}
                        onPress={() => setPaymentMethod('Kapıda Ödeme')}
                    >
                        <Icon
                            name={paymentMethod === 'Kapıda Ödeme' ? 'check-circle' : 'circle-o'}
                            size={20}
                            color={paymentMethod === 'Kapıda Ödeme' ? '#ff6b00' : '#666'}
                        />
                        <Text style={styles.paymentOptionText}>Kapıda Ödeme</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Ürünler Toplamı:</Text>
                        <Text style={styles.summaryValue}>{cart.totalPrice.toFixed(2)} TL</Text>
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
                        <Text style={styles.summaryLabel}>Kargo:</Text>
                        <Text style={styles.summaryValue}>
                            {cart.totalDiscountedPrice > 150 ? 'Ücretsiz' : '14.99 TL'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Toplam:</Text>
                        <Text style={styles.totalValue}>
                            {(cart.totalDiscountedPrice > 150
                                ? cart.totalDiscountedPrice
                                : cart.totalDiscountedPrice + 14.99).toFixed(2)} TL
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.placeOrderButton}
                    onPress={handlePlaceOrder}
                >
                    <Text style={styles.placeOrderButtonText}>Siparişi Tamamla</Text>
                </TouchableOpacity>
            </View>
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
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    selectedPaymentOption: {
        borderColor: '#ff6b00',
        backgroundColor: '#fff9f5',
    },
    paymentOptionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
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
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    placeOrderButton: {
        backgroundColor: '#ff6b00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeOrderButtonText: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
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
});

export default CheckoutScreen; 