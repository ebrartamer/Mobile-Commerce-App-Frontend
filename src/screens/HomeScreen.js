import React, { useEffect } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { logout, reset } from '../redux/features/auth/authSlice';
import { getCategories } from '../redux/features/categories/categorySlice';
import { getFeaturedProducts } from '../redux/features/products/productSlice';
import ImageSlider from '../components/ImageSlider';
import ActionBox from '../components/ActionBox';
import Card from '../components/common/Card';
const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.categories);
    const { featuredProducts, isLoading } = useSelector((state) => state.products);

    const actionBoxes = [
        {
            title: "Süper Fırsatlar",
            icon: "bolt",
            color: "#FF6B00",
            onPress: () => console.log("Süper Fırsatlar")
        },
        {
            title: "Sana Özel",
            icon: "star",
            color: "#E81F89",
            onPress: () => console.log("Sana Özel")
        },
        {
            title: "Markalar",
            icon: "tags",
            color: "#4CAF50",
            onPress: () => console.log("Markalar")
        },
        {
            title: "Çok Satanlar",
            icon: "fire",
            color: "#2196F3",
            onPress: () => console.log("Çok Satanlar")
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
        console.log('Seçilen kategori:', category.name);
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
    productsScrollView: {
        marginTop: 8,
    },
    productsScrollViewContent: {
        paddingHorizontal: 8,
    },
    productCardWrapper: {
        width: 180,
        marginHorizontal: 8,
    }
});

export default HomeScreen;
