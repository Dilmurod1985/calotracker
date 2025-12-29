import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('84');
  const [result, setResult] = useState<any>(null);

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
    Keyboard.dismiss();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;

    const bmiVal = (w / (h * h)).toFixed(1);
    const val = parseFloat(bmiVal);

    // Расчет рекомендованного веса (ИМТ 18.5 - 24.9)
    const minRecWeight = (18.5 * h * h).toFixed(1);
    const maxRecWeight = (24.9 * h * h).toFixed(1);

    let data = {
      status: "Норма",
      color: "#00b894",
      food: "Зелень, овощи, нежирное мясо, крупы.",
      drink: "Вода (30мл на кг веса), зеленый чай.",
      advice: "Ваш вес в норме. Поддерживайте активность."
    };

    if (val < 18.5) {
      data = { status: "Дефицит", color: "#fab1a0", food: "Орехи, каши, красная рыба, мясо.", drink: "Компоты, смузи, молоко.", advice: "Нужен профицит калорий." };
    } else if (val >= 25 && val < 30) {
      data = { status: "Избыток", color: "#fdcb6e", food: "Белок, клетчатка, исключить сахар и мучное.", drink: "Вода с лимоном, чистая вода.", advice: "Нужен дефицит калорий." };
    } else if (val >= 30) {
      data = { status: "Ожирение", color: "#e17055", food: "Только вареное/запеченное, овощи.", drink: "Чистая вода, исключить газировки.", advice: "Срочно уберите быстрые углеводы." };
    }

    setResult({ bmi: bmiVal, ...data, recMin: minRecWeight, recMax: maxRecWeight });
    AsyncStorage.setItem('user_height', height);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Умный Помощник</Text>

      <View style={styles.inputCard}>
        <View style={styles.inputGroup}><Text style={styles.label}>Вес (кг):</Text><TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} /></View>
        <View style={styles.inputGroup}><Text style={styles.label}>Рост (см):</Text><TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} /></View>
        <TouchableOpacity style={styles.calcButton} onPress={calculateBMI}><Text style={styles.calcButtonText}>🔍 Сканировать и получить план</Text></TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { borderTopColor: result.color }]}>
          <Text style={styles.bmiLabel}>ИМТ: <Text style={{color: result.color}}>{result.bmi}</Text> ({result.status})</Text>
          
          <View style={styles.recBox}>
            <Text style={styles.recTitle}>✅ Рекомендованный вес для вас:</Text>
            <Text style={styles.recValue}>{result.recMin} кг — {result.recMax} кг</Text>
          </View>

          <View style={styles.adviceBox}>
            <Text style={styles.sectionTitle}>🍎 Что есть:</Text>
            <Text style={styles.sectionText}>{result.food}</Text>
            
            <Text style={[styles.sectionTitle, {marginTop: 10}]}>💧 Что пить:</Text>
            <Text style={styles.sectionText}>{result.drink}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 5 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#636e72' },
  input: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  calcButton: { backgroundColor: '#4a90e2', padding: 15, borderRadius: 15, alignItems: 'center' },
  calcButtonText: { color: 'white', fontWeight: 'bold' },
  resultCard: { backgroundColor: 'white', marginTop: 20, padding: 20, borderRadius: 20, borderTopWidth: 5, elevation: 4 },
  bmiLabel: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  recBox: { backgroundColor: '#e1f5fe', padding: 15, borderRadius: 15, marginTop: 15, alignItems: 'center' },
  recTitle: { fontSize: 14, color: '#01579b' },
  recValue: { fontSize: 20, fontWeight: 'bold', color: '#01579b' },
  adviceBox: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionText: { fontSize: 15, color: '#2d3436' }
});