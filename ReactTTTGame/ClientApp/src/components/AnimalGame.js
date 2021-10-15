import React, { Component } from "react";
import BinaryNode from "../classes/BinaryNode"
import BinaryTree from "../classes/BinaryTree"

export class AnimalGame extends Component{
    constructor(props) {
        super(props);
        this.state = {currentTree:null, currentNode: null, finalGuess:null, currentAnswer:null, currentMode:GameMode.INIT, gameMessage: null}
    }

    componentDidMount() {
        this.populateGameData();
    }

    async populateGameData() {
        const response = await fetch('api/WriteJson', { method: 'GET', headers: { 'Accept': 'application/json','Content-Type': 'application/json',}});
        const data = await response.json();
        this.setState({ currentTree: data });
    }
   
    handleNewGameOnClick(e) {
        let tree = this.state.currentTree;
        if (tree == null) { alert("Opps!, just a moment... Game data is not ready yet!"); }
        else {
            this.setState({ currentNode: tree, finalGuess: null, currentAnswer: null, currentMode: GameMode.INPROGRESS, gameMessage: null });
        }
    }

    handleRadioOnChange(e) {
        this.setState({ currentAnswer:e.target.value})
    }

    handleTextInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    handleSubmitOnClick(e) {
        let node = this.state.currentNode;
        let yesNo = this.state.currentAnswer;
        let nextNode = null;
        if (node.yesNode && node.noNode) {
            if (yesNo === "y") {
                nextNode = node.yesNode;
            }
            else {
                nextNode = node.noNode;
            }

            this.setState({ currentNode: nextNode });
        } else {
            if (yesNo === "y") {
                this.setState({ gameMessage: "I Win!!!!!", currentMode: GameMode.PLAYAGAIN });
            }
            else {
                this.setState({ finalGuess:node.data, currentMode: GameMode.TRAINME });
            }
        }

    }

    handleTrainMeOnClick(e) {
        let tree = this.state.currentTree;
        let node = this.state.currentNode;
        let guess = node.data;
        let answer = this.state.answer;
        let question = this.state.question;
        let yesAnswer = this.state.yesAnswer;

        node.data = question;
        node.yesNode = new BinaryNode(yesAnswer);

        if (guess === yesAnswer) {
            node.noNode = new BinaryNode(answer);
        } else {
            node.noNode = new BinaryNode(guess);
        }

        let newtree = JSON.stringify(tree, null, 2);


        let fileDto = {
            Name: 'animaltree.json',
            Path: 'data',
            Body: newtree
        }


        this.saveGameData(fileDto);
          

    }

    async saveGameData(fileDto) {
        const resp = await fetch('api/WriteJson', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fileDto),
        });

        this.setState({ gameMessage:"Thank you for training me to get better!!!", currentMode: GameMode.PLAYAGAIN });

    }

    aOran(name) {
        const vowels = ["A", "E", "I", "O", "U"];
        const firstLetter = name.charAt(0).toUpperCase();
        if (vowels.includes(firstLetter)) { return "an "; }
        else { return "a ";}
    }


    render() {


        let node = this.state.currentNode;
        let question = (node == null) ? null: (node.yesNode && node.noNode) ? node.data : "Is it " + this.aOran(node.data) + node.data + "?";
        let currentMode = this.state.currentMode;
        let gameMessage = this.state.gameMessage;

        let guess = this.state.finalGuess;
        let answer = this.state.answer;

        return (
            <div className="container">
                <div className="row">
                    <div class="col">
                        <WelcomeMessage mode={currentMode} />
                    </div>
                </div>
                <div className="row">
                    <div class="col d-flex justify-content-center">
                        <StartAGame gameMessage={gameMessage} mode={currentMode} handleOnClick={(e) => { this.handleNewGameOnClick(e) }} />
                    </div>
                </div>
                <div className="row">
                    <div class="col d-flex justify-content-center">
                        <PlayGame data={question} mode={currentMode} handleOnClick={(e) => { this.handleSubmitOnClick(e) }} handleOnChange={(e) => { this.handleRadioOnChange(e) }} />
                    </div>
                </div>

                <div className="row">
                    <div class="col d-flex justify-content-center">
                        <TrainMe guess={guess} answer={answer} mode={currentMode} handleOnClick={(e) => { this.handleTrainMeOnClick(e) }} handleOnChange={(e) => { this.handleTextInputChange(e) }} />
                    </div>
                </div>
             
            </div>
        );
    }
}


function WelcomeMessage(props) {

    let mode = props.mode;

    if (mode === GameMode.INIT) {
        return (
            <div className="container">
                <h1>Welcome to the Animal Game</h1>
                <p>The Animal Game learns from its mistakes! If I cannot guess the animal you are thinking of, you can teach the game how to guess your animal.</p>
            </div>
        );
    } else {
        return (null);
    }
   
}

function StartAGame(props) {

    let mode = props.mode;
    const gameMessage = props.gameMessage;
    const playTitle = mode === GameMode.PLAYAGAIN ? "Play Again" : "Play Now"

    if (mode === GameMode.PLAYAGAIN || mode === GameMode.INIT) {
        return (
            <div>
                <ShowMessage Message={gameMessage} />
                <h5>Thinking of an animal, once ready, click the {playTitle} button below.</h5>
                <button type="button" onClick={props.handleOnClick} class="btn btn-primary btn-lg">{playTitle}</button>
            </div>

        );
    } else {
        return (null);
    }

  
}

function ShowMessage(props) {
    if (props.Message) {
        return (
            <h3>{ props.Message }</h3>
        );
    } else {
        return (null);
    }
}


function PlayGame(props) {

    let mode = props.mode;
    if (mode === GameMode.INPROGRESS) {

        return (
            <div>
                <h4>{props.data}</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="yesnoRadios" id="yesRadios" value="y" onChange={props.handleOnChange} />
                    <label class="form-check-label" for="yesRadios">
                        Yes
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="yesnoRadios" id="noRadios" value="n" onChange={props.handleOnChange} />
                    <label class="form-check-label" for="noRadios">
                        No
                    </label>
                </div>
                <div>
                    <button type="button" onClick={props.handleOnClick} class="btn btn-secondary btn-lg">Submit</button>
                </div>
            </div>
        );
    } else {
        return (null);
    }
}

function TrainMe(props) {
    let mode = props.mode;
   if (mode === GameMode.TRAINME) {
        return (
            <div>
                <h3>Ooh, You win!! Please train me to be better!</h3>
                <div class="form-group">
                    <label for="answer">So, What is it?</label>
                    <input type="text" class="form-control" id="answer" name="answer" onChange={props.handleOnChange} />
                </div>
                <div class="form-group">
                    <label for="question">Suggest a yes/no question to distinguish {props.guess} from {props.answer}</label>
                    <input type="text" class="form-control" id="question" name="question" onChange={props.handleOnChange} />
                </div>
                <div class="form-group">
                    <label for="yesAnswer">The "Yes" answer for your question are: </label>
                    <select class="form-control" id="yesAnswer" name="yesAnswer" onChange={props.handleOnChange} >
                        <option value="--">-----</option>
                        <option value={props.guess}>{props.guess}</option>
                        <option value={props.answer}>{props.answer}</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" onClick={props.handleOnClick}>Submit</button>

            </div>

        );
    } else {
        return (null);
    }
}

const GameMode = {
    INIT: 0,
    INPROGRESS: 1,
    PLAYAGAIN: 2,
    TRAINME: 3,
}