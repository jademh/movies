import React, { Component } from 'react';
import MovieList from './movielist/MovieList';
import './App.css';

import { connect } from 'react-redux';
import { updateUser } from './actions/userActions';
import { fetchMovies } from './actions/moviesActions';

class App extends Component {
  constructor(props) {
    super(props);
    this.onUpdateUser = this.onUpdateUser.bind(this);
  }

  componentDidMount() {
    this.props.onFetchMovies();
  }

  onUpdateUser(event) {
    this.props.onUpdateUser(event.target.value);
  }

  render() {
    console.log(this.props);
    return (
      <div className="App">
        <MovieList movies={this.props.movies}/>
        <input onChange={this.onUpdateUser} />
        <span>{this.props.user}</span>
      </div>
    );
  }
}

const mapStateToProps =  state => ({
  user: state.user,
  movies: state.movies,
})

const mapActionsToProps = {
  onUpdateUser: updateUser,
  onFetchMovies: fetchMovies,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
