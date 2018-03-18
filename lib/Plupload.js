'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _BrowseButton = require('./BrowseButton');

var _BrowseButton2 = _interopRequireDefault(_BrowseButton);

var _UploadButton = require('./UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var count = 0;
var EVENTS = ['PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged', 'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded', 'UploadComplete', 'Destroy', 'Error'];

var Plupload = function (_React$Component) {
  _inherits(Plupload, _React$Component);

  function Plupload() {
    _classCallCheck(this, Plupload);

    var _this = _possibleConstructorReturn(this, (Plupload.__proto__ || Object.getPrototypeOf(Plupload)).call(this));

    _this.id = new Date().valueOf();
    _this.state = { files: [], uploadState: false, progress: {} };
    _this.runUploader = _this.runUploader.bind(_this);
    _this.getComponentId = _this.getComponentId.bind(_this);
    _this.refresh = _this.refresh.bind(_this);
    _this.initUploader = _this.initUploader.bind(_this);
    _this.list = _this.list.bind(_this);
    _this.clearAllFiles = _this.clearAllFiles.bind(_this);
    _this.clearFailedFiles = _this.clearFailedFiles.bind(_this);
    _this.removeFile = _this.removeFile.bind(_this);
    _this.doUpload = _this.doUpload.bind(_this);
    _this.container = null;
    return _this;
  }

  _createClass(Plupload, [{
    key: 'checkUploader',
    value: function checkUploader() {
      return window.plupload !== undefined;
    }
  }, {
    key: 'runUploader',
    value: function runUploader() {
      var self = this;
      this.initUploader();
      this.uploader.init();

      EVENTS.forEach(function (event) {
        var handler = self.props['on' + event];
        if (typeof handler === 'function') {
          self.uploader.bind(event, handler);
        }
      });

      // Put the selected files into the current state
      this.uploader.bind('FilesAdded', function (up, files) {
        if (_lodash2.default.get(self.props, 'multi_selection') === false) {
          self.clearAllFiles();
        } else {
          self.clearFailedFiles();
        }

        var f = self.state.files;
        _lodash2.default.map(files, function (file) {
          f.push(file);
        });
        self.setState({ files: f }, function () {
          if (self.props.autoUpload === true) {
            self.uploader.start();
          }
        });
      });

      this.uploader.bind('FilesRemoved', function (up, rmFiles) {
        var stateFiles = self.state.files;
        var files = _lodash2.default.filter(stateFiles, function (file) {
          // console.log(rmFiles, file);
          return -1 !== _lodash2.default.find(rmFiles, { id: file.id });
        });
        self.setState({ files: files });
      });

      this.uploader.bind('StateChanged', function (up) {
        if (up.state === window.plupload.STARTED && self.state.uploadState === false) {
          self.setState({ uploadState: true });
        }
        if (up.state !== window.plupload.STARTED && self.state.uploadState === true) {
          self.setState({ uploadState: false });
        }
      });

      this.uploader.bind('FileUploaded', function (up, file) {
        var stateFiles = self.state.files;
        _lodash2.default.map(stateFiles, function (val, key) {
          if (val.id === file.id) {
            val.uploaded = true;
            stateFiles[key] = val;
          }
        });
        self.setState({ files: stateFiles }, function () {
          self.removeFile(file.id);
        });
      });

      this.uploader.bind('Error', function (up, err) {
        if (_lodash2.default.isUndefined(err.file) !== true) {
          var stateFiles = self.state.files;
          _lodash2.default.map(stateFiles, function (val, key) {
            if (val.id === err.file.id) {
              val.error = err;
              stateFiles[key] = val;
            }
          });
          self.setState({ files: stateFiles });
        }
      });

      this.uploader.bind('UploadProgress', function (up, file) {
        var stateProgress = self.state.progress;
        stateProgress[file.id] = file.percent;
        self.setState({ progress: stateProgress });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      if (this.checkUploader()) {
        this.runUploader();
      } else {
        setTimeout(function () {
          if (self.checkUploader()) {
            self.runUploader();
          } else {
            console.warn('Plupload has not initialized');
          }
        }, 500);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.checkUploader()) {
        this.refresh();
      }
    }
  }, {
    key: 'getComponentId',
    value: function getComponentId() {
      return this.props.id || 'react_plupload_' + this.id;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      // Refresh to append events to buttons again.
      this.uploader.refresh();
    }
  }, {
    key: 'initUploader',
    value: function initUploader() {
      this.uploader = new window.plupload.Uploader(_lodash2.default.extend({
        container: this.ref,
        runtimes: 'html5',
        multipart: true,
        chunk_size: '1mb',
        browse_button: this.getComponentId(),
        url: '/upload'
      }, this.props));
    }

    // Display selected files

  }, {
    key: 'list',
    value: function list() {
      var self = this;
      return _lodash2.default.map(this.state.files, function (val) {

        var removeFile = function removeFile(e) {
          e.preventDefault();
          self.removeFile(val.id);
        };
        var delButton = '';
        if (self.state.uploadState === false && val.uploaded !== true) {
          delButton = _react2.default.createElement('button', { onClick: removeFile, className: 'pull-right' }, 'X');
        }

        var progressBar = '';
        if (self.state.uploadState === true && val.uploaded !== true && _lodash2.default.isUndefined(val.error)) {
          var percent = self.state.progress[val.id] || 0;
          progressBar = _react2.default.createElement('div', { className: 'progress' }, _react2.default.createElement('div', {
            className: 'progress-bar',
            role: 'progressbar',
            'aria-valuenow': percent,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            style: { width: percent + '%' }
          }, _react2.default.createElement('span', { className: 'sr-only' }, percent + 'complete')));
        }

        var errorDiv = '';
        if (!_lodash2.default.isUndefined(val.error)) {
          errorDiv = _react2.default.createElement('div', { className: 'alert alert-danger' }, 'Error: ' + val.error.code + ', Message: ' + val.error.message);
        }

        var bgSuccess = '';
        if (!_lodash2.default.isUndefined(val.uploaded)) {
          bgSuccess = 'bg-success';
        }

        return _react2.default.createElement('li', { key: val.id }, _react2.default.createElement('p', { className: bgSuccess }, val.name, ' ', delButton), progressBar, errorDiv);
      });
    }
  }, {
    key: 'clearAllFiles',
    value: function clearAllFiles() {
      var _this2 = this;

      var state = _lodash2.default.filter(this.state.files, function (file) {
        _this2.uploader.removeFile(file.id);
      });
      this.setState({ files: state });
    }
  }, {
    key: 'clearFailedFiles',
    value: function clearFailedFiles() {
      var _this3 = this;

      var state = _lodash2.default.filter(this.state.files, function (file) {
        if (file.error) {
          _this3.uploader.removeFile(file.id);
        }
        return !file.error;
      });
      this.setState({ files: state });
    }
  }, {
    key: 'removeFile',
    value: function removeFile(id) {
      this.uploader.removeFile(id);
      var state = _lodash2.default.filter(this.state.files, function (file) {
        return file.id !== id;
      });
      this.setState({ files: state });
    }
  }, {
    key: 'doUpload',
    value: function doUpload(e) {
      e.preventDefault();
      this.uploader.start();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var propsSelect = {
        id: this.getComponentId(),
        type: 'button',
        content: this.props.buttonSelect || 'Browse'
      };

      var propsUpload = {
        onClick: this.doUpload,
        type: 'button',
        content: this.props.buttonUpload || 'Upload'
      };
      if (this.state.files.length === 0) propsUpload.disabled = 'disabled';

      var list = this.list();

      return _react2.default.createElement(
        'div',
        { className: 'my-list', ref: function ref(_ref) {
            return _this4.container = _ref;
          } },
        _jsx('ul', {
          className: 'list-unstyled'
        }, void 0, list),
        _react2.default.createElement(_BrowseButton2.default, propsSelect),
        _react2.default.createElement(_UploadButton2.default, propsUpload)
      );
    }
  }]);

  return Plupload;
}(_react2.default.Component);

Plupload.propTypes = {
  'onPostInit': _propTypes2.default.func,
  'onBrowse': _propTypes2.default.func,
  'onRefresh': _propTypes2.default.func,
  'onStateChanged': _propTypes2.default.func,
  'onQueueChanged': _propTypes2.default.func,
  'onOptionChanged': _propTypes2.default.func,
  'onBeforeUpload': _propTypes2.default.func,
  'onUploadProgress': _propTypes2.default.func,
  'onFileFiltered': _propTypes2.default.func,
  'onFilesAdded': _propTypes2.default.func,
  'onFilesRemoved': _propTypes2.default.func,
  'onFileUploaded': _propTypes2.default.func,
  'onChunkUploaded': _propTypes2.default.func,
  'onUploadComplete': _propTypes2.default.func,
  'onDestroy': _propTypes2.default.func,
  'onError': _propTypes2.default.func,
  'id': _propTypes2.default.string.isRequired,
  'buttonSelect': _propTypes2.default.string,
  'buttonUpload': _propTypes2.default.string,
  'autoUpload': _propTypes2.default.bool
};

exports.default = Plupload;