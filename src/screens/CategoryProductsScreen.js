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
    const { categoryId, categoryName, isSearchResult = false } = route.params;
    const dispatch = useDispatch();
    const { products, isLoading, error } = useSelector((state) => state.products);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!isSearchResult && categoryId) {
            dispatch(getProductsByCategory(categoryId));
        }
    }, [dispatch, categoryId, isSearchResult]);

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

    return (
        <SafeAreaView style={styles.safeArea}>
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

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#ff6b00" />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            if (!isSearchResult) {
                                dispatch(getProductsByCategory(categoryId));
                            }
                        }}
                    >
                        <Text style={styles.retryText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.container}>
                    {products.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Icon name="search" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>
                                {isSearchResult 
                                    ? 'Arama sonucu bulunamadı' 
                                    : 'Bu kategoride ürün bulunamadı'}
                            </Text>
                            <Text style={styles.emptySubText}>
                                {isSearchResult 
                                    ? 'Farklı anahtar kelimelerle tekrar arayabilirsiniz' 
                                    : 'Daha sonra tekrar kontrol edin'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={products}
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
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default CategoryProductsScreen; 