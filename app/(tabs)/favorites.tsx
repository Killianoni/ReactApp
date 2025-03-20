import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useFavorites } from '../../src/presentation/hooks/useFavorites';
import { ProductRepository } from '../../src/data/repositories/ProductRepository';
import { useTheme } from '../../src/presentation/hooks/useTheme';
import { Product } from '../../src/core/domain/entities/Product';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductCard } from '../../src/presentation/components/ProductCard';

export default function Favorites() {
  const colors = useTheme();
  const { favorites, removeFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const [isEmptyState, setIsEmptyState] = useState(false);

  useEffect(() => {
    setIsEmptyState(favorites.length === 0);
  }, [favorites]);

  useEffect(() => {
    if (isEmptyState) {
      const startBeatingAnimation = () => {
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.08,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              })
            ]),
            Animated.sequence([
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 0,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              })
            ])
          ])
        ).start();
      };

      startBeatingAnimation();
    }
  }, [isEmptyState]);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      setLoading(true);
      try {
        const productRepo = ProductRepository.getInstance();
        const productDetails = await Promise.all(
          favorites.map(async (code) => {
            try {
              return await productRepo.getProductByBarcode(code);
            } catch (error) {
              console.warn(`Failed to load product ${code}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null products and automatically remove them from favorites
        const validProducts = productDetails.filter((product): product is Product => product !== null);
        const invalidCodes = favorites.filter((code, index) => productDetails[index] === null);
        
        if (invalidCodes.length > 0) {
          // Remove invalid products from favorites
          invalidCodes.forEach(code => removeFavorite(code));
        }
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [favorites]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="loading" size={48} color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading favorites...</Text>
      </View>
    );
  }

  if (isEmptyState) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyStateContainer}>
          <View style={styles.outerGlowContainer}>
            <Animated.View 
              style={[
                styles.heartContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1]
                  })
                }
              ]}
            >
              <View style={[styles.innerGlow, { shadowColor: colors.error }]}>
                <MaterialCommunityIcons 
                  name="heart" 
                  size={84} 
                  color={colors.error}
                  style={[styles.heartIcon, { textShadowColor: colors.error }]}
                />
              </View>
            </Animated.View>
          </View>
          <Text style={[styles.emptyStateContainer, { color: colors.textLight }]}>No favorites yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            onFavorite={() => removeFavorite(item.code)}
            isFavorite={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerGlowContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGlow: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  heartIcon: {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16,
  },
  listContent: {
    padding: 8,
  },
});