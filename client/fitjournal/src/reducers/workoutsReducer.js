// const testWorkout1 = {'name': 'Strength Block',
//  'workouts': [
//    {'days': ['Sun', 'Wed'],
//  'exercises': [
//    {'exercise_name': 'Flat Bench Press', 'muscle_group': 'Chest', 'id': 34},
//     {'exercise_name': 'Deadlift', 'muscle_group': 'Back', 'id': 37}],
//      'id': 1},
//   {'days': ['Mon', 'Thurs'],
//  'exercises': [{'exercise_name': 'Squat', 'muscle_group': 'Legs', 'id': 35}, {'exercise_name': 'Deadlift', 'muscle_group': 'Back', 'id': 37}],
//   'id': 2}],
//  'id': 1}
//
//  const testWorkout2 = {'name': 'Volume Block',
//   'workouts': [
//     {'days': ['Sun', 'Wed'],
//   'exercises': [
//     {'exercise_name': 'Flat Bench Press', 'muscle_group': 'Chest', 'id': 34},
//      {'exercise_name': 'Deadlift', 'muscle_group': 'Back', 'id': 37}],
//       'id': 1},
//    {'days': ['Mon', 'Thurs'],
//   'exercises': [],
//    'id': 2}],
//   'id': 1}

const initialWorkoutsState = {
  workouts: [],
  selectedElem: null,
  typeOfSelectedElem: null,
  popupIsShowing: false,
  typeOfEdit: null,
  selectedID: null,
  isFetched: false,
  workoutID: null
}



const workoutsReducer = (state=initialWorkoutsState, action) => {
  switch (action.type) {
    case 'FETCH_WORKOUTS':
      return {...state, workouts: action.payload, isFetched: true};
    case 'SELECT_ELEM':
      return {...state, selectedElem: action.payload.name, typeOfSelectedElem: action.payload.type, selectedID: action.payload.id, workoutID: action.payload.workoutID};
    case 'SHOW_POPUP':
      return {...state, typeOfEdit: action.payload, popupIsShowing: true};
    case 'REMOVE_POPUP':
      return {...state, popupIsShowing: false};
    case 'DELETE_ENTRY':
      return {...state, workouts: action.payload, popupIsShowing: false, selectedElem: null};
    case 'NEW_ROUTINE':
      return {...state, workouts: action.payload, popupIsShowing: false, selectedElem: null};
  }
  return state;
}

export default workoutsReducer;
