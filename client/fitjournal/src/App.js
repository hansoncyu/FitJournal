import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser, verifyToken, removeMessages } from './actions/userActions.js';
import './App.css';
import Home from './components/Home.js';
import NavBar from './components/NavBar.js';
import AuthNavBar from './components/AuthNavBar.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import Journal from './components/Journal.js';
import Workouts from './components/Workouts.js';

// TODO: make components

class App extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.context.router.history.push('/');
    this.props.dispatch(logoutUser());
  }


  componentWillMount() {
    // get token from local storage and verify if still valid
    if (!this.props.isTokenVerified) {
      this.props.dispatch(verifyToken());
    }
  }

  // change errorRegister and errorLogin on route change so error message will go away
  componentDidUpdate() {
    if (this.props.errorRegister || this.props.errorLogin || this.props.successRegister) {
      const unlisten = this.context.router.history.listen(() => {
        this.props.dispatch(removeMessages());
        unlisten();
      });
    }
  }


  render() {
    let navBar = null;
    if (this.props.username) {
      navBar = <AuthNavBar username={this.props.username} clickHandler={this.onClick}/>
    } else {
      navBar = <NavBar />
    }
    return (
      <div>
        <div>
          { navBar }
        </div>
        <Route exact path='/' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/journal' component={Journal} />
        <Route path='/workouts' component={Workouts} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    isTokenVerified: state.user.isTokenVerified,
    errorLogin: state.user.errorLogin,
    errorRegister: state.user.errorRegister,
    successRegister: state.user.successRegister
  }
}
const app = connect(mapStateToProps)(App);

App.contextTypes = {
  router: PropTypes.object
};

export default withRouter(app);
