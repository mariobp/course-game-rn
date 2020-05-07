import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import Card from '../components/Card';
import Input from '../components/Input';
import NumberContainer from '../components/NumberContainer';
import Colors from '../constants/colors';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';

const StartGameScreen = props => {
  const [enteredValue, setEnteredValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [buttonWith, setButtonWith] = useState(Dimensions.get('window').width / 4);

  useEffect(() => {
    const updateLayout = () => {
      setButtonWith(Dimensions.get('window').width / 4);
    };
  
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });
  

  const numberInputHandler = inputText => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ''));
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const resetInputHandler = () => {
    setEnteredValue('');
    setConfirmed(false);
  };

  const confirmHandler = () => {
    const chosedNumber = parseInt(enteredValue);
    if (isNaN(chosedNumber) || chosedNumber <= 0 || chosedNumber > 99) {
      const title = 'Invalid number!';
      const message = 'Number has to be a number between 1 and 99';
      Alert.alert(title, message, [{text: 'Okay', style: 'destructive', onPress: resetInputHandler }]);
      return;
    }
    setConfirmed(true);
    setSelectedNumber(chosedNumber);
    setEnteredValue('');
    hideKeyboard();
  };

  let confirmText = null;
  if (confirmed) {
    confirmText = (
      <Card style={styles.summaryContainer}>
        <BodyText>You selected</BodyText>
        <NumberContainer>{selectedNumber}</NumberContainer>
        <MainButton onPress={() => props.onStartGame(selectedNumber)}>
          Start Game
        </MainButton>
      </Card>
    );
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
        <TouchableWithoutFeedback onPress={hideKeyboard}>
          <View style={styles.screen}>
            <TitleText style={styles.title}>
              Start new Game!!!
            </TitleText>
            <Card style={styles.inputContainer}>
              <BodyText>Select a Numer</BodyText>
              <Input
                value={enteredValue}
                onChangeText={numberInputHandler}
                style={styles.input}
                blurOnSubmit
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={2}/>
              <View style={styles.buttonContainer}>
                <View style={{width: buttonWith }}>
                  <Button title="Reset" color={Colors.accent} onPress={resetInputHandler}/>
                </View>
                <View style={{width: buttonWith }}>
                  <Button title="Confirm" color={Colors.primary} onPress={confirmHandler}/>
                </View>
              </View>
            </Card>
            {confirmText}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  inputContainer: {
    width: '80%',
    minWidth: 300,
    maxWidth: '95%',
    // maxWidth: '80%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  // button: {
  //   width: Dimensions.get('window').width / 4,
  // },
  input: {
    width: 50,
    textAlign: 'center'
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: 'center'
  }
});

export default StartGameScreen;