import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/homeScreen';
import CreateRoutineScreen from './screens/createRoutineScreen';
import RoutineListScreen from  './screens/routineListScreen';
import RoutinePlayScreen from './screens/routinePlayScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='CreateRoutineScreen' component={CreateRoutineScreen} initialParams={{ routine: null, index: null }} options={{ title: 'Create Routine' }} />
        <Stack.Screen name='RoutineListScreen' component={RoutineListScreen} options={{ title: 'Routine List' }}/>
        <Stack.Screen name='RoutinePlayScreen' component={RoutinePlayScreen} options={{ title: 'Play Routine' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
