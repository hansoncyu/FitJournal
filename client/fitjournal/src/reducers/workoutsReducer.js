const initialWorkoutsState = {
  workouts: []
}

const workoutsReducer = (state=initialWorkoutsState, action) => {
  switch (action.type) {
    case 'FETCH_WORKOUTS':
      return {...state, workouts: action.payload}
  }
  return state;
}

export default workoutsReducer;
