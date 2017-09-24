const initialJournalState = {
  isFetched: false,
  date: new Date(),
  journal: null,
  popupIsShowing: false,
  journalID: null,
  setID: null,
  searchAllExercises: false
}

const journalReducer = (state=initialJournalState, action) => {
  switch (action.type) {
    case 'CHANGE_DATE':
      return {...state, date: action.payload.date, isFetched: false, setID: null}
    case 'JOURNAL_POPUP':
      return {...state, popupIsShowing: true}
    case 'REMOVE_JOURNAL_POPUP':
      return {...state, popupIsShowing: false}
    case 'JOURNAL_SELECT_ELEM':
      return {...state, journalID: action.payload.journalID, setID: action.payload.setID}
    case 'TO_WORKOUTS':
      return {...state, searchAllExercises: false}
    case 'TO_ALL_EXERCISES':
      return {...state, searchAllExercises: true}
    case 'NEW_JOURNAL':
      return {...state, journal: action.payload, journalID: action.payload.id, isFetched: true}
    case 'ERROR_JOURNAL':
      return {...state, journal: null, journalID: null, isFetched: true}
  }
  return state;
}

export default journalReducer;
