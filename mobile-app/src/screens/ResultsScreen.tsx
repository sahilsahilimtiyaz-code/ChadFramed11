import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, withSpring } from 'react-native-reanimated';
import { ArrowLeft, Target, Activity, Shield, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
const { width } = Dimensions.get('window');

const ANALYSIS = {
  tier: 'HTN', 
  tierTitle: 'HIGH TIER NORMIE',
  overallScore: 7.4,
  pillars: [
    { name: 'Harmony', score: 8.1, icon: Target, desc: 'Optimal ratio alignment.' },
    { name: 'Angularity', score: 6.8, icon: Activity, desc: 'Gonial angle variance.' },
    { name: 'Dimorphism', score: 7.5, icon: Shield, desc: 'High masculine markers.' },
    { name: 'Skin Health', score: 9.2, icon: CheckCircle2, desc: 'Peak clarity detected.' }
  ],
  directives: [
    { title: 'Lower Third Width', desc: 'Implement mastication protocol to induce 2mm lateral expansion.', priority: 'HIGH' },
    { title: 'Sodium Reduction', desc: 'Clear subcutaneous water retention to expose underlying angularity.', priority: 'MED' }
  ]
};

const getTierColor = (tier: string): [string, string, ...string[]] => {
  switch (tier) {
    case 'Chad': return ['#10b981', '#059669']; // Emerald gradient
    case 'HTN': return ['#3b82f6', '#2563eb'];  // Blue gradient
    case 'MTN': return ['#f59e0b', '#d97706'];  // Amber gradient
    case 'LTN': return ['#ef4444', '#dc2626'];  // Red gradient
    default: return ['#f59e0b', '#d97706'];
  }
};

export default function ResultsScreen({ navigation }: { navigation: NavigationProp }) {
  const tierColors = getTierColor(ANALYSIS.tier);
  
  // Score animation
  const scoreValue = useSharedValue(0);

  useEffect(() => {
    scoreValue.value = withDelay(800, withSpring(ANALYSIS.overallScore, { damping: 12, stiffness: 90 }));
    // Trigger haptics when results land
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 800);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[`${tierColors[0]}15`, '#000000', '#000000'] as [string, string, ...string[]]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Home');
          }} 
          style={styles.backButton}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BIOMETRIC REPORT</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Tier Result */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.tierSection}>
          <Text style={styles.tierLabel}>SYSTEM CLASSIFICATION</Text>
          
          <LinearGradient
            colors={tierColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tierBadgeWrapper}
          >
            <View style={styles.tierBadgeInner}>
              <Text style={styles.tierText}>{ANALYSIS.tier}</Text>
            </View>
          </LinearGradient>
          
          <Text style={styles.tierSubtext}>{ANALYSIS.tierTitle}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{ANALYSIS.overallScore}</Text>
            <Text style={styles.scoreDivider}>/10</Text>
          </View>
        </Animated.View>

        {/* Pillars */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>CORE PILLARS</Text>
          <View style={styles.pillarsGrid}>
            {ANALYSIS.pillars.map((pillar, i) => (
              <BlurView key={i} intensity={20} tint="dark" style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <pillar.icon color={tierColors[0]} size={20} strokeWidth={2} />
                  <Text style={styles.pillarScore}>{pillar.score}</Text>
                </View>
                <Text style={styles.pillarName}>{pillar.name}</Text>
                <Text style={styles.pillarDesc}>{pillar.desc}</Text>
              </BlurView>
            ))}
          </View>
        </Animated.View>

        {/* Action Plan */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>HARD TRUTH DIRECTIVES</Text>
          {ANALYSIS.directives.map((dir, i) => (
            <BlurView key={i} intensity={20} tint="dark" style={styles.directiveCard}>
              <View style={styles.directiveHeader}>
                <Text style={styles.directiveTitle}>{dir.title}</Text>
                <View style={[styles.priorityBadge, dir.priority === 'HIGH' ? styles.priorityHigh : styles.priorityMed]}>
                  <Text style={styles.priorityText}>{dir.priority}</Text>
                </View>
              </View>
              <Text style={styles.directiveDesc}>{dir.desc}</Text>
            </BlurView>
          ))}
        </Animated.View>

      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View entering={FadeInDown.delay(1000).duration(800).springify()} style={styles.floatingCTA}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <LinearGradient
            colors={['#fff', '#e4e4e7']}
            style={styles.actionButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.actionButtonText}>GENERATE ROADMAP</Text>
            <ChevronRight color="#000" size={20} strokeWidth={3} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    flex: 1,
    padding: 24,
  },
  tierSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  tierLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 16,
  },
  tierBadgeWrapper: {
    padding: 2,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tierBadgeInner: {
    backgroundColor: '#000',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 22,
  },
  tierText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tierSubtext: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 24,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -3,
  },
  scoreDivider: {
    color: '#52525b',
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 20,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  pillarCard: {
    width: (width - 48 - 16) / 2, 
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillarScore: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  pillarName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  pillarDesc: {
    color: '#71717a',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  directiveCard: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  directiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  directiveTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    paddingRight: 16,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', 
  },
  priorityMed: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)', 
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  directiveDesc: {
    color: '#a1a1aa',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  floatingCTA: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 24,
    right: 24,
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});