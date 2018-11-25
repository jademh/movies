import { UPDATE_MOVIES, SHOW_ERROR, TOGGLE_WATCHED, ALL_UNWATCHED } from '../actions/moviesActions';

export default function moviesReducer(state = [], action) {
  switch (action.type) {
    case UPDATE_MOVIES:
      return action.movies
    case SHOW_ERROR:
      return action.payload
    case TOGGLE_WATCHED:
      return state.map(movie => {
        return (
         movie.id === action.id ? { ...movie, watched: !movie.watched} : movie
        )
      })
      case ALL_UNWATCHED:
        return state.map(movie => ({ ...movie, watched: false }))
    default: return state
  }
}