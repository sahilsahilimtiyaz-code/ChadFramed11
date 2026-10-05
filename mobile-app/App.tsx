import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { ScanFace, Cpu, History, User } from 'lucide-react-native';

import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import FaceGPTScreen from './src/screens/FaceGPTScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  MainTabs: undefined;
  Scanner: undefined;
  Results: { 
    tier: string; 
    score: number; 
    harmony: number; 
    angularity: number; 
    dimorphism: number; 
    skin: number;
  };
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const iconProps = { 
            size: 24, 
            color: focused ? '#f59e0b' : '#71717a',
            strokeWidth: focused ? 2.5 : 2
          };
          
          if (route.name === 'HomeTab') return <ScanFace {...iconProps} />;
          if (route.name === 'FaceGPT') return <Cpu {...iconProps} />;
          if (route.name === 'History') return <History {...iconProps} />;
          if (route.name === 'Profile') return <User {...iconProps} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="FaceGPT" component={FaceGPTScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Scanner and Results remain full screen outside the tab bar */}
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Results" component={ResultsScreen as any} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent', // Handled by BlurView
    height: Platform.OS === 'ios' ? 85 : 65,
  }
});