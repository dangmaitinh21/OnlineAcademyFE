// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";

// ReactDOM.render(<App />, document.getElementById("root"));
import 'core-js';
import './components/admin/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './components/admin/serviceWorker';

import { icons } from './components/admin/assets/icons'

import { Provider } from 'react-redux'
import store from './components/admin/store'

React.icons = icons

ReactDOM.render(
  <div >
    <App/>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();