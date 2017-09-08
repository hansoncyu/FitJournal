import store from '../store.js';

const testServerURL = 'http://localhost:8000';
var token;
store.subscribe(() => token = 'JWT ' + store.getState().user.token);

export function fetchWorkouts(routine) {
  return dispatch => {
    const workoutsURL = testServerURL + '/api/routine' + '?name=' + routine;
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
    fetch(workoutsURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'FETCH_WORKOUTS', payload: res});
      })
      .catch(err => {
        console.log(err);
      })
  }
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}
