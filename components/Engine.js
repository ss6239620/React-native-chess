import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const dimension = 8
const sq_size = Math.floor(width / dimension)

let square_selected = [], player_clicks = [], piece_selected = []
const Images = {
    'wp': require(`../assets/chess_set/wp.png`),
    'wR': require(`../assets/chess_set/wR.png`),
    'wN': require(`../assets/chess_set/wN.png`),
    'wB': require(`../assets/chess_set/wB.png`),
    'wQ': require(`../assets/chess_set/wQ.png`),
    'wK': require(`../assets/chess_set/wK.png`),
    'bp': require(`../assets/chess_set/bp.png`),
    'bR': require(`../assets/chess_set/bR.png`),
    'bN': require(`../assets/chess_set/bN.png`),
    'bB': require(`../assets/chess_set/bB.png`),
    'bQ': require(`../assets/chess_set/bQ.png`),
    'bK': require(`../assets/chess_set/bK.png`),
    'dot': require(`../assets/chess_set/dot.png`),
}

class GameState extends Component {
    constructor() {
        super();
        this.state = {
            Board: [[]],
            gameOver: false,
            moveLog: [],
        }
        this.whiteToMove = true
    }
    componentDidMount() {
        this.setState({
            Board: [
                ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
                ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
                ['--', '--', '--', '--', '--', '--', '--', '--'],
                ['--', '--', '--', '--', '--', '--', '--', '--'],
                ['--', '--', '--', '--', '--', '--', '--', '--'],
                ['--', '--', '--', '--', '--', '--', '--', '--'],
                ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
                ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
            ],
            moveLog: [],
            turn: 'b',
        })
    }

    makeMove(move) {
        const update = this.state.Board.map((c, i) => {
            c.map((pie, j) => {
                if (i === move.start_row && j === move.start_col) {
                    this.state.Board[move.start_row][move.start_col] = '--';
                    this.state.Board[move.end_row][move.end_col] = move.piece_moved;

                }
            });
        });
        this.setState(update)
    }

    showImage(row, col) {
        const update = this.state.Board.map((c, i) => {
            c.map((pie, j) => {
                if(i===row && j===col){
                    this.state.Board[row][col]='dot';
                }
            });
        });
        this.setState(update)
    }

    getPawnMove(fr_r, fr_c, to_r, to_c) {
        var pawn_moves1 = [[-1, 1], [-1, -1], [-1, 0]]
        var pawn_moves2 = [[1, 1], [1, -1], [1, 0]]
        if (this.whiteToMove) {
            for (var i = 0; i < pawn_moves1.length; i++) {
                var end_row = fr_r + pawn_moves1[i][0]
                var end_col = fr_c + pawn_moves1[i][1]
                if (to_r === end_row && to_c === end_col) {
                    if (this.state.Board[to_r][to_c] === '--') {
                        const move = new Move([fr_r, fr_c], [end_row, end_col], this.state.Board)
                        this.makeMove(move)
                    }
                }
            }
            this.whiteToMove = false

        } else if (!this.whiteToMove) {
            for (var i = 0; i < pawn_moves2.length; i++) {
                var end_row = fr_r + pawn_moves2[i][0]
                var end_col = fr_c + pawn_moves2[i][1]
                if (to_r === end_row && to_c === end_col) {
                    if (this.state.Board[to_r][to_c] === '--') {
                        const move = new Move([fr_r, fr_c], [end_row, end_col], this.state.Board)
                        this.makeMove(move)
                    }
                }
            }
            this.whiteToMove = true
        }
    }

    getKnightMove(fr_r, fr_c, to_r, to_c) {
        var knight_moves = [[-2, 1], [-2, -1], [2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
        if (this.whiteToMove) {
            for (var i = 0; i < knight_moves.length; i++) {
                var end_row = fr_r + knight_moves[i][0]
                var end_col = fr_c + knight_moves[i][1]
                if (to_r === end_row && to_c === end_col) {
                    if (this.state.Board[to_r][to_c] === '--') {
                        const move = new Move([fr_r, fr_c], [end_row, end_col], this.state.Board)
                        this.makeMove(move)
                    }
                }
            }
        }
    }

    getBishopMove(fr_r, fr_c, to_r, to_c) {
        var bishop_moves = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        if (this.whiteToMove) {
            for (var i = 0; i < bishop_moves.length; i++) {
                for (var j = 1; j < 8; j++) {
                    var end_row = fr_r + bishop_moves[i][0] * j
                    var end_col = fr_c + bishop_moves[i][1] * j
                    if (to_r === end_row && to_c === end_col) {
                        if (this.state.Board[to_r][to_c] === '--') {
                            const move = new Move([fr_r, fr_c], [end_row, end_col], this.state.Board)
                            this.makeMove(move)
                        }
                    }
                }
            }
        }
    }

    getRookMove(fr_r, fr_c, to_r, to_c) {
        var rook_moves = [[-1, 0], [0, -1], [1, 0], [0, 1]]
        if (this.whiteToMove) {
            for (var i = 0; i < rook_moves.length; i++) {
                for (var j = 1; j < 8; j++) {
                    var end_row = fr_r + rook_moves[i][0] * j
                    var end_col = fr_c + rook_moves[i][1] * j
                    if (to_r === end_row && to_c === end_col) {
                        if (this.state.Board[to_r][to_c] === '--') {
                            const move = new Move([fr_r, fr_c], [end_row, end_col], this.state.Board)
                            this.makeMove(move)
                        }
                    }
                }
            }
        }
    }

    getQueenMove(fr_r, fr_c, to_r, to_c) {
        this.getBishopMove(fr_r, fr_c, to_r, to_c)
        this.getRookMove(fr_r, fr_c, to_r, to_c)
    }

    showPossibleMove(row, col, piece) {
        var color = piece.slice(0, 1)
        var p = piece.slice(1, 2)
        if (p === 'R') {
            var wp_possible_m = [[-1, 0], [0, -1], [1, 0], [0, 1]]
            var bp_possible_m = [[1, 1], [1, -1], [1, 0]]

            if (color === 'w') {
                console.log('again')
                for (var i = 0; i < wp_possible_m.length; i++) {
                    var end_row = row + wp_possible_m[i][0]
                    var end_col = col + wp_possible_m[i][1]
                    console.log('r ', end_row, ' c ', end_col)
                    if ((Math.sign(end_row) !== -1 && Math.sign(end_col) !== -1) && (end_row !== 8 && end_col !== 8)) {
                        this.showImage(end_row,end_col)
                    }
                }
            }
        }
    }

    handlePress = (row, col, piece) => {
        if (!this.state.gameOver) {
            this.showPossibleMove(row, col, piece)
            if (square_selected === [row, col]) {
                square_selected = []
                player_clicks = []
            } else {
                square_selected = [row, col]
                player_clicks.push(square_selected)
            }
            piece_selected.push(piece)
            var p = piece_selected[0].slice(1, 2)
            if ((player_clicks.length) === 2) {
                if (p === 'p') {
                    this.getPawnMove(player_clicks[0][0], player_clicks[0][1], player_clicks[1][0], player_clicks[1][1])
                }
                if (p === 'N') {
                    this.getKnightMove(player_clicks[0][0], player_clicks[0][1], player_clicks[1][0], player_clicks[1][1])
                }

                if (p === 'B') {
                    this.getBishopMove(player_clicks[0][0], player_clicks[0][1], player_clicks[1][0], player_clicks[1][1])
                }

                if (p === 'R') {
                    this.getRookMove(player_clicks[0][0], player_clicks[0][1], player_clicks[1][0], player_clicks[1][1])
                }
                if (p === 'Q') {
                    this.getQueenMove(player_clicks[0][0], player_clicks[0][1], player_clicks[1][0], player_clicks[1][1])
                }
                // console.log("p1: ",player_clicks[0],' p2: ',player_clicks[1])
                // const move = new Move(player_clicks[0], player_clicks[1], this.state.Board)
                // this.makeMove(move)
                square_selected = []
                player_clicks = []
                piece_selected = []
            }

        }
    }

    render() {
        const piece = [];
        let icon
        this.state.Board.map((row, i) => {
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
                        case 'dot':
                            icon = Images.dot
                            break;
                    }
                    img.push(
                        <TouchableOpacity onPress={
                            (event) => {
                                this.handlePress(i, j, pie);
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
                                this.handlePress(i, j, pie);
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
}

class Move {
    constructor(start_square, end_square, board) {
        this.start_row = start_square[0]
        this.start_col = start_square[1]
        this.end_row = end_square[0]
        this.end_col = end_square[1]
        this.piece_moved = board[this.start_row][this.start_col]
        this.piece_captured = board[this.end_row][this.end_col]
    }
}

export {
    Images,
    Move,
    GameState
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
})