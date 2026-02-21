import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../utils/COLORS';

export default function LoadingScreen({ message }: { message: string }) {
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: COLORS.Background }}
    >
      <ActivityIndicator size="large" color={COLORS.TEXT_PRIMARY} />
      <Text className="mt-3 text-base" style={{ color: COLORS.TEXT_PRIMARY }}>
        {message}
      </Text>
    </View>
  );
}
