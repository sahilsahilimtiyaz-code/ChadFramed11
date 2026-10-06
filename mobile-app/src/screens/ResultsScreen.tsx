import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, withSpring } from 'react-native-reanimated';
import { ArrowLeft, Target, Activity, Shield, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type ResultsRouteProp = RouteProp<RootStackParamList, 'Results'>;

const { width } = Dimensions.get('window');

const getTierColor = (tier: string): [string, string, ...string[]] => {
  switch (tier) {
    case 'Chad': return ['#06b6d4', '#8b5cf6']; // Cyan to Purple (Holographic)
    case 'HTN': return ['#8b5cf6', '#d946ef'];  // Purple to Fuchsia
    case 'MTN': return ['#94a3b8', '#475569'];  // Silver / Slate
    case 'LTN': return ['#ef4444', '#991b1b'];  // Red / Dark Red
    default: return ['#06b6d4', '#8b5cf6'];
  }
};

const getTierTitle = (tier: string) => {
  switch (tier) {
    case 'Chad': return 'APEX TIER';
    case 'HTN': return 'HIGH TIER NORMIE';
    case 'MTN': return 'MID TIER NORMIE';
    case 'LTN': return 'LOW TIER NORMIE';
    default: return 'UNKNOWN';
  }
};

const generateDirectives = (tier: string) => {
  if (tier === 'Chad' || tier === 'HTN') {
    return [
      { title: 'Maintain Protocol', desc: 'Current biometric state is optimal. Continue maintenance regimen.', priority: 'LOW' },
      { title: 'Micro-Optimization', desc: 'Focus on skin vitality and sleep hygiene for 1% gains.', priority: 'LOW' }
    ];
  } else if (tier === 'MTN') {
    return [
      { title: 'Sodium Reduction', desc: 'Clear subcutaneous water retention to expose underlying angularity.', priority: 'MED' },
      { title: 'Masseter Hypertrophy', desc: 'Implement mastication protocol to induce 2mm lateral expansion.', priority: 'MED' }
    ];
  } else {
    return [
      { title: 'Aggressive Cutting', desc: 'Body fat reduction required to reveal facial bone structure.', priority: 'HIGH' },
      { title: 'Surgical Consult', desc: 'Evaluate orthogonal misalignment and bimaxillary recession.', priority: 'HIGH' }
    ];
  }
};

export default function ResultsScreen({ navigation, route }: { navigation: NavigationProp, route: ResultsRouteProp }) {
  const params = route.params || { tier: 'HTN', score: 7.4, harmony: 8.1, angularity: 6.8, dimorphism: 7.5, skin: 9.2 };
  
  const tierColors = getTierColor(params.tier);
  const tierTitle = getTierTitle(params.tier);
  const directives = generateDirectives(params.tier);

  // Score animation
  const scoreValue = useSharedValue(0);

  useEffect(() => {
    scoreValue.value = withDelay(800, withSpring(params.score, { damping: 12, stiffness: 90 }));
    // Trigger haptics when results land
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 800);
  }, [params.score]);

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
            navigation.navigate('MainTabs');
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
              <Text style={styles.tierText}>{params.tier}</Text>
            </View>
          </LinearGradient>
          
          <Text style={styles.tierSubtext}>{tierTitle}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{params.score}</Text>
            <Text style={styles.scoreDivider}>/10</Text>
          </View>
        </Animated.View>

        {/* Pillars */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>CORE PILLARS</Text>
          <View style={styles.pillarsGrid}>
            
            <BlurView intensity={20} tint="dark" style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <Target color={tierColors[0]} size={20} strokeWidth={2} />
                <Text style={styles.pillarScore}>{params.harmony > 10 ? 9.9 : params.harmony < 1 ? 1.0 : params.harmony}</Text>
              </View>
              <Text style={styles.pillarName}>Harmony</Text>
              <Text style={styles.pillarDesc}>Ratio alignment metric.</Text>
            </BlurView>
            
            <BlurView intensity={20} tint="dark" style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <Activity color={tierColors[0]} size={20} strokeWidth={2} />
                <Text style={styles.pillarScore}>{params.angularity > 10 ? 9.9 : params.angularity < 1 ? 1.0 : params.angularity}</Text>
              </View>
              <Text style={styles.pillarName}>Angularity</Text>
              <Text style={styles.pillarDesc}>Bone definition index.</Text>
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <Shield color={tierColors[0]} size={20} strokeWidth={2} />
                <Text style={styles.pillarScore}>{params.dimorphism > 10 ? 9.9 : params.dimorphism < 1 ? 1.0 : params.dimorphism}</Text>
              </View>
              <Text style={styles.pillarName}>Dimorphism</Text>
              <Text style={styles.pillarDesc}>Masculine marker analysis.</Text>
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <CheckCircle2 color={tierColors[0]} size={20} strokeWidth={2} />
                <Text style={styles.pillarScore}>{params.skin > 10 ? 9.9 : params.skin < 1 ? 1.0 : params.skin}</Text>
              </View>
              <Text style={styles.pillarName}>Skin Health</Text>
              <Text style={styles.pillarDesc}>Vitality and clarity.</Text>
            </BlurView>

          </View>
        </Animated.View>

        {/* Action Plan */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>HARD TRUTH DIRECTIVES</Text>
          {directives.map((dir, i) => (
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
    borderRadius: 8,
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
    borderRadius: 8,
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
    borderRadius: 6,
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple
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
    borderRadius: 2,
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