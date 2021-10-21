import React, { Component } from "react";
import BinaryNode from "../classes/BinaryNode"
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";

export class AnimalGame extends Component{
    constructor(props) {
        super(props);
        this.state = {currentTree:null, currentNode: null, finalGuess:null, currentMode:GameMode.INIT, gameMessage: null}
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
            this.setState({ currentNode: tree, finalGuess: null, currentMode: GameMode.INPROGRESS, gameMessage: null });
        }
    }

    //handleRadioOnChange(e) {
    //    this.setState({ currentAnswer:e.target.value})
    //}

    //handleTextInputChange(e) {
    //    this.setState({
    //        [e.target.name]: e.target.value
    //    });
    //}


    handleSubmitOnClick(e) {
        let node = this.state.currentNode;
        let yesNo = e.yesnoRadios;
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
        let answer = e.answer;
        let question = e.question;
        let yesAnswer = e.yesAnswer;

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
                        <PlayGame data={question} mode={currentMode} handleOnClick={(e) => { this.handleSubmitOnClick(e) }} />
                    </div>
                </div>

                <div className="row">
                    <div class="col d-flex justify-content-center">
                        <TrainMe guess={guess}  mode={currentMode} handleOnClick={(e) => { this.handleTrainMeOnClick(e) }} />
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
                <Formik
                    initialValues={{ yesnoRadios: "" }}
                    validate={(values) => {
                        let errors = {};
                        if (values.yesnoRadios === "") {
                            errors.yesnoRadios = "Please select Yes or No!";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => { props.handleOnClick(values); resetForm({}); }} //force to rest the form 
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <h4>{props.data}</h4>
                            <div class="form-check">
                                <labe>
                                    <Field type="radio" name="yesnoRadios" value="y" />
                                    Yes
                                </labe>

                            </div>
                            <div class="form-check">
                                <labe>
                                <Field type="radio" name="yesnoRadios" value="n" />
                                No
                                </labe>

                            </div>
                            <ErrorMessage name="yesnoRadios">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                            <div>
                                <button type="submit"  class="btn btn-secondary btn-lg">{isSubmitting ? "Please wait..." : "Submit"}</button>
                            </div>

                        </Form>
                    )}
                </Formik>
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
               <Formik
                   initialValues={{ answer: "", question: "", yesAnswer: "--" }}
                   validate={(values) => {
                       let errors = {};
                       if (values.answer === "") { errors.answer = "What is it can not be empty!"; }
                       if (values.question === "") { errors.question = "The distinguishing question can not be empty!"; }
                       if (values.yesAnswer === "--") { errors.yesAnswer = "Please select an answer!"; }
                       return errors;
                   }}
                   onSubmit={(values, { resetForm }) => { props.handleOnClick(values); resetForm({ answer: "", question: "", yesAnswer: "--" }); }} //force to rest the form
               >
                   {({ values, isSubmitting, errors, touched }) => (
                       <Form>
                           <h3>Ooh, You win!! Please train me to be better!</h3>
                           <div class="form-group">
                               <label for="answer">So, What is it?</label>
                               <Field type="text" class="form-control" id="answer" name="answer" />
                               <ErrorMessage name="answer">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                           </div>
                           <div class="form-group">
                               <label for="question">Suggest a yes/no question to distinguish {props.guess} from {values.answer}</label>
                               <Field type="text" class="form-control" id="question" name="question" />
                               <ErrorMessage name="question">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                           </div>
                           <div class="form-group">
                               <label for="yesAnswer">The "Yes" answer for your question are: </label>
                               <Field as="select" class="form-control" id="yesAnswer" name="yesAnswer" >
                                   <option value="--">-----</option>
                                   <option value={props.guess}>{props.guess}</option>
                                   <option value={values.answer}>{values.answer}</option>
                               </Field>
                               <ErrorMessage name="yesAnswer">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                           </div>
                           <button type="submit" class="btn btn-primary">{isSubmitting ? "Please wait..." : "Submit"}</button>
                       </Form>
                   )}
               </Formik>
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