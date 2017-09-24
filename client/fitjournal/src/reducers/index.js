import { combineReducers } from 'redux';
import userReducer from './userReducer';
import exercisesReducer from './exercisesReducer';
import workoutsReducer from './workoutsReducer';
import journalReducer from './journalReducer';


export default combineReducers({
  user: userReducer,
  workouts: workoutsReducer,
  exercises: exercisesReducer,
  journal: journalReducer
});
