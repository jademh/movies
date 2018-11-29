import React, { Component } from 'react';
import MovieFilter from './MovieFilter';
import MovieResults from './MovieResults';

const MOVIE_API_KEY = process.env.REACT_APP_MOVIEDB;

const sortFilters = [
  {
    value: "RELEASE_DATE_DESC",
    label: "Sort by: Recently Released"
  },
  {
    value: "RELEASE_DATE_ASC",
    label: "Sort by: Oldies first"
  },
  {
    value: "HIGH_TO_LOW",
    label: "Sort by: Popularity - High to Low"
  },
  {
    value: "LOW_TO_HIGH",
    label: "Sort By: Popularity - Low to High"
  },
]

const filters = [
  {
    value: "ALL",
    label: "Filter by rating"
  },
  {
    value: "FRESH",
    label: "Fresh 🌟"
  },
  {
    value: "ROTTEN",
    label: "Rotten 💩"
  },
  {
    value: "TENS",
    label: "Tens across the board 😍"
  },
];

const actors = [
  {
    value: 1920,
    label: 'Winona Ryder'
  },
  {
    value: 6886,
    label: 'Christina Ricci'
  },
  {
    value: 38225,
    label: 'Cher'
  },
  {
    value: 2155,
    label: 'Thora Birch'
  },
  {
    value: 2963,
    label: 'Nicolas Cage'
  },
  {
    value: 6384,
    label: 'Keanu Reeves'
  },
  {
    value: 77897,
    label: 'Tyra Banks'
  },
  {
    value: 49265,
    label: 'Lindsay Lohan'
  },
  {
    value: 11617,
    label: 'Mischa Barton'
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
    this.onSort = this.onSort.bind(this);
    this.filterMovies = this.filterMovies.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.fetchGenres = this.fetchGenres.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  state = {
    actor: actors[0].value,
    movies: [],
    filteredMovies: [],
    genres: [],
    dataLoaded: false,
    filter: filters[0].value,
    sortOrder: sortFilters[0].value,
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
    const sortOrder = this.state.sortOrder;
    let filteredMovies = [...this.state.movies];

    switch(sortOrder) {
      case 'RELEASE_DATE_DESC':
        filteredMovies.sort((a,b) => {
          const aDate = new Date(a.release_date);
          const bDate = new Date(b.release_date);
          return aDate < bDate ? 1 : -1
        });
        break;
      case 'RELEASE_DATE_ASC':
        filteredMovies.sort((a,b) => {
          const aDate = new Date(a.release_date);
          const bDate = new Date(b.release_date);
          return aDate > bDate ? 1 : -1
        });
        break;
      case 'LOW_TO_HIGH':
        filteredMovies.sort((a,b) => a.vote_average > b.vote_average ? 1 : -1);
        break;
      case 'HIGH_TO_LOW':
        filteredMovies.sort((a,b) => a.vote_average < b.vote_average ? 1 : -1);
        break;
      default: //nothing
    }

    switch(filterType) {
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
          if (movie.genre_ids[i].toString() === genreFilter.toString()) {
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
    this.setState({genreFilter: this.state.genres[0].value, filter: filters[0].value, filtersApplied: false}, () => {
      this.filterMovies();
    });
  }

  onFilter(val) {
    this.setState({filter: val.value, filtersApplied: true}, () => {
      this.filterMovies();
    });
  }

  onFilterGenre(val) {
    this.setState({genreFilter: val.value, filtersApplied: true}, () => {
      this.filterMovies();
    });
  }

  onSort(val) {
    this.setState({sortOrder: val.value}, () => {
      this.filterMovies();
    });
  }

  onActorChange(val) {
    this.setState({actor: val.value}, () => {
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
      let genres = data.genres;
      genres = genres.map(genre => {
        return {
          value: genre.id,
          label: genre.name,
        }
      })
      genres.unshift({value: 'ALL', label: 'All Genres'});
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
        <div className="nav">
          <div className="filterGroup">
            <MovieFilter filters={actors} activeFilter={this.state.actor} onChange={this.onActorChange} />
            <MovieFilter filters={sortFilters} activeFilter={this.state.sortOrder} onChange={this.onSort} />
            <MovieFilter filters={filters} activeFilter={this.state.filter} onChange={this.onFilter} />
            <MovieFilter filters={this.state.genres} activeFilter={this.state.genreFilter} onChange={this.onFilterGenre} />
          </div>

          <div className="actionGroup">
            <button data-testid="movies-undo" onClick={this.markUnwatched}>Mark All Unwatched</button>
            <button onClick={this.clearFilters} disabled={!this.state.filtersApplied}>Clear Filters</button>
          </div>
        </div>

        <MovieResults
          loaded={this.state.dataLoaded}
          movies={movies}
          onClick={this.toggleMovie}
          actorName={actors.find(actor => this.state.actor === actor.value).label}
          genres={this.state.genres}
          genre={this.state.genreFilter}
          />
    </div>
    )
  }
}
