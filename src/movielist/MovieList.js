import React, { Component } from 'react';
import MovieFilter from './MovieFilter';
import MovieResults from './MovieResults';

const MOVIE_API_KEY = process.env.REACT_APP_MOVIEDB;

const filters = [
  {
    id: "LOW_TO_HIGH",
    name: "Low to High"
  },
  {
    id: "HIGH_TO_LOW",
    name: "High to Low"
  },
  {
    id: "FRESH",
    name: "Fresh"
  },
  {
    id: "ROTTEN",
    name: "Rotten"
  },
  {
    id: "TENS",
    name: "Tens across the board"
  },
];

const actors = [
  {
    id: 1920,
    name: 'Winona Ryder'
  },
  {
    id: 6886,
    name: 'Christina Ricci'
  },
  {
    id: 2155,
    name: 'Thora Birch'
  },
  {
    id: 2963,
    name: 'Nicolas Cage'
  },
  {
    id: 6384,
    name: 'Keanu Reeves'
  },
  {
    id: 77897,
    name: 'Tyra Banks'
  },
  {
    id: 49265,
    name: 'Lindsay Lohan'
  },
  {
    id: 11617,
    name: 'Mischa Barton'
  },
];

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
    this.clearFilters = this.clearFilters.bind(this);
  }

  state = {
    actor: actors[0].id,
    movies: [],
    filteredMovies: [],
    genres: [],
    dataLoaded: false,
    filter: filters[0].id,
    genreFilter: null,
    filtersApplied: false,
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

  clearFilters() {
    this.setState({genreFilter: this.state.genres[0].id, filter: filters[0].id, filtersApplied: false}, () => {
      this.filterMovies();
    });
  }

  onFilter(e) {
    this.setState({filter: e.target.value, filtersApplied: true}, () => {
      this.filterMovies();
    });
  }

  onFilterGenre(e) {
    this.setState({genreFilter: e.target.value, filtersApplied: true}, () => {
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
      genres.unshift({id: 'ALL', name: 'All Genres'});
      this.setState({genres, genreFilter: 'ALL'});
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
        <div>
          <MovieFilter filters={actors} activeFilter={this.state.actor} onChange={this.onActorChange} />
          <MovieFilter filters={filters} activeFilter={this.state.filter} onChange={this.onFilter} />
          <MovieFilter filters={this.state.genres} activeFilter={this.state.genreFilter} onChange={this.onFilterGenre} />
        </div>

        <div>
          <button data-testid="movies-undo" onClick={this.markUnwatched}>Mark All Unwatched</button>
          <button onClick={this.clearFilters} disabled={!this.state.filtersApplied}>Clear Filters</button>
        </div>

        <MovieResults loaded={this.state.dataLoaded} movies={movies} onClick={this.toggleMovie} />
    </div>
    )
  }
}
