import React, { Component } from 'react';
import { connect } from 'react-redux';
import { popupAction, selectElem, fetchJournal } from '../actions/journalActions';
import { fetchWorkouts } from '../actions/workoutsActions';
import { fetchExercises } from '../actions/exercisesActions';
import './css/JournalBody.css';

class JournalBody extends Component {

  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.selectSet = this.selectSet.bind(this);
  }

  componentDidMount() {
    if (!this.props.journalIsFetched){
      const date = this.props.date.toUTCString();
      this.props.dispatch(fetchJournal(date));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.journalIsFetched){
      const date = nextProps.date.toUTCString();
      this.props.dispatch(fetchJournal(date));
    }
  }

  showPopup(e) {
    e.preventDefault();
    this.props.dispatch(popupAction());
    switch (e.target.id) {
      case 'addLogWorkout':
        if (!this.props.journalID) {
          this.props.dispatch(selectElem(null, null));
        } else {
          this.props.dispatch(selectElem(this.props.journalID, null));
        }
        if (!this.props.workoutsIsFetched) {
          this.props.dispatch(fetchWorkouts());
          this.props.dispatch(fetchExercises());
        }
        break;
      default:
        break;
    }
  }

  selectSet(e) {
    e.preventDefault();
    const setID = e.target.parentElement.id;
    this.props.dispatch(selectElem(this.props.journalID, setID));
    this.props.dispatch(popupAction());
  }

  render() {
    if (this.props.journal === null) {
      return (
        <div id='journalBody'>
          <div id='logWorkout'>
            <a id='addLogWorkout' onClick={(e) => this.showPopup(e)}>
              Log Workout
              <i className="fa fa-plus" aria-hidden="true" />
            </a>
          </div>
          <h2>Journal is empty</h2>
        </div>
      )
    }

    let loggedExercises = null;
    loggedExercises = this.props.journal.exercises.map((result, index) => {
      return (
        <a id={result.id} onClick={(e) => this.selectSet(e)}>
          <h2>{result.exercise.exercise_name}</h2>
          <h3>{result.weight} lb {result.reps} reps</h3>
        </a>
      )
    })

    return (
      <div id='journalBody'>
        <div id='logWorkout'>
          <a id='addLogWorkout' onClick={(e) => this.showPopup(e)}>
            Log Workout
            <i className="fa fa-plus" aria-hidden="true" />
          </a>
        </div>
        <div id='loggedExercises'>
          {loggedExercises}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    journal: state.journal.journal,
    popupIsShowing: state.journal.popupIsShowing,
    date: state.journal.date,
    workoutsIsFetched: state.workouts.isFetched,
    workouts: state.workouts.workouts,
    journalIsFetched: state.journal.isFetched,
    journalID: state.journal.journalID,
    setID: state.journal.setID
  }
}

const journalBody = connect(mapStateToProps)(JournalBody);

export default journalBody;
