import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removePopUp, deleteEntry, addRoutine, addDays, addExercise } from '../actions/workoutsActions.js';
import { fetchExercises, filterExercises } from '../actions/exercisesActions.js';
import $ from 'jquery';
import './css/WorkoutsPopup.css';


class WorkoutsPopup extends Component {
  constructor(props) {
    super(props);

    this.closeHandler = this.closeHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.addNewRoutine = this.addNewRoutine.bind(this);
    this.addToRoutine = this.addToRoutine.bind(this);
    this.addNewExercise = this.addNewExercise.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount() {
    if (!this.props.isFetched) {
      this.props.dispatch(fetchExercises());
    }
  }

  closeHandler(e) {
    e.preventDefault();
    this.props.dispatch(removePopUp());
  }

  deleteHandler(e) {
    e.preventDefault();
    const type = this.props.typeOfSelectedElem;
    const id = this.props.selectedID;
    const workoutID = this.props.workoutID;
    this.props.dispatch(deleteEntry(type, id, workoutID));
  }

  addNewRoutine(e) {
    e.preventDefault();
    const name = $('#workoutspopup #name').val();
    this.props.dispatch(addRoutine(name));
  }

  addToRoutine(e) {
    e.preventDefault();
    const days = getDaysFromCheckedBoxes();
    const id = this.props.selectedID;
    this.props.dispatch(addDays(days, id));
  }

  addNewExercise(e) {
    e.preventDefault();
    const exerciseID = e.target.id;
    const workoutID = this.props.selectedID;
    this.props.dispatch(addExercise(exerciseID, workoutID));
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

  render() {

    var deleteEntry = null;
    var addEntry = null;

    if (this.props.typeOfEdit === 'delete') {
      deleteEntry = (
        <div id='confirmDelete'>
          <a onClick={(e) => this.deleteHandler(e)}>
            Confirm delete
          </a>
        </div>
      );
    }

    if (this.props.typeOfEdit === 'add') {
      if (this.props.typeOfSelectedElem === 'newRoutine') {
        addEntry = (
          <div id='confirmAdd'>
            <form onSubmit={(e) => this.addNewRoutine(e)}>
              <label htmlFor='name'>Name of new routine:</label>
              <input type='text' id='name' />
              <input type='submit' value='Submit' />
            </form>
          </div>
        )
      } else if (this.props.typeOfSelectedElem === 'routine') {
        addEntry = (
          <div id='confirmAdd'>
            <form onSubmit={(e) => this.addToRoutine(e)}>
              <h3>Select the days for your new workout:</h3>
              <input type='checkbox' id='Sunday' value='Sun' />
              <label htmlFor='Sunday'>Sunday</label>
              <br />
              <input type='checkbox' id='Monday' value='Mon' />
              <label htmlFor='Monday'>Monday</label>
              <br />
              <input type='checkbox' id='Tuesday' value='Tues' />
              <label htmlFor='Tuesday'>Tuesday</label>
              <br />
              <input type='checkbox' id='Wednesday' value='Wed' />
              <label htmlFor='Wednesday'>Wednesday</label>
              <br />
              <input type='checkbox' id='Thursday' value='Thurs' />
              <label htmlFor='Thursday'>Thursday</label>
              <br />
              <input type='checkbox' id='Friday' value='Fri' />
              <label htmlFor='Friday'>Friday</label>
              <br />
              <input type='checkbox' id='Saturday' value='Sat' />
              <label htmlFor='Saturday'>Saturday</label>
              <br />
              <input type='submit' value='Submit' />
            </form>
          </div>
        )
      } else if (this.props.typeOfSelectedElem === 'workout') {
          var queryResults = null;
          if (this.props.exercises.length === 0) {
            queryResults = 'No Results Found';
          } else {
            queryResults = this.props.filteredExercises.map(function(result, index) {
                return (
                    <tr className='queryResultRow' key={index}>
                        <td className='queryResult'>
                            <a onClick={(e) => this.addNewExercise(e)} id={result.pk}>
                                {result.fields.exercise_name}
                            </a>
                        </td>
                    </tr>
                    );
            }, this);
          }

          addEntry = (
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

    return (
      <div id='workoutspopup'>
        <div id='popUpWrap'>
          <a id='closePopUp' onClick={(e) => this.closeHandler(e)}>
              <div id='closeIconWrap'>
                  <i className="fa fa-times" aria-hidden="true" id='closeIcon'/>
              </div>
          </a>
          {deleteEntry}
          {addEntry}
        </div>
      </div>
    )
  }
}

function getDaysFromCheckedBoxes() {
  var days = [];
  $('#confirmAdd form').children('input:checked').map(function() {
    days.push(this.value);
    return this.value;
  });
  return days;
}

const mapStateToProps = state => {
  return {
    typeOfSelectedElem: state.workouts.typeOfSelectedElem,
    typeOfEdit: state.workouts.typeOfEdit,
    selectedID: state.workouts.selectedID,
    isFetched: state.exercises.isFetched,
    exercises: state.exercises.exercises,
    workoutID: state.workouts.workoutID,
    filteredExercises: state.exercises.filteredExercises
  }
}

const workoutsPopup = connect(mapStateToProps)(WorkoutsPopup);

export default workoutsPopup;
