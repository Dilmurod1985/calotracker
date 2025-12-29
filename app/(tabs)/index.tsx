import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState<{id: string, food: string, calories: string}[]>([]);

  const addMeal = () => {
    if (food && calories) {
      setMeals([{ id: Date.now().toString(), food, calories }, ...meals]);
      setFood('');
      setCalories('');
    }
  };

  const totalCalories = meals.reduce((sum, item) => sum + parseInt(item.calories || '0'), 0);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Мои Калории</Text>
        <View style={styles.circle}>
          <Text style={styles.totalText}>{totalCalories}</Text>
          <Text style={styles.unitText}>ккал</Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Что съели?" 
          value={food}
          onChangeText={setFood}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Калории" 
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />
        <TouchableOpacity style={styles.button} onPress={addMeal}>
          <Text style={styles.buttonText}>Добавить запись</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardFood}>{item.food}</Text>
            <Text style={styles.cardCalories}>{item.calories} ккал</Text>
          </View>
        )}
        style={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#4ecca3', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  totalText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  unitText: { color: 'white', fontSize: 14 },
  inputSection: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, padding: 10, fontSize: 16 },
  button: { backgroundColor: '#4ecca3', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  list: { flex: 1 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  cardFood: { fontSize: 16, fontWeight: '500' },
  cardCalories: { color: '#666', fontWeight: 'bold' }
});