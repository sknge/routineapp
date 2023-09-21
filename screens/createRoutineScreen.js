import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


const CreateRoutineScreen = ({route}) => {
  //State variables for creation of routines
  const [routineName, setRoutineName] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepText, setCurrentStepText] = useState('');
  const [currentStepImage, setCurrentStepImage] = useState(null);
  const [currentStepDuration, setCurrentStepDuration] = useState('');
  const [editingStepIndex, setEditingStepIndex] = useState(null);

//Check if there's a routine passed to this screen, differentiate between editing an existing routine or creating a new one
  useEffect(() => {
    if (route.params.routine) {
      setRoutineName(route.params.routine.routineName);
      setSteps(route.params.routine.steps);
    }
  }, []);

//Function for choosing media from the device and adding it to the routine
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('App needs camera roll permissions to work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentStepImage(result.assets[0].uri);
    }
  };

//Adding or updating steps function
  const handleAddStep = () => {
    const newStep = { text: currentStepText, image: currentStepImage, duration: Number(currentStepDuration) };
    setCurrentStepText('');
    setCurrentStepImage(null);
    setCurrentStepDuration('');
    
    if (editingStepIndex !== null) {
      const newSteps = [...steps];
      newSteps[editingStepIndex] = newStep;
      setSteps(newSteps);
      setEditingStepIndex(null);
    } else {
      setSteps(prevSteps => [...prevSteps, newStep]);
    }
  };

  //Editing steps funciton
  const handleEditStep = (index) => {
    const step = steps[index];
    setCurrentStepText(step.text);
    setCurrentStepImage(step.image);
    setCurrentStepDuration(String(step.duration));
    setEditingStepIndex(index);
  };

  //Deleting steps function
  const handleDeleteStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  //Function for saving routines using async storage
  const saveRoutine = async () => {
    try {
      const currentDate = new Date().toLocaleDateString();
      const savedRoutines = JSON.parse(await AsyncStorage.getItem('routines')) || [];
      const routine = { routineName, steps, date: currentDate };
  
      if (route.params.index !== null && route.params.index !== undefined) {
        savedRoutines[route.params.index] = routine;
      } else {
        savedRoutines.push(routine);
      }
  
      await AsyncStorage.setItem('routines', JSON.stringify(savedRoutines));
      Alert.alert('Routine saved!');
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error saving routine.');
    }
  };  

  //Rendering the components
  return (
    <View style={styles.container}>
      <TextInput 
        value={routineName}
        placeholder='Enter Title' 
        onChangeText={setRoutineName}
        style={styles.input}
        clearButtonMode='while-editing'
      />
      <TextInput 
        value={currentStepText} 
        placeholder='Enter step description' 
        onChangeText={setCurrentStepText}
        style={styles.input}
        clearButtonMode='while-editing'
      />
      <TouchableOpacity onPress={handleImagePicker} style={styles.button}>
        <Text style={styles.buttonText}>Choose media</Text>
      </TouchableOpacity>
  
      {currentStepImage && 
        <Image source={{ uri: currentStepImage }} style={styles.imagePreview} />}
      <TextInput 
        value={currentStepDuration} 
        placeholder='Step duration (seconds)' 
        keyboardType='numeric'
        onChangeText={setCurrentStepDuration}
        style={styles.input}
        clearButtonMode='while-editing'
      />
      <TouchableOpacity onPress={handleAddStep} style={styles.button}>
        <Text style={styles.buttonText}>Add Step</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={saveRoutine} style={styles.button}>
        <Text style={styles.buttonText}>Save Routine</Text>
      </TouchableOpacity>
      <ScrollView style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            {step.image && 
              <Image source={{ uri: step.image }} style={styles.imagePreview} />}
            <Text>{step.text}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => handleDeleteStep(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditStep(index)} style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F7F7F7',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#228B22',
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#228B22',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#228B22',
  },
  stepsContainer: {
    marginTop: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default CreateRoutineScreen;