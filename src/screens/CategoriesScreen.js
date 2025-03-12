import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../redux/features/categories/categorySlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

const CategoriesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { categories, isLoading, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryTile}
            onPress={() => navigation.navigate('CategoryProducts', { categoryId: item._id, categoryName: item.name })}
        >
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Icon name="tags" size={40} color="#ff6b00" />
                )}
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            {item.description && (
                <Text style={styles.categoryDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            )}
        </TouchableOpacity>
    );

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
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(getCategories())}
                >
                    <Text style={styles.retryText}>Tekrar Dene</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kategoriler</Text>
            </View>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={numColumns}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 8,
    },
    categoryTile: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        maxWidth: tileSize - 16,
    },
    imageContainer: {
        width: tileSize - 64,
        height: tileSize - 64,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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

export default CategoriesScreen; 