
const movies = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_MOVIES':
      return action.movies
    case 'MOVIE_FETCH_ERROR':
      return action.payload
    case 'TOGGLE_MOVIE_WATCHED':
      return state.map(movie => {
        return (
         movie.id === action.id ? { ...movie, watched: !movie.watched} : movie
        )
      })
      case 'MOVIES_ALL_UNWATCHED':
        return state.map(movie => ({ ...movie, watched: false }))
    default: return state
  }
}

export default movies;