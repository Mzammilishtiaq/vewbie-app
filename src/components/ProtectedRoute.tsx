// components/ProtectedRoute.tsx
import React, {useEffect} from 'react';
import {useAuthStore} from '../store/authStore';
import {useNavigation, NavigationProp} from '@amazon-devices/react-navigation__native';
import {RootStackParamList} from '../Types/navigations';

const ProtectedRoute = ({children}: any) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return children;
};

export default ProtectedRoute;