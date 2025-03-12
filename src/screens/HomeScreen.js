import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { logout, reset } from '../redux/features/auth/authSlice';
import { getCategories } from '../redux/features/categories/categorySlice';
import { getFeaturedProducts, getBrands, getDiscountedProducts } from '../redux/features/products/productSlice';
import ImageSlider from '../components/ImageSlider';
import ActionBox from '../components/ActionBox';
import Card from '../components/common/Card';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.categories);
    const { featuredProducts, brands, discountedProducts, isLoading } = useSelector((state) => state.products);

    const defaultLogo = 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';

    const actionBoxes = [
        {
            title: "Süper Fırsatlar",
            icon: "bolt",
            color: "#FF6B00",
            onPress: () => navigation.navigate('CategoryProducts', { 
                categoryName: 'Süper Fırsatlar',
                isSpecialOffer: true
            })
        },
        {
            title: "Sana Özel",
            icon: "star",
            color: "#E81F89",
            onPress: () => navigation.navigate('CategoryProducts', { 
                categoryName: 'Sana Özel',
                isPersonalized: true
            })
        },
        {
            title: "Markalar",
            icon: "tags",
            color: "#4CAF50",
            onPress: () => navigation.navigate('CategoryProducts', { 
                categoryName: 'Tüm Markalar',
                isBrands: true
            })
        },
        {
            title: "Çok Satanlar",
            icon: "fire",
            color: "#2196F3",
            onPress: () => navigation.navigate('CategoryProducts', { 
                categoryName: 'Çok Satanlar',
                isBestSeller: true
            })
        }
    ];

    const sliderData = [
        {
            image: require('../../assets/ActionBox.png'),
            title: 'Özel Fırsatlar',
            description: 'En iyi fırsatları kaçırmayın!',
            linkText: 'Hemen İncele',
            route: 'Deals'
        },
        {
            image: require('../../assets/blog-photo.png'),
            title: 'Blog Yazıları',
            description: 'En son trend ve haberler',
            linkText: 'Blog\'a Git',
            route: 'Blog'
        },
        {
            image: require('../../assets/FoodImage.png'),
            title: 'Lezzetli Yemekler',
            description: 'En iyi restoranlardan özel menüler',
            linkText: 'Sipariş Ver',
            route: 'Food'
        }
    ];
    
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getFeaturedProducts(10));
        dispatch(getBrands());
        dispatch(getDiscountedProducts(10));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigation.replace('Login');
        }
        return () => {
            dispatch(reset());
        };
    }, [isAuthenticated, navigation, dispatch]);

    const handleSlidePress = (slide) => {
        navigation.navigate(slide.route);
    };
    
    const handleCategoryPress = (category) => {
        navigation.navigate('CategoryProducts', { 
            categoryId: category._id, 
            categoryName: category.name 
        });
    };

    const handleBrandPress = (brand) => {
        navigation.navigate('CategoryProducts', { 
            categoryName: `${brand.name} Ürünleri`,
            brandId: brand.id,
            isBrand: true
        });
    };
    
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
                <ScrollView style={styles.container}>
                    <View style={styles.categoriesWrapper}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                            contentContainerStyle={styles.categoriesContentContainer}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category._id}
                                    style={styles.categoryItem}
                                    onPress={() => handleCategoryPress(category)}
                                >
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    
                    <ImageSlider slides={sliderData} onSlidePress={handleSlidePress} />

                    <View style={styles.actionBoxContainer}>
                        {actionBoxes.map((box, index) => (
                            <ActionBox
                                key={index}
                                title={box.title}
                                icon={box.icon}
                                color={box.color}
                                onPress={box.onPress}
                            />
                        ))}
                    </View>


                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#ff6b00" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.productsScrollView}
                            contentContainerStyle={styles.productsScrollViewContent}
                        >
                            {featuredProducts.map((product) => (
                                <View key={product._id} style={styles.productCardWrapper}>
                                    <Card
                                        productId={product._id}
                                        image={product.images[0]}
                                        title={product.name}
                                        brand={product.brand}
                                        price={product.price}
                                        discountedPrice={product.discountedPrice}
                                        rating={product.rating}
                                        reviewCount={product.numReviews}
                                        freeShipping={true}
                                        onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popüler Markalar</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#ff6b00" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.brandsScrollView}
                            contentContainerStyle={styles.brandsScrollViewContent}
                        >
                            {brands && brands.length > 0 ? brands.slice(0, 10).map((brand, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.brandItem}
                                    onPress={() => handleBrandPress(brand)}
                                >
                                    <View style={styles.brandLogoContainer}>
                                        <Image 
                                            source={{ uri: brand.logo || defaultLogo }} 
                                            style={styles.brandLogo}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.brandName}>{brand.name}</Text>
                                </TouchableOpacity>
                            )) : (
                                <Text style={styles.noDataText}>Marka bulunamadı</Text>
                            )}
                        </ScrollView>
                    )}

                    <View style={styles.discountedContainer}>
                        <View style={styles.discountedSection}>
                            <View style={styles.discountedHeader}>
                                <Icon name="bolt" size={20} color="#fff" />
                                <Text style={styles.discountedTitle}>Süper Fırsatlar</Text>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('CategoryProducts', { 
                                        categoryName: 'Süper Fırsatlar',
                                        isSpecialOffer: true
                                    })}
                                >
                                    <Text style={styles.seeAllText}>Tümünü Gör</Text>
                                </TouchableOpacity>
                            </View>

                            {isLoading ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color="#fff" />
                                </View>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.discountedScrollView}
                                    contentContainerStyle={styles.discountedScrollViewContent}
                                >
                                    {discountedProducts && discountedProducts.length > 0 ? (
                                        discountedProducts.map((product) => (
                                            <View key={product._id} style={styles.productCardWrapper}>
                                                <Card
                                                    productId={product._id}
                                                    image={product.images[0]}
                                                    title={product.name}
                                                    brand={product.brand}
                                                    price={product.price}
                                                    discountedPrice={product.discountedPrice}
                                                    rating={product.rating}
                                                    reviewCount={product.numReviews}
                                                    freeShipping={true}
                                                    onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                                                />
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.noDiscountedText}>İndirimli ürün bulunamadı</Text>
                                    )}
                                </ScrollView>
                            )}
                        </View>
                    </View>

                </ScrollView>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    categoriesWrapper: {
        paddingTop: StatusBar.currentHeight || 0
    },
    categoriesContainer: {
        height: 80
    },
    categoriesContentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 8,
        justifyContent: 'center',
        height: '100%'
    },
    categoryName: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500'
    },
    actionBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    loaderContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productsScrollView: {
        marginTop: 8,
    },
    productsScrollViewContent: {
        paddingHorizontal: 8,
    },
    productCardWrapper: {
        width: 180,
        marginHorizontal: 8,
    },
    brandsScrollView: {
        marginTop: 8,
        marginBottom: 16
    },
    brandsScrollViewContent: {
        paddingHorizontal: 16,
    },
    brandItem: {
        alignItems: 'center',
        marginRight: 24,
        width: 80
    },
    brandLogoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10
    },
    brandLogo: {
        width: '100%',
        height: '100%'
    },
    brandName: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: '#333'
    },
    noDataText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 16,
        width: '100%',
        paddingHorizontal: 16
    },
    discountedContainer: {
        marginVertical: 8,
    },
    discountedSection: {
        backgroundColor: '#FF6B00',
        paddingVertical: 16,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    discountedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    discountedTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        flex: 1,
        marginLeft: 8,
    },
    seeAllText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    discountedScrollView: {
        marginTop: 8,
    },
    discountedScrollViewContent: {
        paddingHorizontal: 8,
    },
    noDiscountedText: {
        fontSize: 14,
        color: '#fff',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 16,
        width: 300,
        paddingHorizontal: 16,
    },
});

export default HomeScreen;
