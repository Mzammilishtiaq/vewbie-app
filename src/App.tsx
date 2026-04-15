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
const Stack = createStackNavigator<RootStackParamList>();
enableFreeze();
enableScreens();
export const App = () => {
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
              <Stack.Screen
                name="Settings"
                component={() => <Text>Settings</Text>}
              />
              <Stack.Screen name="Login" component={SigninScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SearchProvider>
      </SafeAreaProvider>
  );
};
