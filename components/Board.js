import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { GameState, Images, Move } from './Engine';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
const dimension = 8
const sq_size = Math.floor(width / dimension)

const gs = new GameState();

const ChessBoard = ({array}) => {
    let square_selected = [], player_clicks = []
    const handlePress = (row, col, piece) => {
        if (!gameOver) {
            if (square_selected === [row, col]) {
                square_selected = []
                player_clicks = []
            } else {
                square_selected = [row, col]
                player_clicks.push(square_selected)
            }
            if ((player_clicks.length) === 2) {
                const move = new Move(player_clicks[0], player_clicks[1], gs.state.Board)
                gs.makeMove(move)
                square_selected = []
                player_clicks = []
            }

        }
    }

    const [gameOver, setGameOver] = useState(false);
    const piece = [];
    let icon
    gs.state.Board.map((row, i) => {
        const img = [];
        row.map((pie, j) => {
            if (pie !== '--') {
                switch (pie) {
                    case 'wp':
                        icon = Images.wp
                        break;
                    case 'wR':
                        icon = Images.wR
                        break;
                    case 'wN':
                        icon = Images.wN
                        break;
                    case 'wB':
                        icon = Images.wB
                        break;
                    case 'wQ':
                        icon = Images.wQ
                        break;
                    case 'wK':
                        icon = Images.wK
                        break;
                    case 'bp':
                        icon = Images.bp
                        break;
                    case 'bR':
                        icon = Images.bR
                        break;
                    case 'bN':
                        icon = Images.bN
                        break;
                    case 'bB':
                        icon = Images.bB
                        break;
                    case 'bQ':
                        icon = Images.bQ
                        break;
                    case 'bK':
                        icon = Images.bK
                        break;
                }
                img.push(
                    <TouchableOpacity onPress={
                        (event) => {
                            handlePress(i, j, pie)
                        }
                    }>
                        <Image
                            key={i * 8 + j}
                            source={icon}
                            style={{
                                height: sq_size,
                                width: sq_size,
                                backgroundColor: (i + j) % 2 === 0 ? '#f0dc97' : '#4c8722',
                            }}
                        />
                    </TouchableOpacity>
                );
            } else {
                img.push(
                    <TouchableOpacity onPress={
                        (event) => {
                            handlePress(i, j, pie)
                        }
                    }>
                        <View
                            style={{
                                width: sq_size,
                                height: sq_size,
                                backgroundColor: (i + j) % 2 === 0 ? '#f0dc97' : '#4c8722',
                            }}
                        />
                    </TouchableOpacity>
                );
            }
        });

        piece.push(
            <View key={i} style={styles.piece}>
                {img}
            </View>
        );
    });


    return <View style={styles.board}>{piece}</View>;
}

const styles = StyleSheet.create({
    board: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
    },
    piece: {
        height: sq_size,
        width: sq_size,
        flexDirection: 'row',
    },
});

export {
    ChessBoard
}