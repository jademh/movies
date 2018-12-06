import React from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';
import './css/movielist.scss';

const MovieResults = (props) => {
  const { loaded, movies, onClick, actorName, genres, genre }  = props;

  const totalMovies = movies.length;
  const seenMovies = movies.filter(movie => movie.watched).length;
  const percentage = calculatePercentage(seenMovies, totalMovies);
  let currentGenre = '';
  
  if(loaded && genre !== 'ALL') {
    currentGenre = genres.find(g => g.value.toString() === genre.toString()).label.toLowerCase();
  }

  if(!loaded) {
    return (
      <div className="movie-list_loading" data-testid="loading">... Loading Movies</div>
    )
  }
  if(movies.length <= 0) {
    return (
      <div className="movie-list_loading">No results</div>
    )
  }
  return (
    <div>
      <h1 className="movie-list_summary">
          <span>I have seen </span>
          <span data-testid="movies-seen">{seenMovies}</span>
          <span>/</span>
          <span data-testid="movies-total">{totalMovies}</span>
          <span> {actorName} {currentGenre} movies</span>
          <span> (<span data-testid="movies-percentage">{percentage}</span>)</span>
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