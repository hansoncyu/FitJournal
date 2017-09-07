import React, { Component } from 'react';
import './css/Home.css';

class Home extends Component {
  render() {
    return (
      <div id='home'>
        <div id='bgWrap'>
          <div id='bgText'>
            <h1>Welcome to FitJournal</h1>
            <h2>Record your training with this simple app</h2>
          </div>
        </div>
        <h3>
          FitJournal lets you log your gym workouts.
          Get started now by signing up for an account.
        </h3>
      </div>
    )
  }
}

export default Home;
