import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import Colors from '../constants/colors';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';

const imageContainerStyle = (width, height) => {
  return {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'black',
    overflow: 'hidden',
    marginVertical: height / 20,
  }
};

const GameOverScreen = props => {
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);

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

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText>Game Over!!!</TitleText>
        <View style={imageContainerStyle(availableDeviceWidth, availableDeviceHeight)}>
          <Image style={styles.image} resizeMethod="scale" source={require('../assets/gameover.png')}/>
        </View>
        <BodyText>Number of rounds: <Text style={styles.highLight}>{props.rounds}</Text></BodyText>
        <BodyText>Number was: <Text style={styles.highLight}>{props.userNumber}</Text></BodyText>
        <View style={styles.button}>
          <MainButton onPress={props.onRestart}>
            Restart the game
          </MainButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  button: {
    marginTop: 20
  },
  image: {
    width: '100%',
    height: '100%'
  },
  highLight: {
    color: Colors.primary,
    fontFamily: 'open-sans-bold'
  }
});

export default GameOverScreen;