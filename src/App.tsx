import React from 'react';
import {NavigationContainer} from '@amazon-devices/react-navigation__native';
import {createStackNavigator} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from './Types/navigations';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import SplashScreen from './Screens/SplashScreen';
import HomeScreen from './Screens/HomeScreen';
import {Text} from 'react-native';
import CategoryScreen from './Screens/CategoryScreen';
import {SafeAreaProvider} from '@amazon-devices/react-native-safe-area-context';
import {SearchProvider} from './Contexts/SearchContext';
import SubCategoryScreen from './Screens/SubCategoryScreen';
import FavouriteScreen from './Screens/FavouriteScreen';
import SigninScreen from './Screens/SigninScreen';
import SignupScreen from './Screens/SignupScreen';
import VideoDetailScreen from './Screens/VideoDetailScreen';
import {useAuthStore} from './store/authStore';
import SettingScreen from './Screens/SettingScreen';
import SearchResultScreen from './Screens/SearchResultScreen';
const Stack = createStackNavigator<RootStackParamList>();
enableFreeze();
enableScreens();
export const App = () => {
  const {isHydrated, loadAuth} = useAuthStore((state) => state);
  React.useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  if (!isHydrated) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaProvider>
      <SearchProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="SubCategory" component={SubCategoryScreen} />
            <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
            <Stack.Screen name="Favorite" component={FavouriteScreen} />
            <Stack.Screen name="Search" component={SearchResultScreen} />
            <Stack.Screen name="Settings" component={SettingScreen} />
            <Stack.Screen name="Login" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SearchProvider>
    </SafeAreaProvider>
  );
};
