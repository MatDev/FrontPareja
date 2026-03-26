import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen: React.FC = () => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { displayName } = useAuthStore();
  const { partner } = useCoupleStore();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <Screen scroll edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.xl,
        }}
      >
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>{greeting()}</Text>
          <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>
            {displayName ?? 'Tú'}
          </Text>
        </View>
        <Avatar name={displayName ?? undefined} size={48} />
      </View>

      {/* Couple card */}
      {partner ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
            <View style={{ alignItems: 'center', gap: spacing.xs }}>
              <Avatar name={displayName ?? undefined} size={56} />
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.xs }}>
                {displayName}
              </Text>
            </View>
            <Ionicons name="heart" size={28} color={colors.primary} />
            <View style={{ alignItems: 'center', gap: spacing.xs }}>
              <Avatar name={partner.displayName} uri={partner.avatarUrl} size={56} />
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.xs }}>
                {partner.displayName}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: fontSize.sm,
              textAlign: 'center',
              marginTop: spacing.md,
            }}
          >
            Conectados
          </Text>
        </Card>
      ) : (
        <Card style={{ marginBottom: spacing.lg, alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl }}>
          <Ionicons name="heart-outline" size={36} color={colors.textDisabled} />
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Aún no tienes pareja conectada
          </Text>
          <Text style={{ color: colors.primary, fontSize: fontSize.sm }}>
            Ve a Perfil para invitar a tu pareja
          </Text>
        </Card>
      )}

      {/* Quick stats */}
      <Text
        style={{
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.md,
        }}
      >
        Resumen
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[
          { icon: 'checkbox-outline', label: 'Tareas pendientes', value: '—' },
          { icon: 'calendar-outline', label: 'Próximo ciclo', value: '—' },
        ].map((item) => (
          <Card key={item.label} style={{ flex: 1, alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name={item.icon as any} size={28} color={colors.primary} />
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>
              {item.value}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: fontSize.xs, textAlign: 'center' }}>
              {item.label}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
};
