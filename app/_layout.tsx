import { Stack } from 'expo-router';
import { FavoritesProvider } from '../src/presentation/context/FavoritesContext';
import { useTheme } from '../src/presentation/hooks/useTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SearchContextProvider } from '../src/presentation/context/SearchContext';

export default function Layout() {
  const colors = useTheme();

  return (
    <SearchContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FavoritesProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.surface,
              headerTitleStyle: {
                fontWeight: '600',
              },
              animation: 'fade_from_bottom',
              animationDuration: 200,
              contentStyle: {
                backgroundColor: colors.background,
              },
              headerBackTitle: 'Back',
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="scanner" 
              options={{ 
                title: 'Scan Barcode',
                presentation: 'modal',
                headerBackTitle: 'Scanner',
              }} 
            />
            <Stack.Screen 
              name="product-details" 
              options={{ 
                title: 'Product Details',
                headerBackTitle: 'Back',
              }} 
            />
            <Stack.Screen 
              name="search" 
              options={{ 
                title: 'Search Products',
                headerBackTitle: 'Scanner',
              }} 
            />
          </Stack>
        </FavoritesProvider>
      </GestureHandlerRootView>
    </SearchContextProvider>
  );
}