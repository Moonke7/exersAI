import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

// Define the authentication stack routes
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Define the main tab routes
export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

// Define the main stack routes (includes tabs and other screens)
export type MainStackParamList = {
  Main: undefined;
  RoutineGenerated: {
    espacioId?: number;
    splits?: any;
    selectedMuscles?: string[];
    selectedEquipment?: number[];
    customName?: string;
    dayOfWeek?: string;
    source?: 'split' | 'standalone';
    routineName?: string;
  };
  Espacios: undefined;
  EspacioDetail: { espacioId: number; espacioName: string };
  EquipmentSelector: { espacioId: number };
  SelectEspacioForRoutine: {
    routineName?: string;
    routinePreset?: string;
  };
  SelectBodyMusclesWithParams: {
    dayOfWeek?: string;
    customName?: string;
    source?: 'split' | 'standalone';
    espacioId?: number;
    routineName?: string;
    routinePreset?: string;
  };
  WeeklyPlan: undefined;
  BibliotecaRutinas: undefined;
  RoutineDetails: { rutinaId: number };
};

// Define the navigation prop types for each screen
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export type StatsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Stats'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export type EquipmentSelectorNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'EquipmentSelector'
>;

export type RoutineGeneratedNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'RoutineGenerated'
>;
