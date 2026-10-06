import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BarChart3, MessageSquare, Settings } from 'lucide-react-native';
import { View } from 'react-native';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import FaceGPTScreen from './src/screens/FaceGPTScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Scanner: undefined;
  Results: { imageUri: string; results: any };
};

export type TabParamList = {
  Home: undefined;
  Metrics: undefined;
  Coach: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#222222',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#a855f7', // Purple-500 equivalent
        tabBarInactiveTintColor: '#52525b', // Zinc-500
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Metrics" 
        component={ResultsScreen} // We'll adapt ResultsScreen to show historical or empty metrics when not passed data directly
        options={{
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Coach" 
        component={FaceGPTScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={24} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#030303' }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="MainTabs"
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#030303' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen} 
            options={{ animation: 'fade' }}
          />
          {/* We keep a standalone Results screen for immediate post-scan viewing, distinct from the Metrics tab if needed, but in this setup, the Metrics tab serves as the main dashboard */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
