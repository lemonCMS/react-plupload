import _ from 'lodash';
import React from 'react';

module.exports = React.createFactory(React.createClass({

  propTypes: {
    'content': React.PropTypes.string
  },

  shouldComponentUpdate() {
    return true;
  },

  render() {
    return React.createElement('button', _.omit(this.props, 'content'), this.props.content);
  }
}));
