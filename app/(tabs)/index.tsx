import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/presentation/hooks/useTheme';
import { MotiView } from 'moti';

export default function Index() {
  const router = useRouter();
  const colors = useTheme();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
        style={styles.header}
      >
        <BlurView 
          intensity={colorScheme === 'dark' ? 40 : 60} 
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={[styles.blurContainer, { backgroundColor: colors.surface + '80' }]}
        >
          <MaterialCommunityIcons 
            name="barcode-scan" 
            size={84} 
            color={colors.primary} 
          />
          <Text style={[styles.title, { color: colors.text }]}>Product Scanner</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Scan or search for products to check their details
          </Text>
        </BlurView>
      </MotiView>

      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 200, damping: 15 }}
        >
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/scanner')}
          >
            <MaterialCommunityIcons 
              name="barcode-scan" 
              size={32} 
              color={colors.surface} 
            />
            <Text style={[styles.buttonText, { color: colors.surface }]}>
              Scan a Product
            </Text>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 300, damping: 15 }}
        >
          <TouchableOpacity
            style={[styles.secondaryButton, { 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }]}
            onPress={() => router.push('/search')}
          >
            <MaterialCommunityIcons 
              name="magnify" 
              size={32} 
              color={colors.primary} 
            />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Search Products
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  blurContainer: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});