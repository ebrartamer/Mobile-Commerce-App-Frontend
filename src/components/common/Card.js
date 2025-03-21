import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites, checkFavoriteStatus } from '../../redux/features/favorites/favoritesSlice';
import { showError, showSuccess } from '../../redux/features/error/errorSlice';

const { width } = Dimensions.get('window');
const cardWidth = (width - 32) / 2; // 2 kart yan yana

const Card = ({
    productId,
    image,
    title,
    brand,
    price,
    discountedPrice,
    discountRate,
    rating,
    reviewCount,
    freeShipping,
    onPress
}) => {
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(false);
    const { isLoading } = useSelector((state) => state.favorites);

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const result = await dispatch(checkFavoriteStatus(productId)).unwrap();
                setIsFavorite(result.isFavorite);
            } catch (error) {
                console.error('Favori durumu kontrol edilirken hata:', error);
            }
        };

        if (productId) {
            checkFavorite();
        }
    }, [dispatch, productId]);

    const handleFavoritePress = async () => {
        try {
            if (isFavorite) {
                await dispatch(removeFromFavorites(productId)).unwrap();
                setIsFavorite(false);
                dispatch(showSuccess({ message: 'Ürün favorilerden çıkarıldı' }));
            } else {
                await dispatch(addToFavorites(productId)).unwrap();
                setIsFavorite(true);
                dispatch(showSuccess({ message: 'Ürün favorilere eklendi' }));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
            
            if (error.response?.status === 401) {
                dispatch(showError({ message: 'Lütfen giriş yapın' }));
            } else if (error.response?.status === 403) {
                dispatch(showError({ message: 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın' }));
            } else {
                dispatch(showError({ message: errorMessage }));
            }
        }
    };

    const calculateDiscountRate = () => {
        if (price && discountedPrice) {
            return Math.round(((price - discountedPrice) / price) * 100);
        }
        return discountRate || 0;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            {/* Favori Butonu */}
            <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={handleFavoritePress}
                disabled={isLoading}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
                <Icon 
                    name={isFavorite ? "heart" : "heart-o"} 
                    size={20} 
                    color={isFavorite ? "#ff6b00" : "#666"} 
                />
            </TouchableOpacity>

            {/* Ürün Görseli */}
            <Image 
                source={typeof image === 'string' ? { uri: image } : image} 
                style={styles.image}
                resizeMode="cover"
            />

            {/* İndirim Etiketi */}
            {(discountedPrice || discountRate) > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>%{calculateDiscountRate()}</Text>
                </View>
            )}

            {/* Ürün Detayları */}
            <View style={styles.details}>
                {/* Marka */}
                <Text style={styles.brand} numberOfLines={1}>{brand}</Text>
                
                {/* Ürün Adı */}
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                
                {/* Fiyat Bilgisi */}
                <View style={styles.priceContainer}>
                    {discountedPrice ? (
                        <>
                            <Text style={styles.discountedPrice}>
                                {discountedPrice.toLocaleString('tr-TR')} TL
                            </Text>
                            <Text style={styles.originalPrice}>
                                {price.toLocaleString('tr-TR')} TL
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.price}>
                            {price.toLocaleString('tr-TR')} TL
                        </Text>
                    )}
                </View>

                {/* Değerlendirme ve Kargo */}
                <View style={styles.bottomInfo}>
                    {rating > 0 && (
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={12} color="#ffc107" />
                            <Text style={styles.rating}>{rating}</Text>
                            <Text style={styles.reviewCount}>({reviewCount})</Text>
                        </View>
                    )}
                    {freeShipping && (
                        <View style={styles.shippingContainer}>
                            <Icon name="truck" size={12} color="#4CAF50" />
                            <Text style={styles.shippingText}>Ücretsiz Kargo</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden'
    },
    favoriteButton: {
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: cardWidth * 1.2,
        resizeMode: 'cover'
    },
    discountBadge: {
        position: 'absolute',
        left: 8,
        top: 8,
        backgroundColor: '#ff6b00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    details: {
        padding: 12
    },
    brand: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    title: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        lineHeight: 20
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6b00',
        marginRight: 8
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through'
    },
    bottomInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rating: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4
    },
    reviewCount: {
        fontSize: 12,
        color: '#999',
        marginLeft: 2
    },
    shippingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shippingText: {
        fontSize: 11,
        color: '#4CAF50',
        marginLeft: 4
    }
});

export default Card;
