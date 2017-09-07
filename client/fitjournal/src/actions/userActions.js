import $ from 'jquery';
import store from '../store.js';

const testServerURL = 'http://localhost:8000';
var token;
store.subscribe(() => token = 'JWT ' + store.getState().user.token);


export function fetchToken(username, password, router) {
  return function(dispatch){
    let loginURL = testServerURL + '/api/token-auth';
    if (!username || !password) {
      dispatch({type:'LOGIN_ERROR'});
    }
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({username: username, password: password})
    }
    fetch(loginURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        localStorage.setItem('fitjournalToken', res.token);
        localStorage.setItem('fitjournalUsername', username);
        router.push('/journal')
        dispatch({type:'SET_USER', payload: {username: username, token: res.token}});
      })
      .catch(err => {
        dispatch({type:'LOGIN_ERROR'});
      });
  }
}

export function registerUser(username, password) {
  return function(dispatch) {
    const registerURL = 'http://localhost:8000/api/register';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: "PUT",
      credentials: 'same-origin',
      body: JSON.stringify({username: username, password: password})
    }
    fetch(registerURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'REGISTER_USER'});
      })
      .catch(err => {
        dispatch({type: 'REGISTER_ERROR'});
      })
  }
}

export function logoutUser() {
  return function(dispatch) {
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "GET",
      credentials: 'same-origin'
    }
    const logoutURL = testServerURL + '/api/logout';
    fetch(logoutURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        localStorage.setItem('fitjournalToken', null);
        localStorage.setItem('fitjournalUsername', null);
        dispatch({type:'LOGOUT_USER'});
      })
      .catch(err => {
        dispatch({type:'LOGOUT_ERROR'});
      });
  }
}

export function verifyToken() {
  return function(dispatch) {
    const token = localStorage.getItem('fitjournalToken');
    const username = localStorage.getItem('fitjournalUsername');
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({token: token})
    }
    const verifyTokenURL = testServerURL + '/api/token-verify';
    fetch(verifyTokenURL, payload)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        dispatch({type: 'VERIFY_TOKEN', payload: {username: username, token: token}});
      })
      .catch(err => {
        localStorage.setItem('fitjournalToken', null);
        localStorage.setItem('fitjournalUsername', null);
        dispatch({type: 'VERIFY_TOKEN_ERROR'})
      })
  }
}

export function removeMessages() {
  return dispatch => dispatch({type: 'REMOVE_MESSAGES'});
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}
