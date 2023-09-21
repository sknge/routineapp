import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const HomeScreen = ({ navigation }) => {
  return (
    //Main homescreen container
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateRoutineScreen')}>
        <Text style={styles.buttonText}>Create Routine</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RoutineListScreen')}>
        <Text style={styles.buttonText}>View Routines</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
    fontWeight: 'bold',
    color: '#228B22',
  },
  button: {
    backgroundColor: '#228B22',
    padding: 15,
    width: '80%',
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;

