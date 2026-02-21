import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importa tus pantallas aquí
import HomeScreen from '../screens/home/HomeScreen';
import SelectBodyMuscles from '../screens/routines/SelectBodyMuscles';
import EquipmentSelector from '../screens/espacios/EquipmentSelector';
import RoutineGenerated from '../screens/routines/RoutineGenerated';
import EspaciosScreen from '../screens/espacios/EspaciosScreen';
import EspacioDetailScreen from '../screens/espacios/EspacioDetailScreen';
import SettingsScreen from '../screens/home/SettingsScreen';
import SelectEspacioForRoutine from '../screens/routines/SelectEspacioForRoutine';
import WeeklyPlan from '../screens/routines/WeeklyPlan';
import BibliotecaRutinas from '../screens/routines/BibliotecaRutinas';
import { useAuthStore } from '../store/useAuthStore';
import { Text, View } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import {
  AuthStackParamList,
  MainStackParamList,
  MainTabParamList,
} from './types';
import RoutineDetails from '../screens/routines/RoutineDetails';
import StatsScreen from '../screens/estadisticas/StatsScreen';
import { COLORS } from '../utils/COLORS';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navegador de tabs principal
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: COLORS.SECONDARY_BACKGROUND,
          borderTopColor: COLORS.SOFT_BORDER,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio', headerShown: false }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Estadisticas', headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// Navegador principal
function AppNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  if (isLoading) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <MainStack.Screen name="Main" component={MainTabs} />
          <MainStack.Screen
            name="RoutineGenerated"
            component={RoutineGenerated}
          />
          <MainStack.Screen name="Espacios" component={EspaciosScreen} />
          <MainStack.Screen
            name="EspacioDetail"
            component={EspacioDetailScreen}
          />
          <MainStack.Screen
            name="EquipmentSelector"
            component={EquipmentSelector}
          />
          <MainStack.Screen
            name="SelectEspacioForRoutine"
            component={SelectEspacioForRoutine}
          />
          <MainStack.Screen
            name="SelectBodyMusclesWithParams"
            component={SelectBodyMuscles}
          />
          <MainStack.Screen name="WeeklyPlan" component={WeeklyPlan} />
          <MainStack.Screen
            name="BibliotecaRutinas"
            component={BibliotecaRutinas}
          />
          <MainStack.Screen name="RoutineDetails" component={RoutineDetails} />
        </MainStack.Navigator>
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
