export const UPDATE_MOVIES = 'movies:update';
export const SHOW_ERROR = 'movies:showError';
export const TOGGLE_WATCHED = 'movies:toggleWatched';
export const ALL_UNWATCHED = 'movies:markAllUnwatched';

export function updateMovies(movies) {
  return {
    type: UPDATE_MOVIES,
    movies
  }
}

export function toggleMovie(id) {
  return {
    type: TOGGLE_WATCHED,
    id
  }
}

export function markAllUnwatched() {
  return {
    type: ALL_UNWATCHED,
  }
}

export function showError() {
  return {
    type: SHOW_ERROR,
    payload: 'error'
  }
}

export function fetchMovies() {
  return dispatch => {
    fetchPage()
    .then((movies) => {
      if(movies) {
        movies.forEach(movie => movie.watched = false);
        dispatch(updateMovies(movies));
      }
    }).catch(err => {
      dispatch(showError());
    });
  }
}

function fetchPage(pageNumber = 1, results = []) {
  //lilo
  const personId = 49265;
  //tyra
  //const personId = 77897;
  // nic cage
  //const personId = 2963;
  const key = process.env.REACT_APP_MOVIEDB;
  const fetchPath = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=release_date.desc&include_adult=false&page=${pageNumber}&include_video=false&with_people=${personId}`;
  return fetch(fetchPath, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })
  .then((response) => response.json())
  .then((data) => {
    results.push(...data.results);
    if(data.total_pages > 1 && data.page < data.total_pages) {
      return fetchPage(pageNumber + 1, results);
    }
    else {
      return results;
    }
  }).catch((err) => {
    // failed
  });
}
