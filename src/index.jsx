import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import App from './components/App.jsx';
import Pagination from './components/Pagination.jsx';

ReactDOM.render(
    <Router>
    	<div>
	    	<Route exact={true} path="/" component={Pagination} />
	    	<Route path="/browse" component={App} />
    	</div>
    </Router>,
    document.getElementById('root')
);