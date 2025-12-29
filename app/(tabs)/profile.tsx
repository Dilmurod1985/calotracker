import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [data, setData] = useState({ kcalEaten: 0, limit: 2100, status: '', weight: 84 });

  const checkStatus = async () => {
    const mealsSaved = await AsyncStorage.getItem('meals_history');
    const weightSaved = await AsyncStorage.getItem('weight_history');
    
    let eaten = 0;
    if (mealsSaved) {
      const meals = JSON.parse(mealsSaved);
      eaten = meals
        .filter((m: any) => m.date === new Date().toLocaleDateString())
        .reduce((sum: number, m: any) => sum + m.kcal, 0);
    }

    let currentWeight = 84;
    if (weightSaved) {
      const history = JSON.parse(weightSaved);
      if (history.length > 0) currentWeight = parseFloat(history[0].value);
    }

    // Простая формула: вес * 25 (для похудения)
    const dailyLimit = Math.round(currentWeight * 25);
    setData({ kcalEaten: eaten, limit: dailyLimit, status: eaten > dailyLimit ? 'STOP' : 'OK', weight: currentWeight });
  };

  useEffect(() => { checkStatus(); }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Контроль питания</Text>
      
      <View style={[styles.card, { borderColor: data.status === 'STOP' ? '#e17055' : '#00b894', borderTopWidth: 10 }]}>
        <Text style={styles.label}>Съедено сегодня:</Text>
        <Text style={styles.value}>{data.kcalEaten} / {data.limit} ккал</Text>
        
        {data.status === 'STOP' ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠️ ЛИМИТ ПРЕВЫШЕН!</Text>
            <Text style={styles.subWarning}>На сегодня еды достаточно. Переходите на воду и отдых.</Text>
          </View>
        ) : (
          <Text style={styles.okText}>✅ Вы в рамках нормы. Можно еще {data.limit - data.kcalEaten} ккал.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.refreshBtn} onPress={checkStatus}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>ОБНОВИТЬ ДАННЫЕ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
  label: { fontSize: 16, color: '#636e72' },
  value: { fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  warningBox: { marginTop: 15, backgroundColor: '#ffeaa7', padding: 15, borderRadius: 12 },
  warningText: { color: '#d63031', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  subWarning: { textAlign: 'center', color: '#2d3436', marginTop: 5 },
  okText: { color: '#00b894', fontWeight: '600', marginTop: 10 },
  refreshBtn: { backgroundColor: '#4834d4', marginTop: 20, padding: 15, borderRadius: 15, alignItems: 'center' }
});