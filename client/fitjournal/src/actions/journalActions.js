import store from '../store.js';

const testServerURL = 'http://localhost:8000';
var token;
store.subscribe(() => token = 'JWT ' + store.getState().user.token);

export function fetchJournal(date) {
  return dispatch => {
    const fetchURL = testServerURL + '/api/journal?date=' + date;
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
    fetch(fetchURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        console.log(res);
        dispatch({type: 'NEW_JOURNAL', payload: res});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: 'ERROR_JOURNAL'})
      });
  }
}

export function dateChange(date) {
  return dispatch => {
    dispatch({type:'CHANGE_DATE', payload: {date: date}});
  }
}

export function popupAction() {
  return dispatch => {
    dispatch({type:'JOURNAL_POPUP'});
  }
}

export function removeJournalPopup() {
  return dispatch => {
    dispatch({type:'REMOVE_JOURNAL_POPUP'});
  }
}

export function selectElem(journalID, setID) {
  return dispatch => {
    dispatch({type: 'JOURNAL_SELECT_ELEM', payload:{journalID: journalID, setID: setID}});
  }
}


export function toWorkouts() {
  return dispatch => {
    dispatch({type: 'TO_WORKOUTS'});
  }
}

export function toAllExercises() {
  return dispatch => {
    dispatch({type: 'TO_ALL_EXERCISES'});
  }
}

export function newExerciseToJournal(date, journalID, exerciseID) {
  return dispatch => {
    var data;
    if (journalID) {
      data = {
        date: date,
        journal_id: journalID,
        exercise_id: exerciseID
      }
    } else {
      data = {
        date: date,
        exercise_id: exerciseID
      }
    }
    const addURL = testServerURL + '/api/journal';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify(data)
    }
    fetch(addURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_JOURNAL', payload: res});
        dispatch({type: 'REMOVE_JOURNAL_POPUP'});
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export function deleteSet(journalID, setID) {
  return dispatch => {
    const deleteURL = testServerURL + '/api/journal';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "DELETE",
      credentials: 'same-origin',
      body: JSON.stringify({journal_id: journalID, set_id: setID})
    }
    fetch(deleteURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_JOURNAL', payload: res});
        dispatch({type: 'REMOVE_JOURNAL_POPUP'});
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export function postSet(weight, reps, setID, journalID) {
  return dispatch => {
    const postURL = testServerURL + '/api/journal';
    const payload = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': token
      },
      method: "POST",
      credentials: 'same-origin',
      body: JSON.stringify({weight: weight, reps: reps, set_id: setID, journal_id: journalID})
    }
    fetch(postURL, payload)
      .then(res => handleErrors(res))
      .then(res => {
        dispatch({type: 'NEW_JOURNAL', payload: res});
        dispatch({type: 'REMOVE_JOURNAL_POPUP'});
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
