import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { User, Settings, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient colors={['#10b981', '#059669']} style={styles.iconContainer}>
          <User color="#fff" size={20} />
        </LinearGradient>
        <Text style={styles.headerTitle}>Operative Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>G</Text>
          </View>
          <Text style={styles.name}>Guest Operative</Text>
          <Text style={styles.plan}>FREE TIER</Text>
        </View>

        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Settings color="#a1a1aa" size={20} />
            <Text style={styles.menuText}>System Preferences</Text>
          </View>
          <View style={styles.menuItem}>
            <LogOut color="#ef4444" size={20} />
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Terminate Session</Text>
          </View>
        </View>
      </View>
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
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#18181b',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  plan: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  menu: {
    width: '100%',
    backgroundColor: '#18181b',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  }
});