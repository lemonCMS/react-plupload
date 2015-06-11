var _ = require('lodash');
var React = require('react');
var count = 0;
var EVENTS = [
'PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged',
'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded',
'UploadComplete', 'Destroy', 'Error'
];


var uploader;
module.exports = React.createClass({
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
		'onError': React.PropTypes.func
	},

	getInitialState: function() {
		return {files: []};
	},

	componentWillMount: function () {
		this.id = this.id || "react_plupload_" + count++;
		
	},

	initUploader: function() {
		uploader = new plupload.Uploader(_.extend({
			runtimes: 'flash',
			browse_button: this.props.id || this.id,
			url: '/upload',
			flash_swf_url : '/assets/plupload-2.1.4/js/Moxie.swf'
		}, this.props));
	},

	refresh: function() {
		//Refresh to append events to buttons again.
		uploader.refresh();
	},

	componentDidUpdate: function() {
		this.refresh();
	},

	componentDidMount: function () {
		var self = this;
		this.initUploader();

		uploader.init();

		EVENTS.forEach(function (event) {
			var handler = self.props['on' + event];
			if(typeof handler === 'function') {
				uploader.bind(event, handler);
			}
		});

		//Put the selected files into the current state
		uploader.bind('FilesAdded', function(up, files) {
			var f = self.state.files;
			_.map(files, function(file, key) {
				f.push(file);
			});
			self.setState({files: f});
		});

		uploader.bind('FilesRemoved', function(up, rmFiles) {
			console.log('FILESREMOVED.x ', rmFiles);
			var stateFiles = self.state.files;
			var files = _.filter(stateFiles, function(file) {
				return undefined === _.findWhere(rmFiles, {id: file.id});
			});

			self.setState({files: files});
		});
	},

	//Display selected files
	lis: function() {
		var self = this;
		return _.map(this.state.files, function(val, key) {
			

			var removeFile = function(e) {
				e.preventDefault();
				self.removeFile(val.id);
			}

			var delButton =  React.DOM.button({onClick: removeFile, className: 'pull-right'}, 'X');

			return React.DOM.li({key: val.id}, val.name, ' ', delButton);
		});
	},


	removeFile: function(id) {
		var self = this;
		uploader.removeFile(id);
		var files = _.filter(this.state.files, function(file) {
		    return file['id']!=id;
		});
	},

	doUpload: function(e) {
		e.preventDefault();
		uploader.start();
	},

	render: function() {
		var propsSelect = {
			id: this.id,
			type: 'button',
			content: this.props.buttonSelect || 'Browse'
		};

		var propsUpload = {
			onClick: this.doUpload,
			content: this.props.buttonUpload || 'Upload',
		};
		if(this.state.files.length === 0) propsUpload.disabled = 'disabled';
		
		var lis = this.lis();

		return 	React.DOM.div({ className: 'my-list' },
					React.DOM.ul({className: 'list-unstyled'}, lis),
					BrowseButton(propsSelect),
					UploadButton(propsUpload)
				);
	}

});



var BrowseButton  = React.createFactory(React.createClass({
	shouldComponentUpdate: function() {
		return false;
	},
	componentWillUpdate: function() {
	
	},
	render: function() {
		return React.DOM.button(_.omit(this.props, 'content'), this.props.content)
	}
}));


var UploadButton  = React.createFactory(React.createClass({
	shouldComponentUpdate: function() {
		return true;
	},
	componentWillUpdate: function() {
	
	},
	render: function() {
		return React.DOM.button(_.omit(this.props, 'content'), this.props.content)
	}
}));