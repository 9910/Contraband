import React, {Component} from 'react';

class App extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			searchedMovies: []
		}
	}

	search(event) {
		const SEARCH_URL = 'https://yts.ag/api/v2/list_movies.json?query_term=';
		let query = event.target.value;

		if(query.length >= 4){
			fetch(SEARCH_URL + query, {method: 'GET'})
				.then(response => response.json())
				.then(json => {
					console.log('Searched Movies:', json);
					this.setState({searchedMovies: json.data.movies});
				});
		}
	}

	showMovies() {
		if(this.state.searchedMovies.length != 0) {
			console.log('Movies', this.state.searchedMovies);
			return (
				this.state.searchedMovies.map(movie => {
					return (
						<p key={movie.id}>Movie Title: {movie.title}</p>
					)
				})
			)
		} else {
			return <p>No Movies Searched</p>
		}
	}

	render() {
		return (
			<div>
				<div className="parallax-container valign-wrapper">
				    <div className="container">
				        <form>
				            <div className="input-field">
				                <input id="search" type="search" placeholder="Search Movies" onChange={event => {this.search(event)}} required />
				                <label className="label-icon" for="search"><i className="material-icons">search</i></label>
				                <i className="material-icons">close</i>
				            </div>
				        </form>
				    </div>
				    <div className="parallax">
				        <img src="/images/searchBackground.jpg" />
				    </div>
				</div>
				<div>
					{this.showMovies()}
				</div>
			</div>
		)
	}
}

export default App;