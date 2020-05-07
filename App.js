import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Header from './components/Header';
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const fetchFont = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [userNumber, setsUserNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const startGameHandler = (selectedNumber) => {
    setsUserNumber(selectedNumber);
    setGuessRounds(0);
  };

  const gameOverHandler = rounds => {
    setGuessRounds(rounds);
  };

  const restartHandler = () => {
    setsUserNumber(null);
    setGuessRounds(0);
  };

  let content = <StartGameScreen onStartGame={startGameHandler}/>;
  if (userNumber && guessRounds <= 0) {
    content =  <GameScreen userChoice={userNumber} onGameOver={gameOverHandler}/>;
  } else if (guessRounds > 0){
    content = <GameOverScreen rounds={guessRounds} userNumber={userNumber} onRestart={restartHandler}/>
  }

  if (!dataLoaded) {
    return <AppLoading
      startAsync={fetchFont}
      onFinish={() => setDataLoaded(true)}
      onError={(error) => console.log('Error', error)}/>;
  }

  return (
    <SafeAreaView style={styles.container}>
     <Header title="Guess a Number"/>
     {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
