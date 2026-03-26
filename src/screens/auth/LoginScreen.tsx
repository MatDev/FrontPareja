import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { setTokens, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      await setTokens(res.accessToken, res.refreshToken);
      setUser(res.userId, res.email, res.displayName);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAvoiding contentStyle={{ justifyContent: 'center', minHeight: '100%' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: spacing.xl }}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={{ fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm }}>
        Bienvenida/o
      </Text>
      <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.xl }}>
        Inicia sesión para continuar
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email?.message}
            placeholder="tu@email.com"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password?.message}
            placeholder="••••••••"
          />
        )}
      />

      <Button
        label="Iniciar sesión"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        fullWidth
        size="lg"
        style={{ marginTop: spacing.md }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg }}>
        <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};
