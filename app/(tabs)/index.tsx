import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const saved = await AsyncStorage.getItem('meals_history');
    if (saved) setMeals(JSON.parse(saved));
  };

  const addMeal = async () => {
    if (!food || !calories) return;
    const newMeal = { 
      id: Date.now().toString(), 
      name: food, 
      kcal: parseInt(calories),
      date: new Date().toLocaleDateString() // Сохраняем дату
    };
    const updated = [newMeal, ...meals];
    setMeals(updated);
    await AsyncStorage.setItem('meals_history', JSON.stringify(updated));
    setFood(''); setCalories('');
  };

  const todayKcal = meals
    .filter(m => m.date === new Date().toLocaleDateString())
    .reduce((sum, m) => sum + m.kcal, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сегодня: {todayKcal} ккал</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Что съели?" value={food} onChangeText={setFood} />
        <TextInput style={[styles.input, {width: 80}]} placeholder="Ккал" keyboardType="numeric" value={calories} onChangeText={setCalories} />
        <TouchableOpacity style={styles.addBtn} onPress={addMeal}><Text style={{color:'#fff'}}>+</Text></TouchableOpacity>
      </View>
      <FlatList 
        data={meals.filter(m => m.date === new Date().toLocaleDateString())}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.mealItem}><Text>{item.name}</Text><Text style={{fontWeight:'bold'}}>{item.kcal} ккал</Text></View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginRight: 10, flex: 1, padding: 5 },
  addBtn: { backgroundColor: '#4834d4', padding: 15, borderRadius: 10 },
  mealItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }
});