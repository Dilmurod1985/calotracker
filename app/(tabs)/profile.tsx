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

  const calculateAll = () => {
    Keyboard.dismiss();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    
    if (!h || !w) return;

    const bmi = (w / (h * h)).toFixed(1);
    const bmiNum = parseFloat(bmi);

    // Идеальный вес по формуле (ИМТ 22 как золотая середина)
    const idealWeight = (22 * h * h).toFixed(1);
    const minNorm = (18.5 * h * h).toFixed(1);
    const maxNorm = (25 * h * h).toFixed(1);

    let data = {
      status: "Норма",
      color: "#00b894",
      diet: "🥗 Питание: Поддерживайте текущий режим. Больше клетчатки и качественного белка (рыба, яйца, творог).",
      water: "💧 Питьё: 2.5 литра чистой воды. Исключите сладкие газировки.",
      sport: "🏃 Спорт: 3-4 раза в неделю активные прогулки или бег по 40 минут.",
      target: "Вы находитесь в отличной форме!"
    };

    if (bmiNum >= 25) {
      data = {
        status: bmiNum >= 30 ? "Ожирение" : "Избыточный вес",
        color: bmiNum >= 30 ? "#e17055" : "#fdcb6e",
        diet: "🥩 Рацион: Уберите хлеб, сахар и жареное. Ужин — за 3-4 часа до сна (белок + овощи). Замените гарниры на капусту, огурцы или кабачки.",
        water: "🍋 Питьё: 2-3 литра воды. Стакан теплой воды с лимоном утром натощак для запуска метаболизма.",
        sport: "🚶 Активность: Ежедневно 10 000 шагов. Добавьте плавание или велосипед, чтобы не нагружать суставы.",
        target: `Ваша цель: снизить вес до ${maxNorm} кг (нужно убрать минимум ${(w - parseFloat(maxNorm)).toFixed(1)} кг).`
      };
    } else if (bmiNum < 18.5) {
      data = {
        status: "Дефицит веса",
        color: "#fab1a0",
        diet: "🥞 Рацион: Увеличьте порции. Добавьте каши, орехи, авокадо и красное мясо. Ешьте 5 раз в день.",
        water: "🥛 Питьё: Добавьте домашние смузи и молочные коктейли между едой.",
        sport: "💪 Спорт: Силовые тренировки в зале с небольшим количеством повторений для роста мышц.",
        target: `Ваша цель: набрать вес до ${minNorm} кг.`
      };
    }

    setResult({ bmi, ideal: idealWeight, ...data });
    AsyncStorage.setItem('user_height', height);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ваш План Здоровья</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Введите ваш рост (см):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} />
        
        <Text style={[styles.label, {marginTop: 15}]}>Ваш текущий вес (кг):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} />

        <TouchableOpacity style={styles.btn} onPress={calculateAll}>
          <Text style={styles.btnText}>АНАЛИЗИРОВАТЬ</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <View style={[styles.statusBadge, {backgroundColor: result.color}]}>
            <Text style={styles.statusText}>{result.status} (ИМТ: {result.bmi})</Text>
          </View>

          <View style={styles.idealCard}>
            <Text style={styles.idealLabel}>Ваш идеальный вес:</Text>
            <Text style={styles.idealValue}>{result.ideal} кг</Text>
            <Text style={styles.targetNote}>{result.target}</Text>
          </View>

          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>📋 Программа действий:</Text>
            <Text style={styles.adviceItem}>{result.diet}</Text>
            <View style={styles.divider} />
            <Text style={styles.adviceItem}>{result.water}</Text>
            <View style={styles.divider} />
            <Text style={styles.adviceItem}>{result.sport}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2f3640' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  label: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  input: { fontSize: 24, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#dcdde1', paddingVertical: 5, color: '#2f3640' },
  btn: { backgroundColor: '#4834d4', marginTop: 25, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
  resultContainer: { marginTop: 25 },
  statusBadge: { padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  idealCard: { backgroundColor: '#dff9fb', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  idealLabel: { fontSize: 16, color: '#130f40' },
  idealValue: { fontSize: 42, fontWeight: 'bold', color: '#130f40', marginVertical: 5 },
  targetNote: { fontSize: 14, color: '#130f40', textAlign: 'center', fontWeight: '500' },
  adviceCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3 },
  adviceTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2f3640' },
  adviceItem: { fontSize: 16, color: '#353b48', lineHeight: 24, paddingVertical: 5 },
  divider: { height: 1, backgroundColor: '#f1f2f6', marginVertical: 10 }
});