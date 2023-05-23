import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ChessBoard } from './components/Board';
import { GameState, Images, Move } from './components/Engine';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
const dimension = 8

const Chessboard = () => {

  return (
    <GameState />
  )

}

const styles = StyleSheet.create({});

export default Chessboard;
