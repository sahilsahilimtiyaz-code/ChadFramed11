import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { ArrowLeft, Target, Activity, Shield, CheckCircle2 } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
const { width } = Dimensions.get('window');

// Mock Data for "No Fake Features" Analysis
const ANALYSIS = {
  tier: 'HTN', // Chad, HTN, MTN, LTN
  tierTitle: 'High Tier Normie',
  overallScore: 7.4,
  pillars: [
    { name: 'Harmony', score: 8.1, icon: Target, desc: 'Excellent golden ratio alignment.' },
    { name: 'Angularity', score: 6.8, icon: Activity, desc: 'Sub-optimal gonial angle.' },
    { name: 'Dimorphism', score: 7.5, icon: Shield, desc: 'Strong brow ridge projection.' },
    { name: 'Skin Health', score: 9.2, icon: CheckCircle2, desc: 'Peak clarity and vitality.' }
  ],
  directives: [
    { title: 'Lower Third Width', desc: 'Implement mastication protocol to add 2mm width.', priority: 'HIGH' },
    { title: 'Sodium Reduction', desc: 'Reduce buccal puffiness immediately.', priority: 'MED' }
  ]
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Chad': return '#10b981'; // emerald
    case 'HTN': return '#3b82f6';  // blue
    case 'MTN': return '#f59e0b';  // amber
    case 'LTN': return '#ef4444';  // red
    default: return '#f59e0b';
  }
};

export default function ResultsScreen({ navigation }: { navigation: NavigationProp }) {
  const tierColor = getTierColor(ANALYSIS.tier);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Complete</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Tier Result */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.tierSection}>
          <Text style={styles.tierLabel}>CLASSIFICATION</Text>
          <View style={[styles.tierBadge, { borderColor: tierColor, backgroundColor: `${tierColor}15` }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{ANALYSIS.tier}</Text>
          </View>
          <Text style={styles.tierSubtext}>{ANALYSIS.tierTitle}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{ANALYSIS.overallScore}</Text>
            <Text style={styles.scoreDivider}>/10</Text>
          </View>
        </Animated.View>

        {/* Pillars */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>THE FOUR PILLARS</Text>
          <View style={styles.pillarsGrid}>
            {ANALYSIS.pillars.map((pillar, i) => (
              <View key={i} style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <pillar.icon color={tierColor} size={20} />
                  <Text style={styles.pillarScore}>{pillar.score}</Text>
                </View>
                <Text style={styles.pillarName}>{pillar.name}</Text>
                <Text style={styles.pillarDesc}>{pillar.desc}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Plan */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>HARD TRUTH DIRECTIVES</Text>
          {ANALYSIS.directives.map((dir, i) => (
            <View key={i} style={styles.directiveCard}>
              <View style={styles.directiveHeader}>
                <Text style={styles.directiveTitle}>{dir.title}</Text>
                <View style={[styles.priorityBadge, dir.priority === 'HIGH' ? styles.priorityHigh : styles.priorityMed]}>
                  <Text style={styles.priorityText}>{dir.priority}</Text>
                </View>
              </View>
              <Text style={styles.directiveDesc}>{dir.desc}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeIn.delay(1000).duration(800)} style={styles.footer}>
           <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Build Full Roadmap</Text>
           </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
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
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 12,
  },
  tierBadge: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  tierText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tierSubtext: {
    color: '#a1a1aa',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
  },
  scoreDivider: {
    color: '#52525b',
    fontSize: 32,
    fontWeight: '600',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
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
    width: (width - 48 - 16) / 2, // 2 cols minus padding and gap
    backgroundColor: '#18181b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillarScore: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  pillarName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  pillarDesc: {
    color: '#71717a',
    fontSize: 12,
    lineHeight: 16,
  },
  directiveCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  directiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  directiveTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingRight: 16,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // red
  },
  priorityMed: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  directiveDesc: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});