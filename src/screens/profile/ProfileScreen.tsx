import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { authApi } from '../../api/auth';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const ProfileScreen: React.FC = () => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { displayName, email, logout } = useAuthStore();
  const { partner, clearCouple, coupleId } = useCoupleStore();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás segura/o?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          try { await authApi.logout(); } catch {}
          clearCouple();
          await logout();
        },
      },
    ]);
  };

  return (
    <Screen scroll edges={['top']}>
      <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginBottom: spacing.lg }}>
        Perfil
      </Text>

      {/* User card */}
      <Card
        style={{
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.lg,
          paddingVertical: spacing.xl,
        }}
      >
        <Avatar name={displayName ?? undefined} size={80} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>
            {displayName}
          </Text>
          {email ? (
            <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>{email}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')}>
          <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
            Editar perfil
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Couple section */}
      {partner ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.text, fontWeight: fontWeight.semibold, marginBottom: spacing.md }}>
            Tu pareja
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar name={partner.displayName} uri={partner.avatarUrl} size={44} />
            <Text style={{ color: colors.text, fontSize: fontSize.md }}>{partner.displayName}</Text>
          </View>
        </Card>
      ) : (
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
            <Ionicons name="heart-outline" size={24} color={colors.textDisabled} />
            <Text style={{ color: colors.textSecondary }}>Sin pareja conectada</Text>
          </View>
          <Button
            label={coupleId ? 'Compartir invitación' : 'Invitar a mi pareja'}
            onPress={() => navigation.navigate('CreateCouple')}
            variant="outline"
            fullWidth
            size="sm"
          />
        </Card>
      )}

      {/* Menu items */}
      {[
        { icon: 'notifications-outline', label: 'Notificaciones', onPress: () => {} },
        { icon: 'shield-checkmark-outline', label: 'Privacidad', onPress: () => {} },
        { icon: 'help-circle-outline', label: 'Ayuda', onPress: () => {} },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={item.onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <Ionicons name={item.icon as any} size={22} color={colors.textSecondary} />
          <Text style={{ flex: 1, color: colors.text, fontSize: fontSize.md }}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
        </TouchableOpacity>
      ))}

      <Button
        label="Cerrar sesión"
        onPress={handleLogout}
        variant="outline"
        fullWidth
        style={{ marginTop: spacing.xl }}
      />
    </Screen>
  );
};
