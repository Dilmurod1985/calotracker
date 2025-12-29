import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('84');
  const [result, setResult] = useState<{bmi: string, status: string, color: string, advice: string} | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const savedHeight = await AsyncStorage.getItem('user_height');
      if (savedHeight) setHeight(savedHeight);
      
      const weightHistory = await AsyncStorage.getItem('weight_history');
      if (weightHistory) {
        const history = JSON.parse(weightHistory);
        if (history.length > 0) setWeight(history[0].value);
      }
    };
    loadData();
  }, []);

  const calculateBMI = () => {
    Keyboard.dismiss(); // Скрыть клавиатуру
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const bmiVal = (w / (h * h)).toFixed(1);
    const val = parseFloat(bmiVal);

    let status = { text: "Норма", color: "#00b894", advice: "Отличный баланс! Продолжайте в том же духе." };
    if (val < 18.5) status = { text: "Дефицит", color: "#fab1a0", advice: "Вам стоит увеличить калорийность рациона." };
    else if (val >= 25 && val < 30) status = { text: "Избыток", color: "#fdcb6e", advice: "Рекомендуется снизить сахар и добавить ходьбу." };
    else if (val >= 30) status = { text: "Ожирение", color: "#e17055", advice: "Необходим дефицит калорий и контроль врача." };

    setResult({ bmi: bmiVal, status: status.text, color: status.color, advice: status.advice });
    AsyncStorage.setItem('user_height', height);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Умный Помощник</Text>

      <View style={styles.inputCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ваш вес (кг):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ваш рост (см):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} />
        </View>
        
        <TouchableOpacity style={styles.calcButton} onPress={calculateBMI}>
          <Text style={styles.calcButtonText}>🔍 Рассчитать и получить советы</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { borderTopColor: result.color }]}>
          <Text style={styles.bmiLabel}>Ваш ИМТ: <Text style={{color: result.color}}>{result.bmi}</Text></Text>
          <Text style={[styles.statusTag, { backgroundColor: result.color }]}>{result.resultStatus}</Text>
          
          <View style={styles.adviceBox}>
            <Text style={styles.adviceTitle}>💡 Совет для вас:</Text>
            <Text style={styles.adviceText}>{result.advice}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20, textAlign: 'center' },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 5 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#636e72', marginBottom: 5 },
  input: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
  calcButton: { backgroundColor: '#4a90e2', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  calcButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  resultCard: { backgroundColor: 'white', marginTop: 20, padding: 20, borderRadius: 20, borderTopWidth: 5 },
  bmiLabel: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  statusTag: { alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, color: 'white', fontWeight: 'bold', marginTop: 10 },
  adviceBox: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#f1f1f1', paddingTop: 15 },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  adviceText: { fontSize: 16, color: '#2d3436', lineHeight: 24 }
});