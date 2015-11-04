'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

module.exports = _react2['default'].createFactory(_react2['default'].createClass({

  propTypes: {
    'content': _react2['default'].PropTypes.string
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return false;
  },
  componentWillUpdate: function componentWillUpdate() {},
  render: function render() {
    return _react2['default'].createElement('button', _lodash2['default'].omit(this.props, 'content'), this.props.content);
  }
}));