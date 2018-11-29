import React, { Component } from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';

const MOVIE_API_KEY = process.env.REACT_APP_MOVIEDB;

export default class MovieList extends Component {
  constructor(props) {
    super(props);
    this.toggleMovie = this.toggleMovie.bind(this);
    this.markUnwatched = this.markUnwatched.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onFilterGenre = this.onFilterGenre.bind(this);
    this.onActorChange = this.onActorChange.bind(this);
    this.filterMovies = this.filterMovies.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.fetchGenres = this.fetchGenres.bind(this);
  }

  state = {
    actor: 2963,
    movies: [],
    filteredMovies: [],
    genres: [],
    dataLoaded: false,
    filter: 'LOW_TO_HIGH',
    genreFilter: 'ALL',
  }

  fetchPage(pageNumber = 1, results = []) {
    const {actor} = this.state;
    const fetchPath = `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&page=${pageNumber}&include_video=false&with_people=${actor}`;
    return fetch(fetchPath)
    .then((response) => response.json())
    .then((data) => {
      results.push(...data.results);
      if(data.total_pages > 1 && data.page < data.total_pages) {
        return this.fetchPage(pageNumber + 1, results);
      }
      else {
        return results;
      }
    }).catch((err) => {
      // failed
    });
  }

  filterMovies() {
    const filterType = this.state.filter;
    const genreFilter = this.state.genreFilter;
    let filteredMovies = [...this.state.movies];

    switch(filterType) {
      case 'LOW_TO_HIGH':
        filteredMovies.sort((a,b) => a.vote_average > b.vote_average ? 1 : -1);
        break;
      case 'HIGH_TO_LOW':
        filteredMovies.sort((a,b) => a.vote_average < b.vote_average ? 1 : -1);
        break;
      case 'FRESH':
        filteredMovies = filteredMovies.filter(movie => movie.vote_average >= 5);
        break;
      case 'ROTTEN':
        filteredMovies = filteredMovies.filter(movie => movie.vote_average <= 5);
        break;
      case 'TENS':
        filteredMovies = filteredMovies.filter(movie => movie.vote_average === 10);
        break;
      default: //nothing
    }

    if(genreFilter !== 'ALL') {
      filteredMovies = filteredMovies.filter(movie => {
        for(let i = 0; i < movie.genre_ids.length; i++) {
          if (movie.genre_ids[i].toString() === genreFilter) {
            return true;
          }
        }
        return false;
      });
    }

    this.setState({filteredMovies});
  }

  toggleMovie(id) {
    const movies = [...this.state.movies];
    const movie = movies.find((movie) => movie.id === id);
    movie.watched = !movie.watched;
    this.setState({movies});
  }

  markUnwatched() {
    const movies = [...this.state.movies];
    movies.forEach(movie => movie.watched = false);
    this.setState({movies});
  }

  onFilter(e) {
    this.setState({filter: e.target.value}, () => {
      this.filterMovies();
    });
  }

  onFilterGenre(e) {
    this.setState({genreFilter: e.target.value}, () => {
      this.filterMovies();
    });
  }

  onActorChange(e) {
    this.setState({actor: e.target.value}, () => {
      this.fetchMovies();
    });
  }

  fetchMovies() {
    this.setState({dataLoaded: false});
    this.fetchPage().then((movies) => {
      if(movies) {
        movies.forEach(movie => movie.watched = false);
        this.setState({movies}, () => {
          this.filterMovies();
          this.setState({dataLoaded: true});
        });
      }
    });
  }

  fetchGenres() {
    const genrePath = `https://api.themoviedb.org/3/genre/movie/list?api_key=${MOVIE_API_KEY}&language=en-US`;
    fetch(genrePath)
    .then(response => response.json())
    .then(data => {
      const genres = data.genres;
      this.setState({genres});
    });
  }

  componentDidMount() {
    this.fetchMovies();
    this.fetchGenres();
  }
  
  render() {
    const movies  = this.state.filteredMovies;
    return (
      <div>
        <button data-testid="movies-undo" onClick={this.markUnwatched}>Mark All Unwatched</button>
        
        <select onChange={this.onActorChange}>
          <option value="2963">Nicolas Cage</option>
          <option value="6384">Keanu Reeves</option>
          <option value="1920">Winona Ryder</option>
          <option value="77897">Tyra Banks</option>
          <option value="49265">Lindsay Lohan</option>
          <option value="11617">Mischa Barton</option>
        </select>

        <select onChange={this.onFilter}>
          <option value="LOW_TO_HIGH">Low to High</option>
          <option value="HIGH_TO_LOW">High to Low</option>
          <option value="FRESH">Fresh</option>
          <option value="ROTTEN">Rotten</option>
          <option value="TENS">Tens across the board</option>
        </select>

        <select onChange={this.onFilterGenre}>
          <option value="ALL">All Genres</option>
          {this.state.genres.map(genre => {
            return (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            )
          })}
        </select>
        <MovieResults loaded={this.state.dataLoaded} movies={movies} onClick={this.toggleMovie} />
    </div>
    )
  }
}



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
