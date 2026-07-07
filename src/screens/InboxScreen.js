import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

const TASKS_KEY = '@leleco_tasks';
const USEFUL_KEY = '@leleco_useful';

export default function InboxScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [usefulTasks, setUsefulTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
      const storedUseful = await AsyncStorage.getItem(USEFUL_KEY);
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedUseful) setUsefulTasks(JSON.parse(storedUseful));
    } catch (e) {
      console.error(e);
    }
  };

  const saveTasks = async (newTasks) => {
    setTasks(newTasks);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
  };

  const saveUseful = async (newUseful) => {
    setUsefulTasks(newUseful);
    await AsyncStorage.setItem(USEFUL_KEY, JSON.stringify(newUseful));
  };

  const addTask = () => {
    if (taskText.trim()) {
      saveTasks([{ id: Date.now().toString(), text: taskText }, ...tasks]);
      setTaskText('');
    }
  };

  const discardTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const markUseful = (item) => {
    saveUseful([item, ...usefulTasks]);
    discardTask(item.id);
  };

  const renderRightActions = () => (
    <View style={[styles.swipeAction, styles.lixoAction]}>
      <Text style={styles.swipeText}>🗑️ Lixo</Text>
    </View>
  );

  const renderLeftActions = () => (
    <View style={[styles.swipeAction, styles.utilAction]}>
      <Text style={styles.swipeText}>⭐ Útil</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Caixa de Entrada</Text>
      
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          placeholder="Jogue sua ideia aqui..." 
          value={taskText} 
          onChangeText={setTaskText} 
        />
        <TouchableOpacity style={styles.btnAction} onPress={addTask}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => {
              if (direction === 'left') {
                markUseful(item);
                alert(`⭐ Salvo como útil!`);
              } else {
                discardTask(item.id);
              }
            }}
          >
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.hint}>Deslize ➡️ Útil | Lixo ⬅️</Text>
            </View>
          </Swipeable>
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: colors.surface, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  btnAction: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, marginLeft: 10, justifyContent: 'center' },
  btnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  taskCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  taskText: { fontSize: 18, color: colors.text },
  hint: { fontSize: 12, color: colors.textHint, marginTop: 5, textAlign: 'center' },
  swipeAction: { justifyContent: 'center', alignItems: 'center', width: 100, borderRadius: 10, marginBottom: 10 },
  utilAction: { backgroundColor: colors.success },
  lixoAction: { backgroundColor: colors.danger },
  swipeText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
});
