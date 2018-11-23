import React, { Component } from 'react';
export default class MovieList extends Component {
  
  state = {
    movies: [],
  }


  fetchPage(pageNumber, results = []) {
    //const personId = 49265;
    const personId = 77897;
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_MOVIEDB}&language=en-US&sort_by=release_date.desc&include_adult=false&page=${pageNumber}&include_video=false&with_people=${personId}`, {
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
    });
  }

  toggleMovie(id) {
    const movies = this.state.movies;
    const movie = movies.find((movie) => movie.id === id);
    movie.watched = !movie.watched;
    this.setState({movies});

  }


  componentDidMount() {
    this.fetchPage(1).then((movies) => {
      movies.forEach(movie => movie.watched = false);
      this.setState({movies});
    });
  }
  
  render() {
      const totalMovies = this.state.movies.length;
      const seenMovies = this.state.movies.filter(movie => movie.watched).length;
      const percentage = Math.round((seenMovies / totalMovies) * 100);
      return (
        <div>
          <h1>{seenMovies} / {totalMovies} ... {percentage}% </h1>
          {this.state.movies.map((movie) => {
            return (
              <div onClick={() => this.toggleMovie(movie.id)} key={movie.id}>
                {movie.title} ({movie.release_date.slice(0,4)})
                {movie.watched ? ' WATCHED' : ''}
                <img src={`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} />
              </div>
            )
          })}
      </div>
      )
  }
}
