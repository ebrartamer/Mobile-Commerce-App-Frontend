import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, addProductReview } from '../redux/features/products/productSlice';
import { addToFavorites, removeFromFavorites, checkFavoriteStatus } from '../redux/features/favorites/favoritesSlice';
import { addToCart } from '../redux/features/cart/cartSlice';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { productId } = route.params;
  const { selectedProduct, isLoading, error, message } = useSelector((state) => state.products);
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId));
      // Favori durumunu kontrol et
      const isProductFavorite = favorites.some(fav => fav._id === productId);
      setIsFavorite(isProductFavorite);
    }
  }, [dispatch, productId, favorites]);

  const handleShare = async () => {
    try {
      const message = `${selectedProduct.name}\n${selectedProduct.description}\nFiyat: ₺${selectedProduct.price}`;
      await Share.share({
        message,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct.variants && selectedProduct.variants.length > 0) {
      if (!selectedColor || !selectedSize) {
        Alert.alert('Uyarı', 'Lütfen renk ve beden seçiniz.');
        return;
      }
      
      // Seçilen varyantın stok durumunu kontrol et
      const variant = selectedProduct.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      
      if (!variant || variant.stock < 1) {
        Alert.alert('Uyarı', 'Seçilen ürün stokta bulunmamaktadır.');
        return;
      }
      
      dispatch(addToCart({
        productId: productId,
        quantity: 1,
        color: selectedColor,
        size: selectedSize
      }))
        .unwrap()
        .then(() => {
          Alert.alert('Başarılı', 'Ürün sepete eklendi.');
        })
        .catch((error) => {
          Alert.alert('Hata', error || 'Ürün sepete eklenirken bir hata oluştu.');
        });
    } else {
      // Varyant yoksa doğrudan ürünü ekle
      if (selectedProduct.stock < 1) {
        Alert.alert('Uyarı', 'Ürün stokta bulunmamaktadır.');
        return;
      }
      
      dispatch(addToCart({
        productId: productId,
        quantity: 1
      }))
        .unwrap()
        .then(() => {
          Alert.alert('Başarılı', 'Ürün sepete eklendi.');
        })
        .catch((error) => {
          Alert.alert('Hata', error || 'Ürün sepete eklenirken bir hata oluştu.');
        });
    }
  };

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(productId));
    } else {
      dispatch(addToFavorites(productId));
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Seçilen renge ait bedenleri filtrele
    const variantsWithColor = selectedProduct.variants.filter(v => v.color === color);
    if (variantsWithColor.length > 0) {
      setSelectedVariant(variantsWithColor[0]);
      setSelectedSize(variantsWithColor[0].size);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const variant = selectedProduct.variants.find(v => v.color === selectedColor && v.size === size);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const submitReview = () => {
    if (!rating || !comment) {
      Alert.alert('Hata', 'Lütfen puan ve yorumunuzu giriniz');
      return;
    }
    
    dispatch(addProductReview({ 
      productId, 
      reviewData: { rating, comment } 
    }))
      .unwrap()
      .then(() => {
        Alert.alert('Başarılı', 'Yorumunuz başarıyla eklendi');
        setComment('');
        setRating(5);
        setShowReviewForm(false);
        // Ürün detaylarını yeniden yükle
        dispatch(getProductDetails(productId));
      })
      .catch((error) => {
        Alert.alert('Hata', error || 'Yorum eklenirken bir hata oluştu');
      });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!selectedProduct) {
    return (
      <View style={styles.centered}>
        <Text>Ürün bulunamadı</Text>
      </View>
    );
  }

  // Benzersiz renk ve bedenleri al
  const uniqueColors = [...new Set(selectedProduct.variants.map(v => v.color))];
  const uniqueSizes = [...new Set(selectedProduct.variants.map(v => v.size))];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleShare} style={styles.headerIcon}>
              <Icon name="share" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite} style={styles.headerIcon}>
              <Icon name={isFavorite ? "heart" : "heart-o"} size={24} color={isFavorite ? "#ff6b00" : "#333"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ürün Görselleri */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImage(newIndex);
            }}
          >
            {selectedProduct.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Görsel Indikatörü */}
          <View style={styles.pagination}>
            {selectedProduct.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === selectedImage ? styles.paginationDotActive : null
                ]}
              />
            ))}
          </View>
        </View>

        {/* Ürün Bilgileri */}
        <View style={styles.productInfo}>
          <Text style={styles.brand}>{selectedProduct.brand}</Text>
          <Text style={styles.title}>{selectedProduct.name}</Text>
          <View style={styles.priceContainer}>
            {selectedProduct.price !== selectedProduct.discountedPrice ? (
              <>
                <Text style={styles.price}>₺{selectedProduct.price.toLocaleString('tr-TR')}</Text>
                <Text style={styles.discountedPrice}>₺{selectedProduct.discountedPrice.toLocaleString('tr-TR')}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    %{Math.round(((selectedProduct.price - selectedProduct.discountedPrice) / selectedProduct.price) * 100)}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.discountedPrice}>₺{selectedProduct.price.toLocaleString('tr-TR')}</Text>
            )}
          </View>

          {/* Varyant Seçimi */}
          <View style={styles.variantsContainer}>
            {/* Renk Seçimi */}
            <Text style={styles.variantTitle}>Renk</Text>
            <View style={styles.colorOptions}>
              {uniqueColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    selectedColor === color && styles.selectedColorOption
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  <Text style={styles.colorText}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Beden Seçimi */}
            <Text style={styles.variantTitle}>Beden</Text>
            <View style={styles.sizeOptions}>
              {uniqueSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.selectedSizeOption
                  ]}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText
                  ]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stok Durumu */}
          <View style={styles.stockInfo}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.stockText}>
              Stokta {selectedVariant ? selectedVariant.stock : selectedProduct.stock} adet
            </Text>
          </View>
        </View>

        {/* Ürün Detayları */}
        <View style={styles.details}>
          <Text style={styles.detailTitle}>Ürün Detayları</Text>
          <Text style={styles.description}>{selectedProduct.description}</Text>

          {/* Özellikler */}
          {Object.keys(selectedProduct.specifications).length > 0 && (
            <View style={styles.specifications}>
              <Text style={styles.specTitle}>Özellikler</Text>
              {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                <View key={key} style={styles.specItem}>
                  <Text style={styles.specKey}>{key}:</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Etiketler */}
          {selectedProduct.tags.length > 0 && (
            <View style={styles.tags}>
              {selectedProduct.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Yorumlar Bölümü */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Değerlendirmeler</Text>
            {user && (
              <TouchableOpacity 
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(!showReviewForm)}
              >
                <Text style={styles.addReviewButtonText}>
                  {showReviewForm ? 'İptal' : 'Değerlendirme Yap'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {showReviewForm && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormLabel}>Puanınız:</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Icon
                      name={star <= rating ? 'star' : 'star-o'}
                      size={24}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.reviewFormLabel}>Yorumunuz:</Text>
              <TextInput
                style={styles.reviewInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Ürün hakkında düşüncelerinizi yazın..."
                multiline
                numberOfLines={4}
              />
              
              <TouchableOpacity
                style={styles.submitReviewButton}
                onPress={submitReview}
              >
                <Text style={styles.submitReviewButtonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {selectedProduct?.reviews && selectedProduct.reviews.length > 0 ? (
            selectedProduct.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name={i < review.rating ? 'star' : 'star-o'}
                        size={14}
                        color="#FFD700"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>
              Bu ürün için henüz değerlendirme bulunmuyor.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Alt Butonlar */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            (!selectedColor || !selectedSize) && styles.disabledButton
          ]} 
          onPress={handleAddToCart}
          disabled={!selectedColor || !selectedSize}
        >
          <Text style={styles.addToCartText}>
            {selectedVariant && selectedVariant.additionalPrice > 0
              ? `Sepete Ekle (+₺${selectedVariant.additionalPrice})`
              : 'Sepete Ekle'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 20,
  },
  imageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ff6b00',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  productInfo: {
    padding: 16,
  },
  brand: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b00',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: '#ff6b00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  variantsContainer: {
    marginTop: 16,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedColorOption: {
    borderColor: '#ff6b00',
    backgroundColor: '#fff3e0',
  },
  colorText: {
    color: '#333',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sizeOption: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSizeOption: {
    borderColor: '#ff6b00',
    backgroundColor: '#fff3e0',
  },
  sizeText: {
    color: '#333',
  },
  selectedSizeText: {
    color: '#ff6b00',
    fontWeight: 'bold',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stockText: {
    marginLeft: 8,
    color: '#4CAF50',
  },
  details: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  specifications: {
    marginTop: 16,
  },
  specTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specItem: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  specKey: {
    flex: 1,
    color: '#666',
  },
  specValue: {
    flex: 2,
    color: '#333',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#666',
    fontSize: 12,
  },
  bottomButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#ff6b00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addReviewButton: {
    backgroundColor: '#ff6b00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  reviewForm: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewFormLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    marginRight: 8,
  },
  reviewInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitReviewButton: {
    backgroundColor: '#ff6b00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default ProductDetailScreen; 