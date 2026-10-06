import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { Camera, BarChart3, Target, Brain, Activity, Shield, ChevronRight } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Scanner');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.logoWrapper}>
          <LinearGradient
            colors={['#9333ea', '#3b82f6']} // Purple to Blue
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoC}>CF</Text>
          </LinearGradient>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.logoText}>
          ChadFramed
        </Animated.Text>
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI-Powered Facial Analysis</Text>
          </View>
          <Text style={styles.title}>
            Elevate Your{'\n'}
            <Text style={styles.titleHighlight}>Appearance.</Text>
          </Text>
          <Text style={styles.description}>
            Ascend to your highest aesthetic potential. Get a brutally honest, measurable breakdown of your facial structure and proportions.
          </Text>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(500).duration(800)}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleScanPress}
          >
            <LinearGradient
              colors={['#9333ea', '#3b82f6']}
              style={styles.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Camera color="#fff" size={20} />
              <Text style={styles.primaryButtonText}>Analyze My Face</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Features Grid */}
      <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>Deep Facial Metrics Analysis.</Text>
        <Text style={styles.sectionSubtitle}>Detailed, mathematically accurate breakdowns.</Text>
        
        <View style={styles.featureGrid}>
          
          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
              <BarChart3 color="#60a5fa" size={24} />
            </View>
            <Text style={styles.featureTitle}>Facial Rating</Text>
            <Text style={styles.featureDesc}>AI-generated assessment based purely on measurable geometric proportions.</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
              <Target color="#c084fc" size={24} />
            </View>
            <Text style={styles.featureTitle}>Metrics Breakdown</Text>
            <Text style={styles.featureDesc}>Detailed analysis of crucial features including symmetry, fWHR, and gonial angles.</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' }]}>
              <Brain color="#f472b6" size={24} />
            </View>
            <Text style={styles.featureTitle}>AI Coach</Text>
            <Text style={styles.featureDesc}>Ask specific questions and receive data-driven guidance on improvement strategies.</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
              <Activity color="#fbbf24" size={24} />
            </View>
            <Text style={styles.featureTitle}>Harmony Tracking</Text>
            <Text style={styles.featureDesc}>Monitor your overall aesthetic balance and identify disrupting features.</Text>
          </View>

        </View>
      </Animated.View>
      
      <View style={{height: 100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  logoWrapper: {
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoC: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSection: {
    marginBottom: 50,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: 20,
  },
  badgeText: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 54,
    letterSpacing: -1.5,
    marginBottom: 16,
  },
  titleHighlight: {
    color: '#c084fc', // Backup solid color if gradient text isn't available easily in basic RN
  },
  description: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 32,
    paddingRight: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  metricsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#a1a1aa',
    fontSize: 15,
    marginBottom: 32,
    fontWeight: '500',
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  featureDesc: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  }
});
