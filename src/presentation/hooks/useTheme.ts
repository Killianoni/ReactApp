import { useColorScheme } from 'react-native';
import { colors } from '../../core/theme/colors';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colors[colorScheme === 'dark' ? 'dark' : 'light'];
};