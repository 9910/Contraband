import React, {Component} from 'react';
import {connect} from 'react-redux';
//import {addReminder, deleteReminder, clearReminders} from '../actions';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div>
                <p>Works!!!!!!!!!!!!!!!!!!!!!</p>
            </div>
        )
    }
}
//mapStateToProps - allows reducers in the redux store to become accessible within React Components through this.props.
// function mapStateToProps(state) {
//     return {
//         reminders: state
//     }
// }
//                         /*Reducers*/                 /*Actions*/
// export default connect(mapStateToProps, {addReminder, deleteReminder, clearReminders})(App);
//mapDispatchToProps  allows reducers in the redux store to become accessible within React Components through this.props.