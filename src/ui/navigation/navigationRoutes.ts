import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  CatalogTab: undefined;
  FavoritesTab: undefined;
  BasketTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ItemDetail: { productId: number };
};

