import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={18} color="#ff6b00" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search"
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Favoriler')}
                    >
                        <Icon name="bell-o" size={24} color="#ff6b00" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Profil')}
                    >
                            <Icon name="envelope-o" size={24} color="#ff6b00" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    leftSection: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1, // Input'un tam genişliği kaplamasını sağlar
        height: 40,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 20,
    },
});

export default Header;
