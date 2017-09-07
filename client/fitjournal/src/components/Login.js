import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchToken } from '../actions/userActions.js';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const username = $('#login #username').val();
    const password = $('#login #password').val();
    this.props.dispatch(fetchToken(username, password, this.context.router.history));
  }

  render() {
    let invalidAuth = '';
    if (this.props.errorLogin) {
        invalidAuth = (
            <p> Invalid username/password
            </p>
            );
    }
    const isLoggedIn = () => (
        <div>
            <h1>
                You are signed in as { this.props.username }
            </h1>
        </div>
        );


    const login = () => (
        <div>
            <div id='formWrap'>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <label htmlFor='username'>Username:</label>
                    <input type='text' id='username' />
                    <label htmlFor='password'>Password:</label>
                    <input type='password' id='password' />
                    <input type='submit' value='Log In' />
                </form>
            </div>
        </div>
        );

    let display = null;
    if (this.props.username) {
        display = isLoggedIn();
        } else {
        display = login();
        }
    return (
        <div id='login'>
        { display }
        { invalidAuth }
        </div>
        );
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    errorLogin: state.user.errorLogin
  }
}

const login = connect(mapStateToProps)(Login);

Login.contextTypes = {
  router: PropTypes.object
};

export default login;
