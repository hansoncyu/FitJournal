import React, { Component } from 'react';
import { registerUser } from '../actions/userActions.js';
import $ from 'jquery';
import { connect } from 'react-redux';
import './css/Register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const username = $('#register #username').val();
    const password = $('#register #password').val();
    this.props.dispatch(registerUser(username, password));
  }

  render() {
    let invalidReg = '';
    if (this.props.errorRegister) {
        invalidReg = (
            <p> Username already taken
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

    let successReg = '';
    if (this.props.successRegister) {
      successReg = (
        <p> Registration was successful. Please log in. </p>
      )
    }

    const login = () => (
        <div>
            <div id='formWrap'>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <label htmlFor='username'>Username:</label>
                    <input type='text' id='username' />
                    <label htmlFor='password'>Password:</label>
                    <input type='password' id='password' />
                    <input type='submit' value='Register' />
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
        <div id='register'>
        { display }
        { invalidReg }
        { successReg }
        </div>
        );
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    errorRegister: state.user.errorRegister,
    successRegister: state.user.successRegister
  }
}

const register = connect(mapStateToProps)(Register);

export default register;
