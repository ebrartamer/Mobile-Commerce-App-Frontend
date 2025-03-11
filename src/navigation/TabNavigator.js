import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import Header from '../components/layout/Header';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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

          return <Icon name={iconName} size={size} color={color} />;
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
        name="Profil" 
        component={ProfileScreen}
      />
      {/* Diğer tab ekranları eklenecek */}
    </Tab.Navigator>
  );
};

export default TabNavigator; 