import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { todosApi, TodoResponse } from '../../api/todos';
import { useCoupleStore } from '../../store/coupleStore';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateTodo'>;

export const CreateTodoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { coupleId } = useCoupleStore();
  const todoId = route.params?.todoId;
  const isEditing = !!todoId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todoId && coupleId) {
      todosApi.get(coupleId, todoId).then((todo) => {
        setTitle(todo.title);
        setDescription(todo.description ?? '');
        setDate(todo.estimatedDate ?? '');
      }).catch(() => {});
    }
  }, [todoId, coupleId]);

  const onSave = async () => {
    if (!title.trim() || !coupleId) return;
    setLoading(true);
    try {
      if (isEditing && todoId) {
        await todosApi.update(coupleId, todoId, {
          title,
          description: description || undefined,
          estimatedDate: date || undefined,
        });
      } else {
        await todosApi.create(coupleId, {
          title,
          description: description || undefined,
          estimatedDate: date || undefined,
        });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    if (!coupleId || !todoId) return;
    Alert.alert('Eliminar tarea', '¿Estás segura/o?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await todosApi.delete(coupleId, todoId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen scroll keyboardAvoiding>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.xl,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
          {isEditing ? 'Editar tarea' : 'Nueva tarea'}
        </Text>
        {isEditing ? (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <Input
        label="Título"
        value={title}
        onChangeText={setTitle}
        leftIcon="create-outline"
        placeholder="¿Qué quieren hacer?"
      />
      <Input
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        leftIcon="text-outline"
        placeholder="Agrega detalles..."
        multiline
        numberOfLines={3}
      />
      <Input
        label="Fecha estimada (opcional)"
        value={date}
        onChangeText={setDate}
        leftIcon="calendar-outline"
        placeholder="YYYY-MM-DD"
      />

      <Button
        label={isEditing ? 'Guardar cambios' : 'Crear tarea'}
        onPress={onSave}
        loading={loading}
        fullWidth
        size="lg"
        style={{ marginTop: spacing.md }}
        disabled={!title.trim()}
      />
    </Screen>
  );
};
