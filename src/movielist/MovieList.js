import React, { Component } from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';
import { connect } from 'react-redux';
import { toggleMovie, markAllUnwatched } from '../actions/moviesActions';

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.markUnwatched = this.markUnwatched.bind(this);
  }


  toggleMovie(id) {
    const movies = [...this.state.movies];
    const movie = movies.find((movie) => movie.id === id);
    movie.watched = !movie.watched;
    this.setState({movies});
  }

  markUnwatched() {
    const movies = [...this.statproe.movies];
    movies.forEach(movie => movie.watched = false);
    this.setState({movies});
  }

  render() {
      const movies = this.props.movies;
      const totalMovies = movies.length;
      const seenMovies = movies.filter(movie => movie.watched).length;
      const percentage = calculatePercentage(seenMovies, totalMovies);
      if (totalMovies > 0) {
        return (
          <div>
            <h1>
              <span data-testid="movies-seen">{seenMovies}</span>
              <span> / </span>
              <span data-testid="movies-total">{totalMovies}</span>
              <span> ... </span>
              <span data-testid="movies-percentage">{percentage}</span>
            </h1>
            <button data-testid="movies-undo" onClick={this.props.onMarkAllUnwatched}>Mark all Unwatched</button>
            <ul className="movie-list">
            {movies.map((movie) => {
              return (
                <li 
                  key={movie.id}
                  className={`movie-list_item ${movie.watched ? 'st-watched' : ''}`}>
                  <button
                    data-testid="movie-button"
                    onClick={() => this.props.onToggleMovie(movie.id)}
                    className="movie-list_item-button"
                  >
                    <Movie
                      title={movie.title}
                      releaseDate={movie.release_date}
                      posterPath={movie.poster_path}
                    />
                  </button>
                </li>
              )
            })}
            </ul>
        </div>
        )
      }
      return (
        <div data-testid="loading">Loading...</div>
      )
  }
}

const mapStateToProps =  state => ({
  user: state.user,
  movies: state.movies,
});

const mapActionsToProps = {
  onToggleMovie: toggleMovie,
  onMarkAllUnwatched: markAllUnwatched,
};

export default connect(mapStateToProps, mapActionsToProps)(MovieList);
