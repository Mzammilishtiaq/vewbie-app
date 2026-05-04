export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Search: {query: string};
  Category: undefined;
  SubCategory: {slug?: string; subCategories?: string; CategoryName: string};
  Favorite: undefined;
  VideoDetail: {slug?: string; sluglive?: string};
  Watch: undefined;
  Settings: undefined;
  Login: undefined;
  Signup: undefined;
};
