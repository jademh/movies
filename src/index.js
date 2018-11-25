import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';
import moviesReducer from './reducers/moviesReducer';
require('dotenv').config();

const allReducers = combineReducers({
  user: userReducer,
  movies: moviesReducer,
});

const allStoreEnhancers = compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension()
);

const store = createStore(
  allReducers,
  {
    user: 'Jade',
    movies: [],
  },
  allStoreEnhancers
  );


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
