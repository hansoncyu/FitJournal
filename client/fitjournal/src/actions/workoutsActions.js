import store from '../store.js';

const testServerURL = 'http://FitJournal-dev.us-east-1.elasticbeanstalk.com';
var token;
store.subscribe(() => token = 'JWT ' + store.getState().user.token);

export function fetchWorkouts() {
  return dispatch => {
    const workoutsURL = testServerURL + '/api/routine';
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

export function selectElem(name, type, id, workoutID) {
  return dispatch => {
    dispatch({type: 'SELECT_ELEM', payload: { name: name, type: type, id: id, workoutID: workoutID }})
  }
}

export function popUpAction(type) {
  return dispatch => {
    dispatch({type: 'SHOW_POPUP', payload: type});
  }
}

export function removePopUp() {
  return dispatch => {
    dispatch({type: 'REMOVE_POPUP'});
  }
}

export function deleteEntry(type, id, workoutID) {
  return dispatch => {
    const deleteURL = testServerURL + '/api/routine';
    let data = null;
    switch (type) {
      case 'routine':
        data = {routine_id: id}
        break;
      case 'workout':
        data = {workout_id: id}
        break;
      case 'exercise':
        data = {exercise_id: id, workout_id: workoutID}
        break;
    }
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "DELETE",
      credentials: 'same-origin',
      body: JSON.stringify(data)
    }
    fetch(deleteURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'DELETE_ENTRY', payload: res})
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export function addRoutine(name) {
  return dispatch => {
    const addURL = testServerURL + '/api/routine';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({name: name})
    }
    fetch(addURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_ROUTINE', payload: res})
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export function addDays(days, id) {
  return dispatch => {
    const addURL = testServerURL + '/api/routine';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({routine_id: id, days: days})
    }
    fetch(addURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_ROUTINE', payload: res})
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export function addExercise(exerciseID, workoutID) {
  return dispatch => {
    const addURL = testServerURL + '/api/routine';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({workout_id: workoutID, exercise_id: exerciseID})
    }
    fetch(addURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_ROUTINE', payload: res})
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}
