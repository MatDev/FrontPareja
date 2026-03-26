import React, { useEffect } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useCoupleStore } from '../store/coupleStore';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { darkColors, lightColors } from '../theme/colors';
import { usersApi } from '../api/users';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, loadFromStorage, userId, setUser } = useAuthStore();
  const { setCoupleId } = useCoupleStore();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      usersApi.getProfile().then((profile) => {
        setUser(userId, '', profile.displayName);
        if (profile.coupleId) setCoupleId(profile.coupleId);
      }).catch(() => {});
    }
  }, [isAuthenticated, userId]);

  const navTheme = {
    dark: scheme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
