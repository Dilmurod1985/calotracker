import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  const [height, setHeight] = useState('170');
  const [currentWeight, setCurrentWeight] = useState(84);

  useEffect(() => {
    const loadData = async () => {
      // Загружаем сохраненный рост
      const savedHeight = await AsyncStorage.getItem('user_height');
      if (savedHeight) setHeight(savedHeight);

      // Загружаем историю веса и берем самое последнее значение
      const weightHistory = await AsyncStorage.getItem('weight_history');
      if (weightHistory) {
        const history = JSON.parse(weightHistory);
        if (history.length > 0) {
          setCurrentWeight(parseFloat(history[0].value));
        }
      }
    };
    loadData();
  }, []);

  const saveHeight = async (val: string) => {
    setHeight(val);
    await AsyncStorage.setItem('user_height', val);
  };

  const bmi = (currentWeight / ((parseFloat(height) / 100) ** 2)).toFixed(1);

  const getStatus = () => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { text: "Дефицит", color: "#fab1a0", advice: "Нужен профицит калорий." };
    if (val < 25) return { text: "Норма", color: "#00b894", advice: "Так держать!" };
    if (val < 30) return { text: "Избыток", color: "#fdcb6e", advice: "Нужен небольшой дефицит калорий." };
    return { text: "Ожирение", color: "#e17055", advice: "Рекомендуется консультация и диета." };
  };

  const status = getStatus();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Настройки и ИМТ</Text>
      
      <View style={styles.inputCard}>
        <Text style={styles.label}>Ваш рост (см):</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          value={height}
          onChangeText={saveHeight}
        />
        <Text style={styles.weightNote}>Актуальный вес: {currentWeight} кг (из истории)</Text>
      </View>

      <View style={[styles.card, { borderLeftColor: status.color }]}>
        <Text style={styles.label}>Ваш ИМТ:</Text>
        <Text style={[styles.bmiValue, { color: status.color }]}>{bmi}</Text>
        <Text style={styles.statusText}>{status.text}</Text>
      </View>

      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>💡 Рекомендация:</Text>
        <Text style={styles.adviceText}>{status.advice}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20 },
  label: { fontSize: 14, color: '#636e72', marginBottom: 5 },
  input: { fontSize: 22, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  weightNote: { fontSize: 12, color: '#b2bec3', marginTop: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, alignItems: 'center', borderLeftWidth: 8 },
  bmiValue: { fontSize: 40, fontWeight: 'bold' },
  statusText: { fontSize: 18, fontWeight: '600' },
  adviceCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 20 },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  adviceText: { fontSize: 16 }
});