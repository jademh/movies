import React from 'react';
import { render, cleanup } from 'react-testing-library';
import MovieList from '../MovieList';

afterEach(() => {
  cleanup();
});

const movies = [
    {
      id: 1,
      title: 'Hackers',
      releaseDate: '1995-09-15',
      posterPath: '/image.jpg',
      watched: false,
    },
    {
      id: 2,
      title: 'Confessions of a teenage Drama Queen',
      releaseDate: '2004-02-17',
      posterPath: '/image.jpg',
      watched: false,
    },
    {
      id: 3,
      title: 'Clueless',
      releaseDate: '1995-10-20',
      posterPath: '/image.jpg',
      watched: false,
    },
  ];


test('<MovieList />', () => {
  const { getByTestId, getAllByTestId, container} = render(
    <MovieList movies={movies} />
  );

  const numberOfMovies = movies.length;

  // Check that the correct number of movies has been rendered
  expect(getAllByTestId('movie').length).toBe(numberOfMovies);
  
  const seenCount = getByTestId('movies-seen');
  const totalCount = getByTestId('movies-total');
  const moviesPercentage = getByTestId('movies-percentage');

  // Check that total movies is equal to the number of movies returned by the API
  expect(totalCount.textContent).toBe(`${numberOfMovies}`);

  // Check that seen count starts at 0
  expect(seenCount.textContent).toBe('0');
  expect(moviesPercentage.textContent).toBe('0%');
  expect(container.firstChild).toMatchSnapshot();
});


test('<MovieList /> 0 length', () => {
  const movies = [];
  const { getByTestId, container } = render(
      <MovieList movies={movies} />
  );
  expect(getByTestId('loading')).toBeTruthy();
  expect(container.firstChild).toMatchSnapshot();
});
