import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { usersApi } from '../../api/users';
import { useCoupleStore } from '../../store/coupleStore';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'JoinCouple'>;

export const JoinCoupleScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { setCoupleId } = useCoupleStore();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onJoin = async () => {
    if (!token.trim()) return;
    setLoading(true);
    try {
      const res = await usersApi.joinCouple(token.trim());
      setCoupleId(res.id);
      navigation.replace('Tabs');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'Token inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboardAvoiding contentStyle={{ justifyContent: 'center', gap: spacing.xl }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ gap: spacing.sm }}>
        <Text style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.text }}>
          Unirse a pareja
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          Pega aquí el código que te enviaron
        </Text>
      </View>

      <Input
        label="Código de invitación"
        value={token}
        onChangeText={setToken}
        leftIcon="link-outline"
        placeholder="Pega el código aquí..."
        autoCapitalize="none"
      />

      <Button
        label="Unirme"
        onPress={onJoin}
        loading={loading}
        fullWidth
        size="lg"
        disabled={!token.trim()}
      />
    </Screen>
  );
};
