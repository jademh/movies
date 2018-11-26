import { connect } from 'react-redux';
import { MovieList } from './MovieList'
import { toggleMovie, markAllUnwatched } from '../actions/movies';

const mapStateToProps = state => ({
  movies: state.movies
})

const mapDispatchToProps = dispatch => ({
  toggleMovie: id => dispatch(toggleMovie(id)),
  markAllUnwatched: () => dispatch(markAllUnwatched())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovieList)