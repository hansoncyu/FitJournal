import store from '../store.js';

const testServerURL = 'http://localhost:8000';
var token;
store.subscribe(() => token = 'JWT ' + store.getState().user.token);

export function fetchExercises() {
  return dispatch => {
    const exercisesURL = testServerURL + '/api/exercises?muscle_group=All';
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
    fetch(exercisesURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'FETCH_EXERCISES', payload: res});
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export function filterExercises(filteredList) {
  return dispatch => {
    dispatch({type: 'FILTER_EXERCISES', payload: filteredList});
  }
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}
