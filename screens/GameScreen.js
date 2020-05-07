import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import { MaterialIcons } from '@expo/vector-icons';
import TitleText from '../components/TitleText';
import BodyText from '../components/BodyText';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  }
  return rndNum;
};

const renderListItem = (value, index) => {
  return (
    <View key={index} style={styles.listItem}>
      <TitleText>#{index}</TitleText>
      <BodyText>{value}</BodyText>
    </View>
  );
};

const listContainerStyle = (width) => {
  return {
    width: width > 350 ? '60%' : '80%',
    flex: 1
  };
};

const buttonContaninerStyle = (height) => {
  return {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height > 600 ? 20 : 10,
    width: 300,
    maxWidth: '80%'
  };
};

const renderControls = (dimensionsHeight, currentGuess, nextGuessHandler) => {
  let controls = (
    <View style={styles.screen}>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={buttonContaninerStyle(dimensionsHeight)}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <MaterialIcons name="remove" size={24}/>
        </MainButton>
        <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <MaterialIcons name="add" size={24}/>
        </MainButton>
      </Card>
    </View>
  );

  if (dimensionsHeight < 500) {
    controls = (
      <View style={styles.controls}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <MaterialIcons name="remove" size={24}/>
        </MainButton>
        <NumberContainer>{currentGuess}</NumberContainer>
        <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <MaterialIcons name="add" size={24}/>
        </MainButton>
      </View>
    )
  };

  return controls;
};

const GameScreen = props => {
  const initialGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [passGuesses, setPassGuesses] = useState([initialGuess]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);

  const currentLower = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;
  
  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get('window').width);
      setAvailableDeviceHeight(Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', updateLayout);
  
    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  useEffect(() => { 
    if (currentGuess === userChoice) {
      onGameOver(passGuesses.length);
    };
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if ((direction === 'lower' && currentGuess < userChoice) ||
        (direction === 'greater' && currentGuess > userChoice)) {
          const title = 'Don\'t lie!';
          const message = 'You know that this is wrong...';
          Alert.alert(title, message, [{ text: 'Sorry!',  style: 'cancel' }]);
          return;
    };

    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLower.current = currentGuess;
    };
  
    const nextNumber = generateRandomBetween(currentLower.current, currentHigh.current, currentGuess);
    setCurrentGuess(nextNumber);
    setPassGuesses(curPastGuesses => [nextNumber, ...curPastGuesses]);
  };
    
  return (
    <View style={styles.screen}>
      <Text>Opponent's </Text>
      {renderControls(availableDeviceHeight, currentGuess, nextGuessHandler)}
      <View style={listContainerStyle(availableDeviceWidth)}>
        <ScrollView contentContainerStyle={styles.list}>
          {passGuesses.map((guess, index) => renderListItem(guess, passGuesses.length - index))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  bottonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 20 : 10,
    width: 300,
    maxWidth: '80%'
  },
  controls: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  list: {
    flexGrow: 1,  
    justifyContent: 'flex-end'
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default GameScreen;