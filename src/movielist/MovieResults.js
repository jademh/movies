import React from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';

const MovieResults = (props) => {
  const { loaded, movies, onClick }  = props;

  const totalMovies = movies.length;
  const seenMovies = movies.filter(movie => movie.watched).length;
  const percentage = calculatePercentage(seenMovies, totalMovies);

  if(!loaded) {
    return (
      <div data-testid="loading">... Loading Movies</div>
    )
  }
  if(movies.length <= 0) {
    return (
      <div>No results</div>
    )
  }
  return (
    <div>
      <h1>
          <span data-testid="movies-seen">{seenMovies}</span>
          <span> / </span>
          <span data-testid="movies-total">{totalMovies}</span>
          <span> ... </span>
          <span data-testid="movies-percentage">{percentage}</span>
      </h1>
      <ul className="movie-list">
      {movies.map((movie) => {
        return (
          <li 
            key={movie.id}
            className={`movie-list_item ${movie.watched ? 'st-watched' : ''}`}>
            <button
              data-testid="movie-button"
              onClick={() => onClick(movie.id)}
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
  );
}

export default MovieResults;