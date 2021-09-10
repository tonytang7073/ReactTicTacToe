import React, { Component } from "react";
import { render } from "react-dom";
import './tictactoe.css';

export class TicTacToe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            gameSize: 3,
        };
    }

    handleSquareClick(i) {
        const squares = this.state.squares.slice();

        if (calculateWinner(squares, this.state.gameSize) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";

        let tmpState = {};
        Object.assign(tmpState, this.state);
        tmpState.squares = squares;
        tmpState.xIsNext = !this.state.xIsNext;


        this.setState(tmpState);
    }

    handleOnChange(e) {
        let tmpState = {};
        //Object.assign(tmpState, this.state); //retain the previous game states if you want to.

        tmpState.squares = Array(e.target.value * e.target.value).fill(null);
        tmpState.xIsNext = true;

        tmpState.gameSize = e.target.value;

        this.setState(tmpState);
    }


    renderSquare(i) {
        return (<Square key={i}
            displayValue={this.state.squares[i]}
            onClick={() => this.handleSquareClick(i)}
        />
        );
    }
   
    generateBoardRows(gameSize) {
        let d = parseInt(gameSize);
        let rows = [];
        for (let r = 0; r < d; r++) {

            let cols = [];
            for (let c = 0; c < d; c++) {
                cols.push(this.renderSquare(c + r * d));    //generate the cols
            }

            rows.push(<div className="board-row">{cols}</div>); //generate the rows
        }

        return rows;
    }

    render() {

       
        const winner = calculateWinner(this.state.squares, this.state.gameSize);
        let statusPrefix = winner ? "Winner:" : "Next Player:";
        let status = winner ? statusPrefix.concat(winner) : statusPrefix.concat(this.state.xIsNext ? "X" : "O");






        return (

            <div className="container">
                <div className="row">
                    <div class="col">
                        <GameSelection handleOnChange={this.handleOnChange.bind(this)} />
                    </div>
                    <div class="col">
                        <div className="game-info">
                            <div>{status}</div>
                            <div>{/* */}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col">
                        <div className='game-board'>
                            <Board BoardRows={this.generateBoardRows(this.state.gameSize)} />
                        </div>
                    </div>
                </div>
            </div>




        );

    }


}

export class Board extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                {this.props.BoardRows}
            </div>
        );

    }
}

// no its own state, it is a functional components now.
function GameSelection(props){

        return (

            <div>
                <select id="gameSize" name="gameSize" onChange={props.handleOnChange}>
                    <option value="3">Game 3X3</option>
                    <option value="4">Game 4X4</option>
                    <option value="5">Game 5X5</option>
                    <option value="6">Game 6X6</option>
                    <option value="7">Game 7X7</option>
                    <option value="8">Game 8X8</option>
                    <option value="9">Game 9X9</option>
                    <option value="10">Game 10X10</option>
                    <option value="11">Game 11X11</option>
                    <option value="12">Game 12X12</option>
                    <option value="13">Game 13X13</option>
                    <option value="14">Game 14X14</option>
                    <option value="15">Game 15X15</option>
                </select>
            </div>
        );
}


function Square(props) {
    return (
        <button className="square" onClick={ props.onClick }>
            {props.displayValue}
            </button>
        )
}

//No its own state, it is a functional components now.
//export class Square extends Component {
//    render() {
//        return (
//            <button className="square" onClick={() => this.props.onClick()}>
//                {this.props.value}
//            </button>
//       );
//    }
//}

function calculateWinner(squares, gameSize) {

    let d = parseInt(gameSize);

    const lines = winningpositions(d);

    for (let i = 0; i < lines.length; i++) {
        const winComb = lines[i];
        //winComb.every((e) => { if (squares[e] && squares[winComb[0]] === squares[e]) { return squares[e];}})
        let lastP = 0;
        let init = squares[winComb[0]];
        for (let x = 1; x < winComb.length; x++) {

            if (init && squares[winComb[x]] === init) {
                lastP = x;
            }
        }

        if (lastP === winComb.length - 1) { return init;}



        //const [a, b, c] = lines[i];
        //if (squares[a] && squares[a] === squares[b] && squares[c] === squares[b]) {
        //    return squares[a];
        //}
    }

    return null;
}


   //const lines = [
    //    [0, 1, 2],
    //    [3, 4, 5],
    //    [6, 7, 8],
    //    [0, 3, 6],
    //    [1, 4, 7],
    //    [2, 5, 8],
    //    [0, 4, 8],
    //    [2, 4, 6],
    //];
function winningpositions(gameSize) {

    let d = parseInt(gameSize);

    if (!Number.isSafeInteger(d) && d <= 2) {
        throw new TypeError("The diamention of the squre must be greater or equal to 3");
    }

    const lines = []; //new Array(d + d + 2);


    
    for (let r = 0; r < d; r++) {
        let cols = [];
        let rows = [];
        for (let c = 0; c < d; c++) {
            cols.push(c + r * d);
            rows.push(c * d + r);
        }
        lines.push(cols); //each row
        lines.push(rows); //each cols
    }

    //First cross positions
    let crossF = [];
    let firstCross = 0; let firstGap = d + 1;
    for (let x = 0; x < d; x++) {
        crossF.push(firstCross + x * firstGap);
    }
    lines.push(crossF);

    //Last cross positions
    let crossL = [];
    let lastCross = d - 1; let lastGap = d - 1;
    for (let x = 0; x < d; x++) {
        crossL.push(lastCross + x * lastGap);
    }

    lines.push(crossL);
    return lines;

}