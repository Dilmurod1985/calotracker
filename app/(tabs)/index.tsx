import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState<{id: string, food: string, calories: string}[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('meals_data');
      if (saved) setMeals(JSON.parse(saved));
    };
    loadData();
  }, []);

  const saveMeals = async (newMeals: any) => {
    await AsyncStorage.setItem('meals_data', JSON.stringify(newMeals));
  };

  const addMeal = () => {
    if (food && calories) {
      const newMeals = [{ id: Date.now().toString(), food, calories }, ...meals];
      setMeals(newMeals);
      saveMeals(newMeals);
      setFood('');
      setCalories('');
    }
  };

  // Функция удаления
  const deleteMeal = (id: string) => {
    const filteredMeals = meals.filter(meal => meal.id !== id);
    setMeals(filteredMeals);
    saveMeals(filteredMeals);
  };

  const totalCalories = meals.reduce((sum, item) => sum + parseInt(item.calories || '0'), 0);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои Калории</Text>
        <View style={styles.circle}>
          <Text style={styles.totalText}>{totalCalories}</Text>
          <Text style={styles.unitText}>ккал сегодня</Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <TextInput style={styles.input} placeholder="Что съели?" value={food} onChangeText={setFood} />
        <TextInput style={styles.input} placeholder="Калории" keyboardType="numeric" value={calories} onChangeText={setCalories} />
        <TouchableOpacity style={styles.button} onPress={addMeal}>
          <Text style={styles.buttonText}>➕ Добавить запись</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardFood}>{item.food}</Text>
              <Text style={styles.cardCalories}>{item.calories} ккал</Text>
            </View>
            <TouchableOpacity onPress={() => deleteMeal(item.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2d3436' },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#00b894', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  totalText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  unitText: { color: 'white', fontSize: 12 },
  inputSection: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#dfe6e9', marginBottom: 15, padding: 8 },
  button: { backgroundColor: '#00b894', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  cardFood: { fontSize: 16, fontWeight: '500' },
  cardCalories: { color: '#636e72' },
  deleteBtn: { fontSize: 20 }
});