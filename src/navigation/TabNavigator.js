import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import Header from '../components/layout/Header';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { cart } = useSelector((state) => state.cart);
  
  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.totalItems;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Ana Sayfa':
              iconName = 'home';
              break;
            case 'Kategoriler':
              iconName = 'list';
              break;
            case 'Sepet':
              iconName = 'shopping-cart';
              break;
            case 'Favoriler':
              iconName = 'heart';
              break;
            case 'Profil':
              iconName = 'user';
              break;
            default:
              iconName = 'home';
          }

          return (
            <View>
              <Icon name={iconName} size={size} color={color} />
              {route.name === 'Sepet' && getCartItemCount() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#ff6b00',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Kategoriler" 
        component={CategoriesScreen}
      />
      <Tab.Screen 
        name="Sepet" 
        component={CartScreen}
      />
      <Tab.Screen 
        name="Favoriler" 
        component={FavoritesScreen}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
});

export default TabNavigator; 