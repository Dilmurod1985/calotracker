import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Твои ключи из Dashboard
const API_ID = 'fc072be0'; 
const API_KEY = 'c855f04ec9cde54b27813d3df14ea2c8';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadMeals(); }, []);

  const loadMeals = async () => {
    const saved = await AsyncStorage.getItem('meals_history');
    if (saved) setMeals(JSON.parse(saved));
  };

  const searchAndAddMeal = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // 1. Перевод на английский (Edamam лучше понимает English)
      const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=ru|en`);
      const transData = await transRes.json();
      const englishQuery = transData.responseData.translatedText;

      // 2. Запрос к Edamam
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${API_ID}&app_key=${API_KEY}&ingr=${encodeURIComponent(englishQuery)}`
      );
      const data = await response.json();

      if (data.calories === 0) {
        alert("Продукт не найден. Уточните, например: 'Плов 200г'");
      } else {
        const newMeal = {
          id: Date.now().toString(),
          name: query,
          kcal: Math.round(data.calories),
          protein: Math.round(data.totalNutrients.PROCNT?.quantity || 0),
          fat: Math.round(data.totalNutrients.FAT?.quantity || 0),
          date: new Date().toLocaleDateString()
        };
        const updated = [newMeal, ...meals];
        setMeals(updated);
        await AsyncStorage.setItem('meals_history', JSON.stringify(updated));
        setQuery('');
      }
    } catch (e) { alert("Ошибка сети"); }
    finally { setLoading(false); Keyboard.dismiss(); }
  };

  const todayKcal = meals
    .filter(m => m.date === new Date().toLocaleDateString())
    .reduce((sum, m) => sum + m.kcal, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.headerKcal}>{todayKcal} ккал</Text>
      <Text style={styles.subHeader}>Всего за сегодня</Text>

      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholder="Что съели? (например: Плов 300г)" value={query} onChangeText={setQuery} />
        <TouchableOpacity style={styles.addBtn} onPress={searchAndAddMeal} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>РАССЧИТАТЬ И ДОБАВИТЬ</Text>}
        </TouchableOpacity>
      </View>

      <FlatList 
        data={meals.filter(m => m.date === new Date().toLocaleDateString())}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.mealItem}>
            <View><Text style={styles.mealName}>{item.name}</Text><Text style={styles.nutrients}>Б: {item.protein}г | Ж: {item.fat}г</Text></View>
            <Text style={styles.mealKcal}>{item.kcal} ккал</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  headerKcal: { fontSize: 48, fontWeight: 'bold', color: '#4834d4', textAlign: 'center' },
  subHeader: { fontSize: 16, color: '#636e72', textAlign: 'center', marginBottom: 30 },
  inputBox: { backgroundColor: '#fff', padding: 15, borderRadius: 20, elevation: 5, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, fontSize: 16, marginBottom: 15 },
  addBtn: { backgroundColor: '#4834d4', padding: 15, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  mealItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10 },
  mealName: { fontSize: 18, fontWeight: '600' },
  nutrients: { color: '#b2bec3', fontSize: 12 },
  mealKcal: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' }
});