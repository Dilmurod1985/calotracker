import { Ionicons } from '@expo/vector-icons'; // Библиотека иконок
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#00b894',
      headerShown: false, 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Калории',
          tabBarIcon: ({ color }) => <Ionicons name="nutrition" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Вес',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}