import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';

import MovieList from '../MovieList';
import { debug } from 'util';

global.fetch = require('jest-fetch-mock');

afterEach(() => {
  cleanup();
  console.error.mockClear();
});

console.error = jest.fn();

const movies = {
  success: true,
  results: [
    {
      id: 1,
      title: 'Hackers',
      releaseDate: '1995-09-15',
      posterPath: '/image.jpg'
    },
    {
      id: 2,
      title: 'Confessions of a teenage Drama Queen',
      releaseDate: '2004-02-17',
      posterPath: '/image.jpg'
    },
    {
      id: 3,
      title: 'Clueless',
      releaseDate: '1995-10-20',
      posterPath: '/image.jpg'
    },
  ],
};


test('<MovieList />', async () => {
  fetch.mockResponseOnce(JSON.stringify(movies));
  const { getByTestId, queryByTestId, getAllByTestId, container } = render(
      <MovieList />
  );
  expect(getByTestId('loading')).toBeTruthy();
  await waitForElement(() => getByTestId('movie'));
  expect(queryByTestId('loading')).toBeFalsy();
  
  // Check that the correct number of movies has been rendered
  expect(getAllByTestId('movie').length).toBe(movies.results.length);
  
  const movieButtons = getAllByTestId('movie-button');
  const firstMovie = movieButtons[0];
  const secondMovie = movieButtons[1];
  const thirdMovie = movieButtons[2];
  const seenCount = getByTestId('movies-seen');
  const totalCount = getByTestId('movies-total');
  const moviesPercentage = getByTestId('movies-percentage');
  const undoButton = getByTestId('movies-undo');

  // Check that total movies is equal to the number of movies returned by the API
  expect(totalCount.textContent).toBe(`${movies.results.length}`);

  // Check that seen count starts at 0
  expect(seenCount.textContent).toBe('0');
  expect(moviesPercentage.textContent).toBe('0%');
  // Check that clicking a movie increases the seen count
  fireEvent.click(firstMovie);
  expect(seenCount.textContent).toBe('1');
  // Check that clicking the same movie for a second time decreases the seen count
  fireEvent.click(firstMovie);
  expect(seenCount.textContent).toBe('0');
  fireEvent.click(firstMovie);
  expect(seenCount.textContent).toBe('1');
  fireEvent.click(secondMovie);
  expect(seenCount.textContent).toBe('2');
  fireEvent.click(thirdMovie);
  expect(seenCount.textContent).toBe('3');
  expect(moviesPercentage.textContent).toBe('100%');
  fireEvent.click(undoButton);
  expect(seenCount.textContent).toBe('0');
  expect(moviesPercentage.textContent).toBe('0%');

  expect(container.firstChild).toMatchSnapshot();
  
});

test('<MovieList /> api fail', async () => {
  movies.success = false;
  fetch.mockResponseOnce(JSON.stringify(movies));

  const { getByTestId } = render(
      <MovieList />
  );
  expect(getByTestId('loading')).toBeTruthy();
});
