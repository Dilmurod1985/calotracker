import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4834d4', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Калории',
          tabBarIcon: ({ color }) => <Ionicons name="nutrition" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Советы',
          tabBarIcon: ({ color }) => <Ionicons name="analytics" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}