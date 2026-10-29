import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from './navigationRoutes';
import { FeedCatalogScreen } from '../screens/FeedCatalogScreen';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { BasketScreen } from '../screens/BasketScreen';
import { SavedItemsScreen } from '../screens/SavedItemsScreen';
import { PillBadge } from '../elements/PillBadge';
import { useBasket } from '../../hooks/useBasket';
import { useFavorites } from '../../hooks/useFavorites';
import { Palette } from '../../core/constants/themeColors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator: React.FC = () => {
  const { bill } = useBasket();
  const { favorites } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Palette.textHeading,
        },
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.textSub,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: Palette.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="CatalogTab"
        component={FeedCatalogScreen}
        options={({ navigation }) => ({
          title: 'Khám phá DucShop',
          tabBarLabel: 'Cửa hàng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('BasketTab')}
              style={styles.headerRightCart}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={24} color={Palette.textHeading} />
              <PillBadge value={bill.itemCount} variant="danger" />
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={SavedItemsScreen}
        options={{
          title: 'Danh sách yêu thích',
          tabBarLabel: 'Yêu thích',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="heart-outline" size={size} color={color} />
              <PillBadge value={favorites.length} variant="danger" />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="BasketTab"
        component={BasketScreen}
        options={{
          title: 'Giỏ hàng của tôi',
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              <PillBadge value={bill.itemCount} variant="danger" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigationRouter: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: Palette.textHeading,
          },
          headerTintColor: Palette.primary,
          headerBackTitle: 'Trở lại',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={{
            title: 'Chi tiết sản phẩm',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRightCart: {
    marginRight: 16,
    position: 'relative',
    padding: 4,
  },
});

