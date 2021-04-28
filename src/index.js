import React, { Component} from 'react';
import {render} from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import { MapasApp } from './MapasApp';
import {MapasUsuarios} from './MapasUsuarios';

class App extends Component{
  render(){
    return (
      <>

      <Router>

          <Route exact path="/" component={MapasApp} />
          <Route exact path="/usuario" component={MapasUsuarios} />

      </Router>
      </>

    );
  }
}

render(<App />,document.getElementById('root'));
