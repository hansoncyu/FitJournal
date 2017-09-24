import React, { Component } from 'react';
import { connect } from 'react-redux';
import JournalHeader from './JournalHeader.js';
import JournalBody from './JournalBody.js';
import JournalPopup from './JournalPopup.js';
import { dateChange } from '../actions/journalActions.js';
import './css/Journal.css';

class Journal extends Component {
  constructor(props) {
    super(props);
    this.dateHandler = this.dateHandler.bind(this);
  }

  dateHandler(e, change) {
    e.preventDefault();
    let copyDate = new Date(this.props.date.getTime());
    copyDate = copyDate.setDate(copyDate.getDate() + change);
    const newDate = new Date(copyDate);
    this.props.dispatch(dateChange(newDate));
  }

  render() {

    var journalPopup = null;
    if (this.props.popupIsShowing) {
      journalPopup = <JournalPopup />
    }

    if (!this.props.username) {
      return (
        <div id='journal'>
          <h1>Please log in</h1>
        </div>
      )
    }

    return (
      <div id='journal'>
        <JournalHeader date={this.props.date} handler={this.dateHandler} />
        <JournalBody />
        { journalPopup }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    date: state.journal.date,
    popupIsShowing: state.journal.popupIsShowing
  }
}

const journal = connect(mapStateToProps)(Journal);

export default journal;
