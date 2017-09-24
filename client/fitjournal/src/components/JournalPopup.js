import React, { Component } from 'react';
import { removeJournalPopup, toWorkouts, toAllExercises, newExerciseToJournal, deleteSet, postSet } from '../actions/journalActions.js';
import { connect } from 'react-redux';
import { filterExercises } from '../actions/exercisesActions.js';
import $ from 'jquery';
import './css/JournalPopup.css';

class JournalPopup extends Component {
  constructor(props) {
    super(props);
    this.closeHandler = this.closeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.switchHandler = this.switchHandler.bind(this);
    this.newExercise = this.newExercise.bind(this);
    this.deleteSet = this.deleteSet.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.setHandler = this.setHandler.bind(this);
  }


  closeHandler(e) {
    e.preventDefault();
    this.props.dispatch(removeJournalPopup());
    this.props.dispatch(toWorkouts());
  }

  submitHandler(e) {
    e.preventDefault();
    const search = $('#searchQuery').val();
    const regex = new RegExp(search, "gi")
    var filteredList = Object.assign([], this.props.exercises);
    filteredList = filteredList.filter((exercise) => {
      return exercise.fields.exercise_name.match(regex) != null;
    });
    this.props.dispatch(filterExercises(filteredList));
  }

  switchHandler(e) {
    e.preventDefault();
    if (e.target.parentElement.id === 'toWorkouts') {
      this.props.dispatch(toWorkouts());
    } else {
      this.props.dispatch(toAllExercises());
    }
  }

  newExercise(e) {
    e.preventDefault();
    const date = this.props.date.toUTCString();
    const exerciseID = e.target.id;
    const journalID = this.props.journalID;
    this.props.dispatch(newExerciseToJournal(date, journalID, exerciseID));
  }

  deleteSet(e) {
    e.preventDefault();
    const journalID = this.props.journalID;
    const setID = this.props.setID;
    this.props.dispatch(deleteSet(journalID, setID));
  }

  changeValue(e, change) {
    e.preventDefault();
    if (e.target.parentElement.parentElement.id === 'editWeight') {
      change *= 5;
    }
    var curValue = e.target.parentElement.parentElement.children[2].value;
    if (!curValue) {
      curValue = 0;
    }
    curValue = parseFloat(curValue);
    const newValue = curValue + change;
    e.target.parentElement.parentElement.children[2].value = newValue;
  }

  setHandler(e) {
    e.preventDefault();
    var weightVal = $('#weightValue').val() ? $('#weightValue').val() : '0';
    var repsVal = $('#repsValue').val() ? $('#repsValue').val() : '0';
    this.props.dispatch(postSet(weightVal, repsVal, this.props.setID, this.props.journalID));
  }

  render() {
    let addExercise = null;
    let workouts = null;
    let searchExercises = null;
    let footer = null;
    let userWorkouts = null;
    let editSets= null;
    let addDeleteSet = null;
    if (!this.props.setID) {
      addExercise = (
        <div id='addExercise'>
          <h2>Add an exercise</h2>
        </div>
      )
      if (!this.props.searchAllExercises) {
        workouts = this.props.workouts.map((result, index) => {
          const days = result.workouts.map((result, index) => {
            var date = '';
            for (var i=0; i < result.days.length; i++) {
              date += result.days[i] + ' ';
            }
            const exercises = result.exercises.map((result, index) => {
              return (
                <div className='exercises' key={index}>
                  <a onClick={(e) => this.newExercise(e)} id={result.id}>
                  { result.exercise_name }
                  </a>
                </div>
              )
            });
            return (
              <div className='daysBlock'>
                <div className='days' key={index} id={result.id}>
                  {date}
                </div>
                { exercises }
              </div>
            )
          });
          return (
            <div className='workoutEntry' key={index} >
              <div className='workoutName' id={result.id}>
                {result.name}
              </div>
              { days }
            </div>
          );
        });
        userWorkouts = (
          <div id='userWorkouts'>
            {workouts}
          </div>
        )
      } else {
        var queryResults = null;
        if (this.props.exercises.length === 0) {
          queryResults = 'No Results Found';
        } else {
          queryResults = this.props.filteredExercises.map(function(result, index) {
              return (
                  <tr className='queryResultRow' key={index}>
                      <td className='queryResult'>
                          <a onClick={(e) => this.newExercise(e)} id={result.pk}>
                              {result.fields.exercise_name}
                          </a>
                      </td>
                  </tr>
                  );
          }, this);
        }
        searchExercises = (
          <div id='searchExercises'>
            <form id="search-form_3" onSubmit={(e) => this.submitHandler(e)}>
                <input type="text" className="search_3" id='searchQuery' />
                <a className="submit_3" onClick={(e) => this.submitHandler(e)}>
                    <i className="fa fa-search" aria-hidden="true" />
                </a>
            </form>
            <div id='searchTableWrap'>
                <table>
                    <tbody>
                        { queryResults }
                    </tbody>
                </table>
            </div>
          </div>
        )
      }
    }
    if (!this.props.setID) {
      if (this.props.searchAllExercises) {
        footer = (
          <a id='toWorkouts' onClick={(e) => this.switchHandler(e)}>
            <h2>Search your workouts</h2>
          </a>
        )
      } else {
        footer = (
          <a id='toAllExercises' onClick={(e) => this.switchHandler(e)}>
            <h2>Search all exercises</h2>
          </a>
        )
      }
    }

    if (this.props.setID) {
      addDeleteSet = (
        <div id='addDeleteSet'>
          <div id='editSetWrap'>
            <form onSubmit={(e) => this.setHandler(e)}>
              <div id='editWeight'>
                <h2>Weight</h2>
                <a onClick={(e) => this.changeValue(e, -1)}>
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </a>
                <input type='text' placeholder='0' id='weightValue'/>
                lbs
                <a onClick={(e) => this.changeValue(e, 1)}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </a>
              </div>
              <div id='editReps'>
                <h2>Reps</h2>
                <a onClick={(e) => this.changeValue(e, -1)}>
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </a>
                <input type='text' placeholder='0' id='repsValue' />
                reps
                <a onClick={(e) => this.changeValue(e, 1)}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </a>
              </div>
              <input type='submit' value='Update' />
            </form>
          </div>
          <a onClick={(e) => this.deleteSet(e)}>
            Delete Set
            <i className="fa fa-trash-o" aria-hidden="true" />
          </a>
        </div>
      )
    }

    return (
      <div id='journalpopup'>
        <div id='popUpWrap'>
          <a id='closePopUp' onClick={(e) => this.closeHandler(e)}>
              <div id='closeIconWrap'>
                  <i className="fa fa-times" aria-hidden="true" id='closeIcon'/>
              </div>
          </a>
          {addExercise}
          {userWorkouts}
          {searchExercises}
          {addDeleteSet}
          <div id='journalFooter'>
            {footer}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    exercises: state.exercises.exercises,
    filteredExercises: state.exercises.filteredExercises,
    workouts: state.workouts.workouts,
    journalID: state.journal.journalID,
    setID: state.journal.setID,
    searchAllExercises: state.journal.searchAllExercises,
    date: state.journal.date
  }
}

const journalPopup = connect(mapStateToProps)(JournalPopup);
export default journalPopup;
