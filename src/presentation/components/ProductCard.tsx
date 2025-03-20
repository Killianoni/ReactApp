import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

type Props = {
  product: {
    code: string;
    product_name_fr?: string;
    product_name_en?: string;
    calories?: number;
    portion?: string;
  };
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  index: number;
  compact?: boolean; // Add the compact prop
};

export const ProductCard = ({ product, onPress, onFavorite, isFavorite, index, compact }: Props) => {
  const colors = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Skip rendering products without any display name
  if (!product.product_name_fr && !product.product_name_en) {
    return null;
  }

  /**
   * Entrance animation sequence:
   * 1. Staggered delay based on item index
   * 2. Parallel scale up + fade in animation
   * 3. Spring physics for natural movement
   */
  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  return (
    /**
     * Main card container with conditional compact layout:
     * - Default: Responsive width with margins
     * - Compact: Full width for horizontal lists
     */
    <Animated.View style={[
      styles.container,
      compact && { width: '100%' }
    ]}>
      <TouchableOpacity 
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          compact && { padding: 8 } // Add compact-specific padding
        ]} 
        onPress={onPress}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {product.product_name_fr || product.product_name_en}
            </Text>
            <TouchableOpacity 
              style={[styles.favoriteButton, { 
                backgroundColor: isFavorite ? colors.error : colors.success,
                borderColor: colors.border,
              }]} 
              onPress={onFavorite}
            >
              <MaterialCommunityIcons 
                name={isFavorite ? "heart-broken" : "heart"} 
                size={20} 
                color={colors.surface} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.details}>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="fire" size={16} color={colors.accent} />
              <Text style={[styles.statText, { color: colors.textLight }]}>{product.calories} cal</Text>
            </View>
            {product.portion && (
              <View style={styles.stat}>
                <MaterialCommunityIcons name="food-variant" size={16} color={colors.textLight} />
                <Text style={[styles.statText, { color: colors.textLight }]}>{product.portion}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  details: {
    marginTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
  },
});
