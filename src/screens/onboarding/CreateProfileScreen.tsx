import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useTheme } from '../../theme';
import { usersApi } from '../../api/users';
import { useAuthStore } from '../../store/authStore';
import { AppStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateProfile'>;

export const CreateProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { displayName: storedName } = useAuthStore();
  const [name, setName] = useState(storedName ?? '');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const onSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await usersApi.createProfile({ displayName: name, avatarUrl: avatarUri });
      navigation.navigate('CreateCouple');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al crear perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      keyboardAvoiding
      contentStyle={{ alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}
    >
      <Text style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' }}>
        Tu perfil
      </Text>
      <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
        Personaliza cómo te verá tu pareja
      </Text>

      <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', gap: spacing.sm }}>
        <Avatar uri={avatarUri} name={name} size={100} />
        <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
          Cambiar foto
        </Text>
      </TouchableOpacity>

      <Input
        label="Tu nombre"
        value={name}
        onChangeText={setName}
        leftIcon="person-outline"
        placeholder="¿Cómo te llamas?"
        containerStyle={{ width: '100%' }}
      />

      <Button label="Continuar" onPress={onSubmit} loading={loading} fullWidth size="lg" />
    </Screen>
  );
};
