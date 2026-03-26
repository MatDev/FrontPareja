import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../theme';
import { todosApi, TodoResponse, TodoStatus } from '../../api/todos';
import { useCoupleStore } from '../../store/coupleStore';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const TodosScreen: React.FC = () => {
  const { colors, fontSize, fontWeight, spacing, borderRadius } = useTheme();
  const navigation = useNavigation<Nav>();
  const { coupleId } = useCoupleStore();
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [filter, setFilter] = useState<TodoStatus | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!coupleId) return;
    setLoading(true);
    try {
      const data = await todosApi.list(coupleId, filter);
      setTodos(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [coupleId, filter]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (todo: TodoResponse) => {
    if (!coupleId) return;
    const newStatus: TodoStatus = todo.status === 'PENDING' ? 'DONE' : 'PENDING';
    try {
      const updated = await todosApi.update(coupleId, todo.id, { title: todo.title, description: todo.description, status: newStatus, estimatedDate: todo.estimatedDate });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch {}
  };

  const renderTodo = ({ item }: { item: TodoResponse }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CreateTodo', { todoId: item.id })}>
      <Card
        style={{
          marginBottom: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => toggleStatus(item)}>
          <Ionicons
            name={item.status === 'DONE' ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={item.status === 'DONE' ? colors.success : colors.textSecondary}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: item.status === 'DONE' ? colors.textDisabled : colors.text,
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              textDecorationLine: item.status === 'DONE' ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
          {item.description ? (
            <Text
              style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 }}
              numberOfLines={1}
            >
              {item.description}
            </Text>
          ) : null}
          {item.estimatedDate ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Ionicons name="calendar-outline" size={12} color={colors.textDisabled} />
              <Text style={{ color: colors.textDisabled, fontSize: fontSize.xs }}>
                {new Date(item.estimatedDate).toLocaleDateString('es-ES')}
              </Text>
            </View>
          ) : null}
        </View>
        {item.images.length > 0 && (
          <Ionicons name="image-outline" size={18} color={colors.textSecondary} />
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen edges={['top']} contentStyle={{ paddingBottom: 0 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>Tareas</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTodo', {})}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        {([undefined, 'PENDING', 'DONE'] as (TodoStatus | undefined)[]).map((f) => {
          const label = f === undefined ? 'Todas' : f === 'PENDING' ? 'Pendientes' : 'Listas';
          const active = filter === f;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.full,
                backgroundColor: active ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.border,
              }}
            >
              <Text
                style={{
                  color: active ? '#FFF' : colors.textSecondary,
                  fontSize: fontSize.sm,
                  fontWeight: fontWeight.medium,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!coupleId ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <Ionicons name="heart-outline" size={48} color={colors.textDisabled} />
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Conecta con tu pareja para compartir tareas
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(i) => i.id}
          onRefresh={load}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: spacing['2xl'],
                gap: spacing.md,
              }}
            >
              <Ionicons name="checkbox-outline" size={48} color={colors.textDisabled} />
              <Text style={{ color: colors.textSecondary }}>No hay tareas todavía</Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl }}
        />
      )}
    </Screen>
  );
};
