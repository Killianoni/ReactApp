import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Product } from '../../core/domain/entities/Product';
import { ProductCard } from './ProductCard';
import { useTheme } from '../hooks/useTheme';

type Props = {
  currentProduct: Product;
  recommendations: Product[];
  onSelectProduct: (product: Product) => void;
};

/**
 * Product Recommendations Component - Displays healthier alternative products
 * 
 * Features:
 * - Horizontal scroll of alternative products
 * - Automatic empty state handling
 * - Compact card layout optimized for recommendations
 * - Theme-aware styling
 */
export function ProductRecommendations({ currentProduct, recommendations, onSelectProduct }: Props) {
  const colors = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    card: {
      width: 200,
      marginRight: 12,
    },
    emptyMessage: {
      color: colors.textLight,
      fontSize: 14,
      textAlign: 'center',
      padding: 16,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Higher Protein Alternatives</Text>
      {recommendations.length > 0 ? (
        /* Recommendation scroll with optimized performance */
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {recommendations.map((product, index) => (
            <View key={product.code} style={styles.card}>
              <ProductCard
                product={product}
                onPress={() => onSelectProduct(product)}
                index={index}
                compact
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        /* Contextual empty state message */
        <Text style={styles.emptyMessage}>
          No recommendations found among {currentProduct.product_name_fr || currentProduct.product_name_en} alternatives
        </Text>
      )}
    </View>
  );
}