import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();

  return (
    <Screen
      edges={['top', 'bottom']}
      contentStyle={{ justifyContent: 'space-between', paddingVertical: spacing['2xl'] }}
    >
      {/* Logo & headline */}
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Ionicons name="heart" size={52} color={colors.primary} />
        </View>
        <Text
          style={{
            fontSize: fontSize['4xl'],
            fontWeight: fontWeight.extrabold,
            color: colors.text,
            letterSpacing: -1,
          }}
        >
          CupplesX
        </Text>
        <Text
          style={{
            fontSize: fontSize.lg,
            color: colors.textSecondary,
            marginTop: spacing.sm,
            textAlign: 'center',
          }}
        >
          Tu espacio privado como pareja
        </Text>
      </View>

      {/* Feature list */}
      <View style={{ gap: spacing.md }}>
        {[
          { icon: 'checkbox-outline', text: 'Tareas compartidas con fotos' },
          { icon: 'calendar-outline', text: 'Seguimiento de ciclo y actividad' },
          { icon: 'heart-half-outline', text: 'Conectados en todo momento' },
        ].map((item) => (
          <View
            key={item.text}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: colors.primary + '15',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={item.icon as any} size={22} color={colors.primary} />
            </View>
            <Text style={{ flex: 1, color: colors.text, fontSize: fontSize.md }}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA buttons */}
      <View style={{ gap: spacing.sm }}>
        <Button
          label="Crear cuenta"
          onPress={() => navigation.navigate('Register')}
          fullWidth
          size="lg"
        />
        <Button
          label="Iniciar sesión"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          fullWidth
          size="lg"
        />
      </View>
    </Screen>
  );
};
