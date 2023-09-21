import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';


const RoutinePlayScreen = ({ route, navigation }) => {
  const { routine } = route.params;

  //State variables for necessary page functions
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isEndOfRoutine, setIsEndOfRoutine] = useState(false);

  //Function for navigating to the next routine step
  const handleNext = () => {
    if (currentStep < routine.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsEndOfRoutine(true);
    }
  };

  //Function for navigating to the previous routine step
  const handlePrev = () => {
    if (isEndOfRoutine) {
      setIsEndOfRoutine(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  //Play/pause state
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  //Replay button returning user to the beginning of the routine
  const handleReplay = () => {
    setCurrentStep(0);
    setIsEndOfRoutine(false);
  };

  //Handling the automatic progression of steps/intervals betwen steps based on set step duration when in "play" mode
  useEffect(() => {
    if (playing && !isEndOfRoutine) {
      const step = routine.steps[currentStep];
      if (step.duration > 0) {
        const id = setInterval(() => {
          handleNext();
        }, step.duration * 1000);
        setIntervalId(id);
      }
    } else {
      clearInterval(intervalId);
    }

    //Clear interval on change of dependencies
    return () => {
      clearInterval(intervalId);
    };
  }, [playing, currentStep, isEndOfRoutine]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routine.routineName}</Text>
      {isEndOfRoutine ? (
        <Text style={styles.endText}>End of routine</Text>
      ) : (
        <>
          {routine.steps[currentStep].image ? (
            routine.steps[currentStep].image.endsWith('.mp4') ? (
              <Video
                source={{ uri: routine.steps[currentStep].image }}
                style={styles.image}
                useNativeControls
              />
            ) : (
              <Image source={{ uri: routine.steps[currentStep].image }} style={styles.image} />
            )
          ) : null}
          <Text style={styles.text}>{routine.steps[currentStep].text}</Text>
          <Text style={styles.duration}>{playing && routine.steps[currentStep].duration > 0 ? 'Duration: ' + routine.steps[currentStep].duration + ' seconds' : ''}</Text>
        </>
      )}
      {/* Buttons for navigating between steps and controlling routine playback */}
      <View style={styles.buttonContainer}>
        <View style={styles.navButtonContainer}>
          <TouchableOpacity onPress={handlePrev} style={styles.button}>
            <Text style={styles.buttonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
          <Text style={styles.buttonText}>{playing ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        {isEndOfRoutine && 
          <TouchableOpacity onPress={handleReplay} style={styles.button}>
            <Text style={styles.buttonText}>Replay routine</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: Dimensions.get('window').width * 0.9,
    height: undefined,
    aspectRatio: 1,
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 10,
  },
  endText: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    margin: 10,
  },
  navButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#228B22',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

export default RoutinePlayScreen;
