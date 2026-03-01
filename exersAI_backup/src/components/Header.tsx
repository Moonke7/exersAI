import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/COLORS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  extraData?: string;
  extraDataIcon?: string;
  showBackButton?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  extraData,
  extraDataIcon,
}: HeaderProps) {
  const navigation = useNavigation();
  return (
    <View
      className="pt-14 pb-6 px-6 rounded-b-lg flex-col"
      style={{
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
      }}
    >
      <View className="flex-row items-center gap-8">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="py-2"
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text
          className="text-2xl font-bold"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          {title}
        </Text>
      </View>
      {extraData && (
        <View
          className="flex-row items-center gap-2"
          style={{ paddingLeft: 52 }}
        >
          {extraDataIcon && (
            <Icon
              name={extraDataIcon}
              size={16}
              color={COLORS.TEXT_SECONDARY}
            />
          )}
          <Text
            className="text-sm font-bold"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            {extraData}
          </Text>
        </View>
      )}
    </View>
  );
}
