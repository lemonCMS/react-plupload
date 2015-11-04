import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { PropTypes as historyPropTypes, Link } from 'react-router';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import bootstrapLink, {bootstrapSelectLink} from 'utils/bootstrapLink';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.authorized = this.authorized.bind(this);
    this.loginLink = this.loginLink.bind(this);
    this.logoutLink = this.logoutLink.bind(this);
    this.userDropDown = this.userDropDown.bind(this);
  }

  authorized() {
    if (_.get(this.props, 'authorization.loggedIn', false) === true) {
      return this.userDropDown();
    }

    return this.loginLink();
  }

  userDropDown() {
    const firstname = _.get(this.props, 'authorization.user.firstname', 'unknown');
    const title = <span><i className="fa fa-user"></i> {' '} {firstname}</span>;
    return (
      <NavDropdown eventKey={4} title={title} id="dropdown-usermenu">
        <MenuItem eventKey="4.1" {...bootstrapSelectLink(this.context.history, null, '/dashboard')}>Dashboard</MenuItem>
        <MenuItem eventKey="4.2" {...bootstrapSelectLink(this.context.history, null, '/admin')}>Admin</MenuItem>
        <MenuItem eventKey="4.3" onSelect={()=>{ console.log('clicked'); }}>Settings</MenuItem>
        <MenuItem divider/>
        <MenuItem eventKey="4.4" {...bootstrapSelectLink(this.context.history, null, '/logout')}>Uitloggen</MenuItem>
      </NavDropdown>
    );
  }

  loginLink() {
    return (
      <NavItem eventKey={1} {...bootstrapLink(this.context.history, null, '/login')}>
        <i className="fa fa-user"></i> <i className="fa fa-unlock"></i>
      </NavItem>
    );
  }

  logoutLink() {
    return (
      <NavItem eventKey={1} {...bootstrapLink(this.context.history, null, '/logout')}>
        <i className="fa fa-user"></i> <span>{_.get(this.props, 'authorization.user.name')}</span>
        {' '}
        <i className="fa fa-lock"></i>
      </NavItem>
    );
  }


  render() {
    const {history} = this.props;
    return (
      <div>
        <Helmet
          title="Site"
          titleTemplate="MySite.com - %s"
          link={[{'rel': 'stylesheet', 'href': 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.css', 'type': 'text/css', 'media': 'screen'}]}
          />
        <Navbar>
          <NavBrand>React-Bootstrap</NavBrand>
          <Nav bsStyle="tabs">
            <NavItem eventKey={2} {...bootstrapLink(history, null, '/')} title="Item">Home</NavItem>
            <NavItem eventKey={1} {...bootstrapLink(history, null, '/admin')}>Admin</NavItem>
            <NavItem eventKey={1} {...bootstrapLink(history, null, '/about')}>About</NavItem>
            <NavDropdown eventKey={4} title="Dropdown" id="nav-dropdown">
              <MenuItem eventKey="4.1">Action</MenuItem>
              <MenuItem eventKey="4.2">Another action</MenuItem>
              <MenuItem eventKey="4.3">Something else here</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey="4.4">Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav navbar right>
            {this.authorized()}
          </Nav>
        </Navbar>

        <div>
          <Link to="/login">Inloggen</Link>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  history: historyPropTypes.history,
  authorization: PropTypes.object.isRequired
};

App.contextTypes = {
  history: historyPropTypes.history
};

export default connect(state => ({
  authorization: state.authorization
}))(App);
