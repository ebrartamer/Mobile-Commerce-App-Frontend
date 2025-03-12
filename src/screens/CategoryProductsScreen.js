import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByCategory, clearCategoryProducts } from '../redux/features/products/productSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/common/Card';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = width / numColumns - 24;

const CategoryProductsScreen = ({ route, navigation }) => {
    const { categoryId, categoryName } = route.params;
    const dispatch = useDispatch();
    const { categoryProducts, isLoading, isError, message, pagination } = useSelector((state) => state.products);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadProducts();

        return () => {
            dispatch(clearCategoryProducts());
        };
    }, [dispatch, categoryName]);

    const loadProducts = (pageNum = 1) => {
        dispatch(getProductsByCategory({
            categoryName,
            params: { page: pageNum }
        }));
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadProducts(1);
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (page < pagination.pages && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadProducts(nextPage);
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#ff6b00" />
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <Card
                productId={item._id}
                image={item.images[0]}
                title={item.name}
                brand={item.brand}
                price={item.price}
                discountedPrice={item.discountedPrice}
                rating={item.rating}
                reviewCount={item.numReviews}
                freeShipping={true}
                onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            />
        </View>
    );

    if (isLoading && page === 1) {
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
                    onPress={() => loadProducts()}
                >
                    <Text style={styles.retryText}>Tekrar Dene</Text>
                </TouchableOpacity>
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
                <Text style={styles.headerTitle}>{categoryName}</Text>
                <View style={styles.placeholder} />
            </View>

            {categoryProducts.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.noProductsText}>Bu kategoride ürün bulunamadı.</Text>
                </View>
            ) : (
                <FlatList
                    data={categoryProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    numColumns={numColumns}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
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
    listContainer: {
        padding: 8,
    },
    cardContainer: {
        width: cardWidth,
        margin: 8,
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
    noProductsText: {
        fontSize: 16,
        color: '#666',
    },
    footerLoader: {
        marginVertical: 16,
        alignItems: 'center',
    },
});

export default CategoryProductsScreen; 