import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      {/* Diğer ana uygulama ekranları buraya eklenecek */}
    </Stack.Navigator>
  );
};

export default MainNavigator; 