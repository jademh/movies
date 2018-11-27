import React, { Component } from 'react';
import MovieListWrapper from './movielist/MovieListWrapper';
import { connect } from 'react-redux';
import { fetchMovies } from './actions/movies';

export class App extends Component {

  componentDidMount() {
    this.props.onFetchMovies();
  }

  render() {
    return (
      <div className="App">
        <MovieListWrapper />
      </div>
    );
  }
}

const mapStateToProps =  state => ({
  movies: state.movies,
})

const mapActionsToProps = {
  onFetchMovies: fetchMovies,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
