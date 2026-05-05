import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  Image,
} from '@amazon-devices/react-native-kepler';
import {
  useNavigationState,
  useNavigation,
} from '@amazon-devices/react-navigation__core';
import type {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import type {RootStackParamList} from '../Types/navigations';
import {useSearch} from '../Contexts/SearchContext';

import Logo from '../assets/images/logo.png';
import SearchIcon from '../assets/icons/search-icon.png';
import HomeFocusIcon from '../assets/icons/home-focued-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import CategoryFocusIcon from '../assets/icons/category-focus-icon.png';
import CategoryIcon from '../assets/icons/category-icon.png';
import SaveIcon from '../assets/icons/save-icon.png';
import SaveFocusIcon from '../assets/icons/save-focus-icon.png';
import SettingIcon from '../assets/icons/setting-icon.png';
import LoginIcon from '../assets/icons/login_icon.png';

import {useAuthStore} from '../store/authStore';
const Sidebar = () => {
  const {isLoggedIn} = useAuthStore();
  const search = useSearch();
  const opensearch = search?.openSearch;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const isActive = (route: keyof RootStackParamList) =>
    currentRouteName === route;

  const SearchRef = React.useRef(null);
  const homeRef = React.useRef(null);
  const categoryRef = React.useRef(null);
  const favoriteRef = React.useRef(null);
  const settingRef = React.useRef(null);
  const loginRef = React.useRef(null);
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={Logo} style={styles.logo} />

      {/* Menu */}
      <View style={styles.menu}>
        {/* Top Menu */}
        <View style={styles.menuTop}>
          {/* Search */}
          <Pressable
            ref={SearchRef}
            nextFocusDown={homeRef.current}
            nextFocusUp={undefined}
            onPress={opensearch}
            style={({pressed, focused}: any) => [
              styles.menuItem,
              focused && styles.FocuedItem,
              pressed && styles.PressedItem,
            ]}>
            {({focused}: any) => (
              <Image
                source={isActive('Search') || focused ? SearchIcon : SearchIcon}
                style={styles.icon}
              />
            )}
          </Pressable>

          {/* Home */}
          <Pressable
            onPress={() => navigation.navigate('Home')}
            hasTVPreferredFocus={true}
            ref={homeRef}
            nextFocusUp={SearchRef.current}
            nextFocusDown={categoryRef.current}
            style={({pressed, focused}: any) => [
              styles.menuItem,
              focused && styles.FocuedItem,
              pressed && styles.PressedItem,
            ]}>
            {({focused}: any) => (
              <Image
                source={isActive('Home') || focused ? HomeFocusIcon : HomeIcon}
                style={styles.icon}
              />
            )}
          </Pressable>

          {/* Category */}
          <Pressable
            onPress={() => navigation.navigate('Category')}
            ref={categoryRef}
            nextFocusDown={isLoggedIn ? favoriteRef.current : loginRef.current}
            nextFocusUp={homeRef.current}
            style={({pressed, focused}: any) => [
              styles.menuItem,
              focused && styles.FocuedItem,
              pressed && styles.PressedItem,
            ]}>
            {({focused}: any) => (
              <Image
                source={
                  isActive('Category') || focused
                    ? CategoryFocusIcon
                    : CategoryIcon
                }
                style={styles.icon}
              />
            )}
          </Pressable>

          {/* Favorite */}
          {isLoggedIn && (
            <Pressable
              onPress={() => navigation.navigate('Favorite')}
              ref={favoriteRef}
              nextFocusUp={categoryRef.current}
              nextFocusDown={settingRef.current}
              style={({pressed, focused}: any) => [
                styles.menuItem,
                focused && styles.FocuedItem,
                pressed && styles.PressedItem,
              ]}>
              {({focused}: any) => (
                <Image
                  source={
                    isActive('Favorite') || focused ? SaveFocusIcon : SaveIcon
                  }
                  style={styles.icon}
                />
              )}
            </Pressable>
          )}
        </View>

        {/* Bottom Menu */}
        <View style={styles.menuBottom}>
          {isLoggedIn ? (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              ref={settingRef}
              nextFocusUp={favoriteRef.current}
              nextFocusDown={undefined}
              style={({pressed, focused}: any) => [
                styles.menuItem,
                focused && styles.FocuedItem,
              ]}>
              <Image source={SettingIcon} style={styles.icon} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.navigate('Login')}
              ref={loginRef}
              nextFocusUp={categoryRef.current}
              nextFocusDown={undefined}
              style={({pressed, focused}: any) => [
                styles.menuItem,
                focused && styles.FocuedItem,
              ]}>
              <Image source={LoginIcon} style={styles.icon} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 20,
    width: 100,
    gap: 50,
  },

  logo: {
    width: 77,
    height: 66,
    resizeMode: 'cover',
    marginTop: 20,
  },

  menu: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 100,
  },

  menuTop: {
    alignItems: 'center',
    gap: 30,
  },

  menuBottom: {
    alignItems: 'center',
  },

  menuItem: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 45,
  },

  FocuedItem: {
    backgroundColor: '#7C7C7C',
  },

  PressedItem: {
    transform: [{scale: 0.95}],
    backgroundColor: '#7C7C7C',
  },

  icon: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});

export default Sidebar;
