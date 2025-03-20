import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useProduct } from '../src/presentation/hooks/useProduct';
import { useFavorites } from '../src/presentation/hooks/useFavorites';
import { useTheme } from '../src/presentation/hooks/useTheme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { searchContext } from '../src/presentation/hooks/useSearch';
import { ProductRecommendations } from '../src/presentation/components/ProductRecommendations';
import { usePathname } from 'expo-router';

export default function ProductDetails() {
  const colors = useTheme();
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { product, error, loading } = useProduct(barcode);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const router = useRouter();
  const { lastSearchResults } = useContext(searchContext);
  const pathname = usePathname();
  const isFromFavorites = pathname.includes('favorites');

  const getRecommendations = () => {
    if (!product || !lastSearchResults.length) return [];
    
    const currentProteinRatio = product.proteins && product.calories ? 
      (product.proteins * 4 / product.calories) * 100 : 0;

    return lastSearchResults
      .filter(p => 
        p.code !== product.code && 
        p.proteins && 
        p.calories &&
        ((p.proteins * 4 / p.calories) * 100) > Math.max(currentProteinRatio, 15) // Only recommend products with >15% protein ratio
      )
      .sort((a, b) => 
        ((b.proteins || 0) * 4 / (b.calories || 1)) - 
        ((a.proteins || 0) * 4 / (a.calories || 1))
      )
      .slice(0, 5);
  };

  const bounceAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  const getProteinScore = (calories: number, proteins: number) => {
    const proteinRatio = (proteins * 4 / calories) * 100;
    
    if (proteinRatio >= 30) {
      return {
        text: "Excellent source protéique",
        color: colors.success,
        icon: "dumbbell" // Changed from "weight-lifter" to "dumbbell"
      };
    } else if (proteinRatio >= 20) {
      return {
        text: "Bonne source protéique",
        color: colors.primary,
        icon: "thumb-up"
      };
    } else if (proteinRatio >= 10) {
      return {
        text: "Source modérée de protéines",
        color: colors.accent,
        icon: "scale-balance"
      };
    } else {
      return {
        text: "Faible en protéines",
        color: colors.textLight,
        icon: "information"
      };
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    header: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    barcode: {
      fontSize: 14,
      color: '#666',
    },
    nutritionCard: {
      margin: 16,
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    scoreContainer: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scoreText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.surface,
    },
    scoreLabel: {
      fontSize: 14,
      color: colors.surface,
      marginTop: 4,
    },
    nutritionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    portion: {
      fontSize: 14,
      color: colors.textLight,
      marginBottom: 16,
    },
    favoriteButton: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      marginLeft: 8,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },
    errorContent: {
      alignItems: 'center',
      width: '100%',
      maxWidth: 320,
    },
    errorTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.error,
      marginTop: 20,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      marginTop: 8,
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.textLight,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 32,
    },
    buttonContainer: {
      width: '100%',
      gap: 12,
    },
    buttonIcon: {
      marginRight: 8,
    },
    tryAgainButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    tryAgainText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    searchText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: 16,
      margin: 20,
    },
  });

  React.useEffect(() => {
    if (error) {
      Animated.parallel([
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 10,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [product]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Animated.View
          style={[
            styles.errorContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons 
            name="barcode-off" 
            size={80} 
            color={colors.error} 
          />
          <Text style={styles.errorTitle}>Product Not Found</Text>
          <Text style={styles.errorMessage}>
            We couldn't find this product in our database
          </Text>
          <Text style={styles.errorSubtext}>
            Try scanning the barcode again or search for the product manually
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons 
                name="barcode-scan" 
                size={24} 
                color={colors.surface} 
                style={styles.buttonIcon}
              />
              <Text style={styles.tryAgainText}>Scan Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.push('/search')}
            >
              <MaterialCommunityIcons 
                name="magnify" 
                size={24} 
                color={colors.primary}
                style={styles.buttonIcon}
              />
              <Text style={styles.searchText}>Search Products</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (loading || !product) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="loading" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(product.code);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {product.product_name_fr || product.product_name_en}
          </Text>
          <Text style={[styles.barcode, { color: colors.textLight }]}>
            Code: {product.code}
          </Text>
        </View>

        <View style={[styles.nutritionCard, { 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations nutritionnelles
          </Text>
          <Text style={[styles.portion, { color: colors.textLight }]}>
            Pour 100g
          </Text>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Calories</Text>
            <Text style={styles.value}>{product.calories.toFixed(2)} kcal</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Glucides</Text>
            <Text style={styles.value}>{product.carbohydrates?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>dont Sucres</Text>
            <Text style={styles.value}>{product.sugars?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Matières grasses</Text>
            <Text style={styles.value}>{product.fat?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>dont Acides gras saturés</Text>
            <Text style={styles.value}>{product.saturated_fat?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Protéines</Text>
            <Text style={styles.value}>{product.proteins?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Fibres</Text>
            <Text style={styles.value}>{product.fiber?.toFixed(2) || 0}g</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.label}>Sel</Text>
            <Text style={styles.value}>{product.salt?.toFixed(2) || 0}g</Text>
          </View>

          {/* Add protein score here */}
          {product.proteins && product.calories ? (
            <View style={[styles.scoreContainer, { backgroundColor: getProteinScore(product.calories, product.proteins).color }]}>
              <View>
                <Text style={styles.scoreText}>Score Protéique</Text>
                <Text style={styles.scoreLabel}>{getProteinScore(product.calories, product.proteins).text}</Text>
              </View>
              <MaterialCommunityIcons 
                name={getProteinScore(product.calories, product.proteins).icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={24} 
                color={colors.surface} 
              />
            </View>
          ) : null}
        </View>

        {/* Add this after the nutrition card, before the favorite button */}
        {!isFromFavorites && product && product.proteins && product.calories && (
          <ProductRecommendations
            currentProduct={product}
            recommendations={getRecommendations()}
            onSelectProduct={(newProduct) => 
              router.push({
                pathname: '/product-details',
                params: { barcode: newProduct.code }
              })
            }
          />
        )}

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: isFavorite ? colors.error : colors.success }
          ]}
          onPress={() => isFavorite ? removeFavorite(product.code) : addFavorite(product.code)}
        >
          <MaterialCommunityIcons 
            name={isFavorite ? "heart-broken" : "heart"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}