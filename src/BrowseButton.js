import _omit from 'lodash/omit';
import React from 'react';
import PropTypes from 'proptypes';

class BrowseButton extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  componentWillUpdate() {

  }

  render() {
    return React.createElement('button', _omit(this.props, 'content'), this.props.content);
  }
}

BrowseButton.propTypes = {
  'content': PropTypes.string
};
