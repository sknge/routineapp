import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const RoutineListScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([]);

  //Fetching the saved routines from AsyncStorage
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const savedRoutines = JSON.parse(await AsyncStorage.getItem('routines')) || [];
        setRoutines(savedRoutines);
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };
    fetchRoutines();
  }, []);

  //Delete routine handling
  const handleDelete = async (index) => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const newRoutines = [...routines];
              newRoutines.splice(index, 1);
              setRoutines(newRoutines);
              await AsyncStorage.setItem('routines', JSON.stringify(newRoutines));
            } catch (error) {
              console.error('Error deleting routine:', error);
            }
          }
        },
      ],
      { cancelable: true }
    );
  };

   //Navigate to the Create Routine screen to edit an existing routine from the list
  const handleEdit = (index) => {
    navigation.navigate('CreateRoutineScreen', { routine: routines[index], index });
  };

  //Rendering components
  return (
    <View style={styles.container}>
      <FlatList 
        data={routines}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.title}>{item.routineName}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => navigation.navigate('RoutinePlayScreen', { routine: item })} style={styles.button}>
                <Text style={styles.buttonText}>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEdit(index)} style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F7F7F7',
  },
  listItem: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    backgroundColor: '#228B22',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: 10,
  },
});

export default RoutineListScreen;
