import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { TicTacToe } from './components/TicTacToe';
import { AnimalGame } from './components/AnimalGame';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/TicTacToe' component={TicTacToe} />
            <Route path='/AnimalGame' component={AnimalGame} />
      </Layout>
    );
  }
}
