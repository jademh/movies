import React from 'react';
import PropTypes from 'prop-types';

export const POSTER_PATH = 'http://image.tmdb.org/t/p/w300';

export default function Movie(props) {
  const {
    title,
    releaseDate,
    posterPath,
  } = props;

  let movieTitle = title;
  if(releaseDate) {
    movieTitle += ` (${releaseDate.slice(0,4)})`;
  }

  if (posterPath === null) {
    return (
      <div data-testid="movie">
        <span data-testid="movie-title">{movieTitle}</span>
      </div>
    )
  }
  return (
    <div data-testid="movie">
      <img
        data-testid="movie-poster"
        src={`${POSTER_PATH}${posterPath}`}
        alt={movieTitle}
      />
    </div>
  )
}

Movie.propTypes = {
    title: PropTypes.string.isRequired,
    releaseDate: PropTypes.string,
    posterPath: PropTypes.string,
};
