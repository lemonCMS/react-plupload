import _ from 'lodash';
import React from 'react';
import browseButton from './BrowseButton';
import uploadButton from './UploadButton';

let count = 0;
const EVENTS = [
  'PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged',
  'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded',
  'UploadComplete', 'Destroy', 'Error'
];

let uploader;

module.exports = React.createFactory(React.createClass({
  displayName: 'Plupload',
  propTypes: {
    'onPostInit': React.PropTypes.func,
    'onBrowse': React.PropTypes.func,
    'onRefresh': React.PropTypes.func,
    'onStateChanged': React.PropTypes.func,
    'onQueueChanged': React.PropTypes.func,
    'onOptionChanged': React.PropTypes.func,
    'onBeforeUpload': React.PropTypes.func,
    'onUploadProgress': React.PropTypes.func,
    'onFileFiltered': React.PropTypes.func,
    'onFilesAdded': React.PropTypes.func,
    'onFilesRemoved': React.PropTypes.func,
    'onFileUploaded': React.PropTypes.func,
    'onChunkUploaded': React.PropTypes.func,
    'onUploadComplete': React.PropTypes.func,
    'onDestroy': React.PropTypes.func,
    'onError': React.PropTypes.func,
    'id': React.PropTypes.string.isRequired,
    'buttonSelect': React.PropTypes.string,
    'buttonUpload': React.PropTypes.string
  },

  getInitialState() {
    return {files: [], uploadState: false, progress: {}};
  },

  componentDidMount() {
    const self = this;
    this.initUploader();

    this.uploader.init();

    EVENTS.forEach(function(event) {
      const handler = self.props['on' + event];
      if (typeof handler === 'function') {
        self.uploader.bind(event, handler);
      }
    });

    // Put the selected files into the current state
    this.uploader.bind('FilesAdded', (up, files) => {
      const f = self.state.files;
      _.map(files, (file) => {
        f.push(file);
      });
      self.setState({files: f});
    });

    this.uploader.bind('FilesRemoved', (up, rmFiles) => {
      const stateFiles = self.state.files;
      const files = _.filter(stateFiles, (file) => {
        return undefined === _.findWhere(rmFiles, {id: file.id});
      });
      self.setState({files: files});
    });

    this.uploader.bind('StateChanged', (up) => {
      if (up.state === window.plupload.STARTED && self.state.uploadState === false) {
        self.setState({uploadState: true});
      }
      if (up.state !== window.plupload.STARTED && self.state.uploadState === true) {
        self.setState({uploadState: false});
      }
    });

    this.uploader.bind('FileUploaded', (up, file) => {
      const stateFiles = self.state.files;
      _.map(stateFiles, (val, key) => {
        if (val.id === file.id) {
          console.log('Found', file.id);
          val.uploaded = true;
          stateFiles[key] = val;
        }
      });
      self.setState({files: stateFiles});
    });


    this.uploader.bind('Error', (up, err) => {
      if (_.isUndefined(err.file) !== true) {
        console.log('ERROR', err);
        const stateFiles = self.state.files;
        _.map(stateFiles, (val, key) => {
          if (val.id === err.file.id) {
            val.error = err;
            stateFiles[key] = val;
          }
        });
        self.setState({files: stateFiles});
      }
    });

    this.uploader.bind('UploadProgress', (up, file) => {
      const stateProgress = self.state.progress;
      stateProgress[file.id] = file.percent;
      self.setState({progress: stateProgress});
    });
  },

  componentDidUpdate() {
    this.refresh();
  },

  getComponentId() {
    return this.props.id || 'react_plupload_' + count++;
  },

  refresh() {
    // Refresh to append events to buttons again.
    this.uploader.refresh();
  },

  initUploader() {
    this.uploader = new window.plupload.Uploader(_.extend({
      runtimes: 'flash',
      multipart: true,
      chunk_size: '1mb',
      browse_button: this.getComponentId(),
      url: '/upload',
      flash_swf_url: '/plupload-2.1.8/js/Moxie.swf'
    }, this.props));
  },

  // Display selected files
  list() {
    const self = this;
    return _.map(this.state.files, (val) => {

      const removeFile = (e) => {
        e.preventDefault();
        self.removeFile(val.id);
      };
      let delButton = '';
      if (self.state.uploadState === false && val.uploaded !== true) {
        delButton = React.createElement('button', {onClick: removeFile, className: 'pull-right'}, 'X');
      }

      let progressBar = '';
      if (self.state.uploadState === true && val.uploaded !== true && _.isUndefined(val.error)) {
        const percent = self.state.progress[val.id] || 0;
        progressBar = React.createElement('div', {className: 'progress'},
          React.createElement('div', {
            className: 'progress-bar',
            role: 'progressbar',
            'aria-valuenow': percent,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            style: {width: percent + '%'}
          },
            React.createElement('span', {className: 'sr-only'}, percent + 'complete')
          )
        );
      }

      let errorDiv = '';
      if (!_.isUndefined(val.error)) {
        errorDiv = React.createElement('div', {className: 'alert alert-danger'}, 'Error: ' + val.error.code + ', Message: ' + val.error.message);
      }

      let bgSuccess = '';
      if (!_.isUndefined(val.uploaded)) {
        bgSuccess = 'bg-success';
      }

      return React.createElement('li', {key: val.id},
        React.createElement('p', {className: bgSuccess}, val.name, ' ', delButton), progressBar, errorDiv
      );
    });
  },


  removeFile(id) {
    this.uploader.removeFile(id);
    _.filter(this.state.files, (file) => {
      return file.id !== id;
    });
  },

  doUpload(e) {
    e.preventDefault();
    this.uploader.start();
  },

  render() {
    const propsSelect = {
      id: this.getComponentId(),
      type: 'button',
      content: this.props.buttonSelect || 'Browse'
    };

    const propsUpload = {
      onClick: this.doUpload,
      content: this.props.buttonUpload || 'Upload'
    };
    if (this.state.files.length === 0) propsUpload.disabled = 'disabled';

    const list = this.list();

    return React.createElement('div', {className: 'my-list'},
      React.createElement('ul', {className: 'list-unstyled'}, list),
      browseButton(propsSelect),
      uploadButton(propsUpload)
    );
  }
}));
