'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BrowseButton = require('./BrowseButton');

var _BrowseButton2 = _interopRequireDefault(_BrowseButton);

var _UploadButton = require('./UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

var count = 0;
var EVENTS = ['PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged', 'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded', 'UploadComplete', 'Destroy', 'Error'];

var uploader = undefined;

module.exports = _react2['default'].createFactory(_react2['default'].createClass({
  displayName: 'Plupload',
  propTypes: {
    'onPostInit': _react2['default'].PropTypes.func,
    'onBrowse': _react2['default'].PropTypes.func,
    'onRefresh': _react2['default'].PropTypes.func,
    'onStateChanged': _react2['default'].PropTypes.func,
    'onQueueChanged': _react2['default'].PropTypes.func,
    'onOptionChanged': _react2['default'].PropTypes.func,
    'onBeforeUpload': _react2['default'].PropTypes.func,
    'onUploadProgress': _react2['default'].PropTypes.func,
    'onFileFiltered': _react2['default'].PropTypes.func,
    'onFilesAdded': _react2['default'].PropTypes.func,
    'onFilesRemoved': _react2['default'].PropTypes.func,
    'onFileUploaded': _react2['default'].PropTypes.func,
    'onChunkUploaded': _react2['default'].PropTypes.func,
    'onUploadComplete': _react2['default'].PropTypes.func,
    'onDestroy': _react2['default'].PropTypes.func,
    'onError': _react2['default'].PropTypes.func,
    'id': _react2['default'].PropTypes.string.isRequired,
    'buttonSelect': _react2['default'].PropTypes.string,
    'buttonUpload': _react2['default'].PropTypes.string
  },

  getInitialState: function getInitialState() {
    return { files: [], uploadState: false, progress: {} };
  },

  componentDidMount: function componentDidMount() {
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
      var f = self.state.files;
      _lodash2['default'].map(files, function (file) {
        f.push(file);
      });
      self.setState({ files: f });
    });

    this.uploader.bind('FilesRemoved', function (up, rmFiles) {
      var stateFiles = self.state.files;
      var files = _lodash2['default'].filter(stateFiles, function (file) {
        return undefined === _lodash2['default'].findWhere(rmFiles, { id: file.id });
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
      _lodash2['default'].map(stateFiles, function (val, key) {
        if (val.id === file.id) {
          console.log('Found', file.id);
          val.uploaded = true;
          stateFiles[key] = val;
        }
      });
      self.setState({ files: stateFiles });
    });

    this.uploader.bind('Error', function (up, err) {
      if (_lodash2['default'].isUndefined(err.file) !== true) {
        (function () {
          console.log('ERROR', err);
          var stateFiles = self.state.files;
          _lodash2['default'].map(stateFiles, function (val, key) {
            if (val.id === err.file.id) {
              val.error = err;
              stateFiles[key] = val;
            }
          });
          self.setState({ files: stateFiles });
        })();
      }
    });

    this.uploader.bind('UploadProgress', function (up, file) {
      var stateProgress = self.state.progress;
      stateProgress[file.id] = file.percent;
      self.setState({ progress: stateProgress });
    });
  },

  componentDidUpdate: function componentDidUpdate() {
    this.refresh();
  },

  getComponentId: function getComponentId() {
    return this.props.id || 'react_plupload_' + count++;
  },

  refresh: function refresh() {
    // Refresh to append events to buttons again.
    this.uploader.refresh();
  },

  initUploader: function initUploader() {
    this.uploader = new window.plupload.Uploader(_lodash2['default'].extend({
      runtimes: 'flash',
      multipart: true,
      chunk_size: '1mb',
      browse_button: this.getComponentId(),
      url: '/upload',
      flash_swf_url: '/plupload-2.1.8/js/Moxie.swf'
    }, this.props));
  },

  // Display selected files
  list: function list() {
    var self = this;
    return _lodash2['default'].map(this.state.files, function (val) {

      var removeFile = function removeFile(e) {
        e.preventDefault();
        self.removeFile(val.id);
      };
      var delButton = '';
      if (self.state.uploadState === false && val.uploaded !== true) {
        delButton = _react2['default'].createElement('button', { onClick: removeFile, className: 'pull-right' }, 'X');
      }

      var progressBar = '';
      if (self.state.uploadState === true && val.uploaded !== true && _lodash2['default'].isUndefined(val.error)) {
        var percent = self.state.progress[val.id] || 0;
        progressBar = _react2['default'].createElement('div', { className: 'progress' }, _react2['default'].createElement('div', {
          className: 'progress-bar',
          role: 'progressbar',
          'aria-valuenow': percent,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          style: { width: percent + '%' }
        }, _react2['default'].createElement('span', { className: 'sr-only' }, percent + 'complete')));
      }

      var errorDiv = '';
      if (!_lodash2['default'].isUndefined(val.error)) {
        errorDiv = _react2['default'].createElement('div', { className: 'alert alert-danger' }, 'Error: ' + val.error.code + ', Message: ' + val.error.message);
      }

      var bgSuccess = '';
      if (!_lodash2['default'].isUndefined(val.uploaded)) {
        bgSuccess = 'bg-success';
      }

      return _react2['default'].createElement('li', { key: val.id }, _react2['default'].createElement('p', { className: bgSuccess }, val.name, ' ', delButton), progressBar, errorDiv);
    });
  },

  removeFile: function removeFile(id) {
    this.uploader.removeFile(id);
    _lodash2['default'].filter(this.state.files, function (file) {
      return file.id !== id;
    });
  },

  doUpload: function doUpload(e) {
    e.preventDefault();
    this.uploader.start();
  },

  render: function render() {
    var propsSelect = {
      id: this.getComponentId(),
      type: 'button',
      content: this.props.buttonSelect || 'Browse'
    };

    var propsUpload = {
      onClick: this.doUpload,
      content: this.props.buttonUpload || 'Upload'
    };
    if (this.state.files.length === 0) propsUpload.disabled = 'disabled';

    var list = this.list();

    return _react2['default'].createElement('div', { className: 'my-list' }, _react2['default'].createElement('ul', { className: 'list-unstyled' }, list), (0, _BrowseButton2['default'])(propsSelect), (0, _UploadButton2['default'])(propsUpload));
  }
}));