import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './css/AuthNavBar.css';

class AuthNavBar extends Component {

  render() {
    return(
      <div id='authnavbar'>
        <Navbar inverse collapseOnSelect fixedTop fluid>
          <Navbar.Header>
            <div id='logo' className='navbar-brand'>
              <Link to='/'>FitJournal</Link>
            </div>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <li>
                <Link to='/journal'>Journal</Link>
              </li>
              <li>
                <Link to='/workouts'>Workouts</Link>
              </li>
              <li>
                <a onClick={(e) => this.props.clickHandler(e)}>
                Logout
                </a>
              </li>
            </Nav>
            <Navbar.Text pullRight id='username'>
              {this.props.username}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default AuthNavBar;
