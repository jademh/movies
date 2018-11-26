import React, { Component } from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';

export class MovieList extends Component {

  render() {

      const {
        movies,
        markAllUnwatched,
        toggleMovie
      } = this.props;

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
            <button data-testid="movies-undo" onClick={markAllUnwatched}>Mark all Unwatched</button>
            <ul className="movie-list">
            {movies.map((movie) => {
              return (
                <li 
                  key={movie.id}
                  className={`movie-list_item ${movie.watched ? 'st-watched' : ''}`}>
                  <button
                    data-testid="movie-button"
                    onClick={() => toggleMovie(movie.id)}
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


export default MovieList;
