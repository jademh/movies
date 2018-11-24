import React, { Component } from 'react';
import Movie from './Movie';
import { calculatePercentage } from '../helpers/math';
export default class MovieList extends Component {
  constructor(props) {
    super(props);
    this.markUnwatched = this.markUnwatched.bind(this);
  }

  state = {
    movies: [],
  }


  fetchPage(pageNumber = 1, results = []) {
    //lilo
    //const personId = 49265;
    //tyra
    //const personId = 77897;
    // nic cage
    const personId = 2963;
    const key = process.env.REACT_APP_MOVIEDB;

    const fetchPath = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=release_date.desc&include_adult=false&page=${pageNumber}&include_video=false&with_people=${personId}`;
    //const fetchPath = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&release_date.gte=1984-08-01&release_date.lte=1984-08-31`;

    
    return fetch(fetchPath, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    })
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

  componentDidMount() {
    this.fetchPage().then((movies) => {
      if(movies) {
        movies.forEach(movie => movie.watched = false);
        this.setState({movies});
      }
    });
  }
  
  render() {
      const totalMovies = this.state.movies.length;
      const seenMovies = this.state.movies.filter(movie => movie.watched).length;
      const percentage = calculatePercentage(seenMovies, totalMovies);
      if (totalMovies > 0) {
        return (
          <div>
            <h1>
              <span data-testid="movies-seen">{seenMovies}</span>
              <span> / </span>
              <span data-testid="movies-total">{totalMovies}</span>
              <span> ... </span>
              <span data-testid="movies-percentage">{percentage}</span>
            </h1>
            <button data-testid="movies-undo" onClick={this.markUnwatched}>Undo</button>
            <ul className="movie-list">
            {this.state.movies.map((movie) => {
              return (
                <li 
                  key={movie.id}
                  className={`movie-list_item ${movie.watched ? 'st-watched' : ''}`}>
                  <button
                    data-testid="movie-button"
                    onClick={() => this.toggleMovie(movie.id)}
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
        )
      }
      return (
        <div data-testid="loading">Loading...</div>
      )
  }
}
