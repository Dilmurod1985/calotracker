import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const weight = 84;
  const height = 170;

  // Расчет ИМТ (Вес / Рост в метрах в квадрате)
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  const getStatus = () => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { text: "Дефицит веса", color: "#fab1a0", advice: "Вам нужно увеличить калорийность рациона и добавить белок." };
    if (val < 25) return { text: "Норма", color: "#00b894", advice: "Отличный результат! Поддерживайте текущий режим питания." };
    if (val < 30) return { text: "Избыточный вес", color: "#fdcb6e", advice: "Рекомендуется снизить потребление быстрых углеводов и сахара." };
    return { text: "Ожирение", color: "#e17055", advice: "Необходим дефицит калорий и регулярные прогулки по 30-40 минут." };
  };

  const status = getStatus();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Мой Профиль</Text>
      
      <View style={[styles.card, { borderLeftColor: status.color }]}>
        <Text style={styles.label}>Ваш ИМТ:</Text>
        <Text style={[styles.bmiValue, { color: status.color }]}>{bmi}</Text>
        <Text style={styles.statusText}>{status.text}</Text>
      </View>

      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>💡 Совет дня:</Text>
        <Text style={styles.adviceText}>{status.advice}</Text>
        <Text style={styles.dietTip}>
          • Пейте не менее 2л воды в день.{"\n"}
          • Старайтесь ужинать за 3 часа до сна.{"\n"}
          • Замените жареное на запеченное или вареное.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2d3436', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 25, borderRadius: 20, alignItems: 'center', borderLeftWidth: 8, elevation: 4 },
  label: { fontSize: 16, color: '#636e72' },
  bmiValue: { fontSize: 48, fontWeight: 'bold', marginVertical: 10 },
  statusText: { fontSize: 18, fontWeight: '600' },
  adviceCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginTop: 20, elevation: 3 },
  adviceTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  adviceText: { fontSize: 16, color: '#2d3436', lineHeight: 22 },
  dietTip: { marginTop: 15, fontSize: 15, color: '#636e72', lineHeight: 24 }
});