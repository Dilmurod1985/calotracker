import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [data, setData] = useState({ kcalEaten: 0, limit: 2100, weight: 84, status: 'OK' });

  const updateDashboard = async () => {
    const mealsSaved = await AsyncStorage.getItem('meals_history');
    const weightSaved = await AsyncStorage.getItem('weight_history');
    
    let eaten = 0;
    if (mealsSaved) {
      const history = JSON.parse(mealsSaved);
      eaten = history
        .filter((m: any) => m.date === new Date().toLocaleDateString())
        .reduce((sum: number, m: any) => sum + m.kcal, 0);
    }

    let w = 84;
    if (weightSaved) {
      const wHistory = JSON.parse(weightSaved);
      if (wHistory.length > 0) w = parseFloat(wHistory[0].value);
    }

    const dailyLimit = Math.round(w * 25); // Формула для похудения
    setData({ kcalEaten: eaten, limit: dailyLimit, weight: w, status: eaten > dailyLimit ? 'STOP' : 'OK' });
  };

  useEffect(() => { updateDashboard(); }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Умный Помощник</Text>
      
      <View style={[styles.card, { borderTopColor: data.status === 'STOP' ? '#e17055' : '#00b894' }]}>
        <Text style={styles.label}>Прогресс калорий:</Text>
        <Text style={styles.kcalValue}>{data.kcalEaten} / {data.limit} ккал</Text>
        
        {data.status === 'STOP' ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⛔️ НА СЕГОДНЯ ХВАТИТ!</Text>
            <Text style={styles.subText}>Вы достигли лимита для веса {data.weight} кг. Переходите на воду.</Text>
          </View>
        ) : (
          <Text style={styles.okText}>✅ Можно еще съесть: {data.limit - data.kcalEaten} ккал</Text>
        )}
      </View>

      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>🍎 Рекомендация:</Text>
        <Text style={styles.adviceText}>
          {data.status === 'STOP' 
            ? "Вечером лучше выпить травяной чай без сахара. Завтра начните день со стакана воды." 
            : "Старайтесь распределять оставшиеся калории так, чтобы ужин был легким (белок + овощи)."}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={updateDashboard}>
        <Text style={styles.btnText}>ОБНОВИТЬ ДАННЫЕ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 20, borderTopWidth: 10, elevation: 5 },
  label: { fontSize: 16, color: '#636e72' },
  kcalValue: { fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  warningBox: { marginTop: 15, backgroundColor: '#ffeaa7', padding: 15, borderRadius: 12 },
  warningText: { color: '#d63031', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  subText: { textAlign: 'center', color: '#2d3436', marginTop: 5 },
  okText: { color: '#00b894', fontWeight: 'bold', marginTop: 10 },
  adviceCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: 20 },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  adviceText: { fontSize: 16, color: '#2d3436', lineHeight: 22 },
  btn: { backgroundColor: '#4834d4', marginTop: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});