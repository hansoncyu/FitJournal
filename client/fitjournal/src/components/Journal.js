import React, { Component } from 'react';
import { connect } from 'react-redux';
import './css/Journal.css';

class Journal extends Component {
  render() {
    if (!this.props.username) {
      return (
        <div id='journal'>
          <h1>Please log in</h1>
        </div>
      )
    }

    return (
      <div id='journal'>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username
  }
}

const journal = connect(mapStateToProps)(Journal);

export default journal;
