import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {  StatusBar } from 'react-native';
import  Home from './pages/Home';
import  Wallet from './pages/Wallet';
import  Profile from './pages/Profile';
import SplashScreen from 'react-native-splash-screen';

const myTheme = {
...DefaultTheme,
colors: {
  ...DefaultTheme.colors,
  primary: '#35363A',
  card: '#35363A',
  background: '#35363A',
  border: '#35363A'
},  
};

export default class App extends React.Component {
componentDidMount() {
  SplashScreen.hide();
}
render(){
return (
<>
<StatusBar 
backgroundColor="#5D1767"
barStyle="light-content"
/>
<NavigationContainer theme={myTheme}>
        <AppNavigator />
        </NavigationContainer>
        </>
        );
    }    
}
const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Home">
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Wallet' component={Wallet} />
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
}
 