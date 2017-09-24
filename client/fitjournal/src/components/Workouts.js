import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWorkouts, selectElem, popUpAction } from '../actions/workoutsActions.js';
import WorkoutsPopup from './WorkoutsPopup.js';
import './css/Workouts.css';

class Workouts extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.showPopUp = this.showPopUp.bind(this);
    this.routineShowPopUp = this.routineShowPopUp.bind(this);
  }

  componentDidMount() {
    if (!this.props.isFetched) {
      this.props.dispatch(fetchWorkouts());
    }
  }

  componentWillReceiveProps() {
    if (!this.props.isFetched) {
      this.props.dispatch(fetchWorkouts());
    }
  }

  onClick(e) {
    e.preventDefault();
    const name = e.target.textContent;
    var id = e.target.parentElement.id;
    var type = e.target.parentElement.className;
    var workoutID = null;
    switch (type) {
      case 'workoutName':
        type = 'routine';
        break;
      case 'exercises':
        type = 'exercise';
        workoutID = e.target.parentElement.parentElement.firstChild.id;
        break;
      case 'days':
        type = 'workout';
        break;
    }
    this.props.dispatch(selectElem(name, type, id, workoutID));
  }

  showPopUp(e) {
    e.preventDefault();
    const typeOfEdit = e.target.parentElement.className;
    this.props.dispatch(popUpAction(typeOfEdit));
  }

  routineShowPopUp(e) {
    e.preventDefault();
    const type = 'newRoutine';
    this.props.dispatch(selectElem(null, type, null));
    this.props.dispatch(popUpAction('add'));
  }

  render() {
    var workoutPopup = null;
    if (this.props.popupIsShowing) {
      workoutPopup = <WorkoutsPopup />
    }

    if (!this.props.username) {
      return (
        <div id='workouts'>
          <h1>Please log in</h1>
        </div>
      )
    }
    if (this.props.workouts.length === 0) {
      return (
        <div id='workouts'>
          <div id='addWorkout'>
            <a onClick={(e) => this.routineShowPopUp(e)}>
              <h1>
                Create a new routine
                <i className="fa fa-plus" aria-hidden="true" />
                </h1>
            </a>
          </div>
          {workoutPopup}
        </div>
      )
    }
    var editWorkouts = null;
    if (this.props.selectedElem) {
      let addOrDelete = null;
      if (this.props.typeOfSelectedElem === 'exercise') {
        addOrDelete = (
          <div className='addOrDelete'>
            <div className='delete'>
              <a onClick={(e) => this.showPopUp(e)}>
                Delete {this.props.selectedElem}
                <i className="fa fa-trash-o" aria-hidden="true" />
              </a>
            </div>
          </div>
        )
      } else {
        addOrDelete = (
          <div className='addOrDelete'>
            <div className='add'>
              <a onClick={(e) => this.showPopUp(e)}>
                Add to {this.props.selectedElem}
                <i className="fa fa-plus" aria-hidden="true" />
              </a>
            </div>
            <div className='delete'>
              <a onClick={(e) => this.showPopUp(e)}>
                Delete {this.props.selectedElem}
                <i className="fa fa-trash-o" aria-hidden="true" />
              </a>
            </div>

          </div>
        )
      }
      editWorkouts = (
        <div className='editWorkouts'>
          {addOrDelete}
        </div>
      )
    }

    const workouts = this.props.workouts.map((result, index) => {
      const days = result.workouts.map((result, index) => {
        var date = '';
        for (var i=0; i < result.days.length; i++) {
          date += result.days[i] + ' ';
        }
        const exercises = result.exercises.map((result, index) => {
          return (
            <div className='exercises' key={index} id={result.id}>
              <a onClick={(e) => this.onClick(e)}>
              { result.exercise_name }
              </a>
            </div>
          )
        })
        return (
          <div className='daysBlock'>
            <div className='days' key={index} id={result.id}>
              <a onClick={(e) => this.onClick(e)}>
              {date}
              </a>
            </div>
            { exercises }
          </div>
        )
      });

      return (
        <div className='workoutEntry' key={index} >
          <div className='workoutName' id={result.id}>
            <a onClick={(e) => this.onClick(e)}>
            {result.name}
            </a>
          </div>
          { days }
        </div>
      );
    });



    return (
      <div id='workouts'>
        <div id='addWorkout'>
          <a onClick={(e) => this.routineShowPopUp(e)}>
            <h1>
              Create a new routine
              <i className="fa fa-plus" aria-hidden="true" />
              </h1>
          </a>
        </div>
        {editWorkouts}
        {workouts}
        {workoutPopup}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    workouts: state.workouts.workouts,
    selectedElem: state.workouts.selectedElem,
    typeOfSelectedElem: state.workouts.typeOfSelectedElem,
    popupIsShowing: state.workouts.popupIsShowing,
    isFetched: state.workouts.isFetched,
    workoutID: state.workouts.workoutID
  }
}

const workouts = connect(mapStateToProps)(Workouts);

export default workouts;
