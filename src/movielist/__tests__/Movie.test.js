import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Movie, { POSTER_PATH } from '../Movie';

afterEach(() => {
  cleanup();
  console.error.mockClear();
});

console.error = jest.fn();

const movie = {
  title: 'Hackers',
  releaseDate: '1995-09-15',
  posterPath: '/image.jpg'
};

const movieWithNoPoster = {
  title: 'Hackers',
  releaseDate: '1995-09-15',
  posterPath: null
};

const movieWithNoReleaseDate = {
  title: 'Hackers',
  releaseDate: '',
  posterPath: '/image.jpg'
};

test('<Movie />', () => {
  render(<Movie />);
  expect(console.error).toHaveBeenCalled();
});

test('<Movie /> with poster and release date', () => {
  const { getByTestId, queryByTestId, container} = render(
      <Movie title={movie.title} releaseDate={movie.releaseDate} posterPath={movie.posterPath} />
  );
  expect(console.error).not.toHaveBeenCalled();
  expect(queryByTestId('movie-title')).toBe(null);
  expect(getByTestId('movie-poster').src).toBe(`${POSTER_PATH}${movie.posterPath}`);
  expect(getByTestId('movie-poster').getAttribute('alt')).toBe('Hackers (1995)');
  expect(container.firstChild).toMatchSnapshot();
});

test('<Movie /> with no poster', () => {
  const { getByTestId, queryByTestId, container } = render(
      <Movie title={movieWithNoPoster.title} releaseDate={movieWithNoPoster.releaseDate} posterPath={movieWithNoPoster.posterPath} />
  );
  expect(console.error).not.toHaveBeenCalled();
  expect(queryByTestId('movie-poster')).toBe(null);
  expect(getByTestId('movie-title').textContent).toBe('Hackers (1995)');
  expect(container.firstChild).toMatchSnapshot();
});

test('<Movie /> with no release date', () => {
  const { getByTestId, queryByTestId, container } = render(
      <Movie title={movieWithNoReleaseDate.title} releaseDate={movieWithNoReleaseDate.releaseDate} posterPath={movieWithNoReleaseDate.posterPath} />
  );
  expect(console.error).not.toHaveBeenCalled();
  expect(getByTestId('movie-poster').getAttribute('alt')).toBe('Hackers');
  expect(container.firstChild).toMatchSnapshot();
});