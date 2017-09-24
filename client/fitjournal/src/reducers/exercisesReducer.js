const initialExercisesState = {
  isFetched: false,
  exercises: [],
  filteredExercises: []
}

const exercisesReducer = (state=initialExercisesState, action) => {
  switch (action.type) {
    case 'FETCH_EXERCISES':
      return {...state, isFetched: true, exercises: action.payload, filteredExercises: action.payload}
    case 'FILTER_EXERCISES':
      return {...state, filteredExercises: action.payload}
  }
  return state;
}

export default exercisesReducer;
