import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TodosScreen } from '../screens/todos/TodosScreen';
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { CreateTodoScreen } from '../screens/todos/CreateTodoScreen';
import { CreateProfileScreen } from '../screens/onboarding/CreateProfileScreen';
import { CreateCoupleScreen } from '../screens/onboarding/CreateCoupleScreen';
import { JoinCoupleScreen } from '../screens/onboarding/JoinCoupleScreen';

export type AppStackParamList = {
  Tabs: undefined;
  CreateTodo: { todoId?: string };
  CreateProfile: undefined;
  CreateCouple: undefined;
  JoinCouple: undefined;
};

export type TabParamList = {
  Home: undefined;
  Todos: undefined;
  Calendar: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

const TabNavigator: React.FC = () => {
  const { colors, fontSize } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['heart', 'heart-outline'],
            Todos: ['checkbox', 'checkbox-outline'],
            Calendar: ['calendar', 'calendar-outline'],
            Profile: ['person-circle', 'person-circle-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Todos" component={TodosScreen} options={{ tabBarLabel: 'Tareas' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Ciclo' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={TabNavigator} />
    <Stack.Screen name="CreateTodo" component={CreateTodoScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
    <Stack.Screen name="CreateCouple" component={CreateCoupleScreen} />
    <Stack.Screen name="JoinCouple" component={JoinCoupleScreen} />
  </Stack.Navigator>
);
