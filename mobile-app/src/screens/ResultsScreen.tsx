import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Target, Activity, ShieldAlert, Zap, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen({ route }: any) {
  const [data, setData] = useState<any>(route?.params?.results || null);

  useEffect(() => {
    if (!data) {
      loadStoredScan();
    }
  }, []);

  const loadStoredScan = async () => {
    try {
      const stored = await AsyncStorage.getItem('cf_latest_scan');
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  };

  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <AlertCircle color="#52525b" size={32} />
        </View>
        <Text style={styles.emptyTitle}>No Active Scan Data</Text>
        <Text style={styles.emptyDesc}>Return to the scanner to initiate a new biometric analysis.</Text>
      </View>
    );
  }

  // Determine Tier Colors dynamically
  const getTierColors = (tier: string): [string, string] => {
    switch (tier) {
      case 'Chad': return ['#a855f7', '#3b82f6']; // Purple to Blue
      case 'HTN': return ['#34d399', '#14b8a6']; // Emerald to Teal
      case 'MTN': return ['#fbbf24', '#f97316']; // Amber to Orange
      case 'LTN': return ['#ef4444', '#e11d48']; // Red to Rose
      default: return ['#fbbf24', '#f97316'];
    }
  };

  const currentColors = getTierColors(data.tier);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <Text style={styles.headerSubtitle}>Your raw geometric data, processed and categorized.</Text>
      </View>

      {/* Main Score Card */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.mainScoreCard}>
        <Text style={styles.tierLabel}>CLASSIFICATION TIER</Text>
        <LinearGradient
          colors={currentColors}
          style={styles.tierGradientTextWrapper}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* RN doesn't support gradient text easily without mask, using solid for now or mask fallback. Using a styled view as badge instead */}
        </LinearGradient>
        <Text style={[styles.tierText, { color: currentColors[0] }]}>{data.tier}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.scoreRow}>
          <View>
            <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
            <Text style={styles.scoreValue}>{data.score} <Text style={styles.scoreMax}>/10</Text></Text>
          </View>
        </View>
      </Animated.View>

      {/* Core Metrics Grid */}
      <View style={styles.metricsGrid}>
        {[
          { label: "Harmony", value: data.metrics.harmony, icon: <Target color="#c084fc" size={20} /> },
          { label: "Angularity", value: data.metrics.angularity, icon: <Activity color="#60a5fa" size={20} /> },
          { label: "Dimorphism", value: data.metrics.dimorphism, icon: <ShieldAlert color="#fbbf24" size={20} /> },
          { label: "Skin Health", value: data.metrics.skin, icon: <Zap color="#34d399" size={20} /> }
        ].map((metric, idx) => (
          <Animated.View 
            key={metric.label}
            entering={FadeInUp.delay(200 + (idx * 100)).duration(600)}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              {metric.icon}
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
            
            <View style={styles.metricBottom}>
              <Text style={styles.metricValue}>{metric.value} <Text style={styles.metricMax}>/10</Text></Text>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#a855f7', '#3b82f6']}
                  start={{x:0, y:0}}
                  end={{x:1, y:0}}
                  style={[styles.progressBarFill, { width: `${(metric.value / 10) * 100}%` }]}
                />
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Raw Ratios */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.ratiosCard}>
        <Text style={styles.ratiosTitle}>Raw Ratios</Text>
        
        <View style={styles.ratioRow}>
          <Text style={styles.ratioLabel}>fWHR</Text>
          <Text style={styles.ratioValue}>{data.raw_ratios.fwhr}</Text>
        </View>
        <View style={styles.ratioRow}>
          <Text style={styles.ratioLabel}>Jaw to Face Ratio</Text>
          <Text style={styles.ratioValue}>{data.raw_ratios.jaw_to_face}</Text>
        </View>
        <View style={[styles.ratioRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <Text style={styles.ratioLabel}>Eye Spacing Ratio</Text>
          <Text style={styles.ratioValue}>{data.raw_ratios.eye_spacing}</Text>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: '#030303',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#a1a1aa',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
  },
  mainScoreCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 32,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    marginBottom: 24,
  },
  tierLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  tierGradientTextWrapper: {
    // placeholder if needed
  },
  tierText: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  scoreRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  scoreMax: {
    color: '#52525b',
    fontSize: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'space-between',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  metricLabel: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '700',
  },
  metricBottom: {
    
  },
  metricValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  metricMax: {
    color: '#52525b',
    fontSize: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#18181b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ratiosCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ratiosTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  ratioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 16,
    marginBottom: 16,
  },
  ratioLabel: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
  },
  ratioValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  }
});
