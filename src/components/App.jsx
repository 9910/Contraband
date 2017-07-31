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
					this.setState({searchedMovies: json.data.movies});
				});
		}
	}

	showMovies() {
		if(this.state.searchedMovies.length != 0) {
			return (
				this.state.searchedMovies.map(movie => {
					return (
						<div className="row" style={{padding: 20}}>
							<a href={'/movie/' + movie.id}>
							    <div className="col l4 s12">
							        <img className="movieCoverProfile" src={movie.large_cover_image} alt="Image is loading..." />
							    </div>
							    <div className="col l8 s12 white-text">
							        <h3 className="center-align">{movie.title}</h3>
							        <hr />
							        <p>Year: <span className="yellow-text text-accent-2">{movie.year}</span></p>
							        <p>Rating: <span className="yellow-text text-accent-2">{movie.rating}</span></p>
							        <p>Runtime: <span className="yellow-text text-accent-2">{movie.runtime}</span></p>
							        <p>Description: <span className="yellow-text text-accent-2">{movie.description_full}</span></p>
							    </div>
						    </a>
						</div>
					)
				})
			)
		} else {
			return <h3 className="center-align white-text">No Movies Searched</h3>
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
				<div className="container">
					{this.showMovies()}
				</div>
			</div>
		)
	}
}

export default App;