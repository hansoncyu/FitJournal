import { combineReducers } from 'redux';
import userReducer from './userReducer';
// import journalReducer from './journalReducer';
// import exerciseReducer from './exerciseReducer';
import workoutsReducer from './workoutsReducer';


export default combineReducers({
  user: userReducer,
  workouts: workoutsReducer
  // journalReducer,
  // exerciseReducer,
});
