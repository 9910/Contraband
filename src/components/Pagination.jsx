import React, {Component} from 'react';
import Pagination from 'react-js-pagination';

class PaginationMain extends Component {
	constructor() {
		super();
		this.state = {
			activePage: 1,
			numOfMovies: 80,
			movies: []
		};
	}

	componentWillMount() {
		const BASE_URL = 'https://yts.ag/api/v2/list_movies.json?limit=8&page=';

		fetch(BASE_URL + 1, {method: 'GET'})
			.then(response => response.json())
			.then(json => {
				this.setState({
					movies: json.data.movies, 
					numOfMovies: json.data.movie_count
				});
			});
	}

	handleSelect(pageNumber) {
		const BASE_URL = 'https://yts.ag/api/v2/list_movies.json?limit=8&page=';

		fetch(BASE_URL + pageNumber, {method: 'GET'})
			.then(response => response.json())
			.then(json => {
				this.setState({movies: json.data.movies});
			});
		this.setState({activePage: pageNumber});
	}

	showMovies() {
		return (
			<div>
				<div className="row">
					{
						this.state.movies.slice(0, 4).map(movie => {
							return (
								<div key={movie.id} className="col l3 s6">
								    <div className="card">
								        <div className="card-image">
								            <a href={'/movie/' + movie.id}>
								                <img className="movieCover responsive-img" src={movie.medium_cover_image} />
								            </a>
								        </div>
								    </div>
								    <h5 className="flow-text">{movie.title}</h5>
								</div>
							)
						})
					}
				</div>
				<div className="row">
					{
						this.state.movies.slice(4, 8).map(movie => {
							return (
								<div key={movie.id} className="col l3 s6">
								    <div className="card">
								        <div className="card-image">
								            <a href={'/movie/' + movie.id}>
								                <img className="movieCover responsive-img" src={movie.medium_cover_image} />
								            </a>
								        </div>
								    </div>
								    <h5 className="flow-text">{movie.title}</h5>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}

	render() {
		return (
			<div>
				{this.showMovies()}
				<Pagination
				  activePage={this.state.activePage}
		          itemsCountPerPage={8}
		          totalItemsCount={this.state.numOfMovies}
		          pageRangeDisplayed={5}
		          onChange={pageNumber => this.handleSelect(pageNumber)}
				/>
			</div>
		)
	}
}

export default PaginationMain;