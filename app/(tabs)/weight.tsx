import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WeightScreen() {
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState<{id: string, value: string, date: string}[]>([]);

  const addWeight = () => {
    if (weight) {
      const newEntry = {
        id: Date.now().toString(),
        value: weight,
        date: new Date().toLocaleDateString()
      };
      setHistory([newEntry, ...history]);
      setWeight('');
    }
  };

  // Расчет прогресса (сравнение последней записи с предыдущей)
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
          <Text style={styles.unit}>текущий вес (кг)</Text>
        </View>
        <Text style={styles.progressText}>Прогресс: {getProgress()}</Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput 
          style={styles.input} 
          placeholder="Введите ваш вес (кг)" 
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TouchableOpacity style={styles.button} onPress={addWeight}>
          <Text style={styles.buttonText}>Зафиксировать вес</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyValue}>{item.value} кг</Text>
          </View>
        )}
        style={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  weightCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#4a90e2', justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  currentWeight: { fontSize: 40, fontWeight: 'bold', color: 'white' },
  unit: { color: 'white', fontSize: 12, opacity: 0.8 },
  progressText: { marginTop: 15, fontSize: 16, color: '#4a90e2', fontWeight: '600' },
  inputCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20, padding: 10, fontSize: 18, textAlign: 'center' },
  button: { backgroundColor: '#4a90e2', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  list: { flex: 1 },
  historyItem: { backgroundColor: 'white', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyDate: { color: '#666' },
  historyValue: { fontWeight: 'bold', color: '#333' }
});