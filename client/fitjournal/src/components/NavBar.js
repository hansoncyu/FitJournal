import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './css/NavBar.css';

class NavBar extends Component {
  render() {
    return(
      <div id='navbar'>
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
                <Link to='/login'>Login</Link>
              </li>
              <li>
                <Link to='/register'>Register</Link>
              </li>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavBar;
