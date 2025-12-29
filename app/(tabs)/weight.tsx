import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WeightScreen() {
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState<{id: string, value: string, date: string}[]>([]);

  useEffect(() => {
    const loadWeightData = async () => {
      const savedWeight = await AsyncStorage.getItem('weight_history');
      if (savedWeight) setHistory(JSON.parse(savedWeight));
    };
    loadWeightData();
  }, []);

  const saveWeightData = async (newHistory: any) => {
    await AsyncStorage.setItem('weight_history', JSON.stringify(newHistory));
  };

  const addWeight = () => {
    if (weight) {
      const newEntry = { id: Date.now().toString(), value: weight, date: new Date().toLocaleDateString() };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      saveWeightData(newHistory);
      setWeight('');
    }
  };

  const deleteWeight = (id: string) => {
    const filteredHistory = history.filter(item => item.id !== id);
    setHistory(filteredHistory);
    saveWeightData(filteredHistory);
  };

  const getProgress = () => {
    if (history.length < 2) return "Начните вводить вес";
    const diff = parseFloat(history[0].value) - parseFloat(history[1].value);
    return diff > 0 ? `+${diff.toFixed(1)} кг` : `${diff.toFixed(1)} кг`;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Контроль Веса</Text>
        <View style={styles.weightCircle}>
          <Text style={styles.currentWeight}>{history[0]?.value || '--'}</Text>
          <Text style={styles.unit}>кг</Text>
        </View>
        <Text style={styles.progressText}>Прогресс: {getProgress()}</Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput style={styles.input} placeholder="Ваш вес" keyboardType="numeric" value={weight} onChangeText={setWeight} />
        <TouchableOpacity style={styles.button} onPress={addWeight}>
          <Text style={styles.buttonText}>Зафиксировать</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyValue}>{item.value} кг</Text>
            </View>
            <TouchableOpacity onPress={() => deleteWeight(item.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold' },
  weightCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#4a90e2', justifyContent: 'center', alignItems: 'center' },
  currentWeight: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  unit: { color: 'white' },
  progressText: { marginTop: 10, fontWeight: '600', color: '#4a90e2' },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, textAlign: 'center', fontSize: 18 },
  button: { backgroundColor: '#4a90e2', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  historyItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  historyDate: { color: '#666', fontSize: 12 },
  historyValue: { fontWeight: 'bold', fontSize: 16 },
  deleteBtn: { fontSize: 20 }
});