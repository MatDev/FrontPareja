import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Share, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../theme';
import { usersApi } from '../../api/users';
import { useCoupleStore } from '../../store/coupleStore';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateCouple'>;

export const CreateCoupleScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { setCoupleId } = useCoupleStore();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const invite = await usersApi.createCouple();
      setInviteLink(invite.inviteUrl);
      // Fetch profile to get the actual coupleId
      const profile = await usersApi.getProfile();
      if (profile.coupleId) setCoupleId(profile.coupleId);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al crear pareja');
    } finally {
      setLoading(false);
    }
  };

  const shareLink = () => {
    if (inviteLink) {
      Share.share({ message: `¡Únete a mi espacio en CupplesX! ${inviteLink}` });
    }
  };

  return (
    <Screen contentStyle={{ alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}>
      <View style={{ alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="heart" size={40} color={colors.primary} />
        </View>
        <Text style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' }}>
          Invita a tu pareja
        </Text>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
          Genera un link de invitación{`\n`}para que se una a tu espacio
        </Text>
      </View>

      {inviteLink ? (
        <Card style={{ width: '100%', gap: spacing.md }}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>Link de invitación</Text>
          <Text style={{ color: colors.text, fontSize: fontSize.sm }} numberOfLines={2}>{inviteLink}</Text>
          <Button label="Compartir link" onPress={shareLink} fullWidth />
        </Card>
      ) : (
        <Button label="Generar invitación" onPress={generateLink} loading={loading} fullWidth size="lg" />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('JoinCouple')}>
        <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
          ¿Tienes un link? Únete a una pareja
        </Text>
      </TouchableOpacity>

      {inviteLink && (
        <Button
          label="Ir al inicio"
          onPress={() => navigation.replace('Tabs')}
          variant="ghost"
          fullWidth
        />
      )}
    </Screen>
  );
};
