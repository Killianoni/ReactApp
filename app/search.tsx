import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator, 
  FlatList,
  Animated 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../src/core/theme/colors';
import { ProductCard } from '../src/presentation/components/ProductCard';
import { useFavorites } from '../src/presentation/hooks/useFavorites';
import { useSearch } from '../src/presentation/hooks/useSearch';
import { useTheme } from '../src/presentation/hooks/useTheme';  // Update import path

/**
 * Search Screen - Core product discovery interface
 * 
 * Features:
 * - Instant search-as-you-type functionality
 * - Smooth loading animations
 * - Favorites integration
 * - Theme-aware styling
 */
export default function Search() {
  const colors = useTheme();
  const [query, setQuery] = useState('');
  const { products, loading, searchProducts } = useSearch();
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      margin: 16,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
      fontSize: 16,
      color: colors.text,
      height: 24,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 64,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textLight,
    },
  });

  // Initialize entrance animation
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,  // Controls speed
      friction: 7,  // Affects bounce
      useNativeDriver: true,
    }).start();
  }, []);

  /**
 * Handles search input with debouncing and animation:
 * 1. Updates search query
 * 2. Resets animation values
 * 3. Triggers product search
 * 4. Plays loading indicator fade sequence
 */
  const handleSearch = (text: string) => {
    setQuery(text);
    fadeAnim.setValue(0);  // Reset animation
    searchProducts(text);
    
    // Loading indicator animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,  // Quick fade out
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,  // Smooth fade in
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.searchContainer,
          { 
            transform: [{ scale: scaleAnim }],
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}
      >
        <MaterialCommunityIcons name="magnify" size={24} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {loading && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <ActivityIndicator color={colors.primary} />
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
          data={products}
          keyExtractor={item => item.code}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              index={index}
              onPress={() => router.push({
                pathname: '/product-details',
                params: { barcode: item.code }
              })}
              onFavorite={() => {
                const isFavorite = favorites.includes(item.code);
                if (isFavorite) {
                  removeFavorite(item.code);
                } else {
                  addFavorite(item.code);
                }
              }}
              isFavorite={favorites.includes(item.code)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {query.length > 0 && !loading && (
                <>
                  <MaterialCommunityIcons 
                    name="file-search-outline" 
                    size={64} 
                    color={colors.textLight} 
                  />
                  <Text style={styles.emptyText}>No products found</Text>
                </>
              )}
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
}