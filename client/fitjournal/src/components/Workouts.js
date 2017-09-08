import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWorkouts } from '../actions/workoutsActions.js';
import './css/Workouts.css';

class Workouts extends Component {
  componentDidMount() {
    this.props.dispatch(fetchWorkouts('All'));
  }

  render() {
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
          <h1>Create a new routine</h1>
        </div>
      )
    }

    return (
      <div id='workouts'>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    workouts: state.workouts.workouts
  }
}

const workouts = connect(mapStateToProps)(Workouts);

export default workouts;
