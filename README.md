#react-plupload

Use plupload functionality to upload files in your React application

#Run Example
````
git clone https://github.com/lemonCMS/react-plupload.git
cd react-plupload/example
npm install
npm run dev
````
Made possible with the excellent boilerplate from
https://github.com/erikras/react-redux-universal-hot-example

#Basic usage
````jsx
<Plupload
  id="plupload"
  runtimes="flash"
  multipart
  chunk_size="1mb"
  url="/"
  flash_swf_url="/plupload-2.1.8/js/Moxie.swf"
/>
````


GitHub: https://github.com/lemonCMS/react-plupload
##Version 0.0.8
- Added - Example
- Added - build lib files
- Upgrade react to 0.14

##Version 0.0.6
- Added - Progressbar
- Added - Errorhandling

##Version 0.0.4
- Added - Upload is working
- Added - Remove file from queue button

##Version 0.0.2
- Does not try to upload anything yet, just got the file selector working.


##Wishlist
- ~~progressbar~~
- ~~remove delete from queue button while uploading~~


Usage
- Download plupload from http://www.plupload.com, put the files in accesable folder on your webserver.
- Link to de plupload js <script src="/assets/plupload-2.1.4/js/plupload.full.min.js"></script>
- Importent include this script before any react scripts!

<Plupload 
	runtimes="html5,flash,html4"
	buttonBrowse="Browse"
	buttonUpload="Upload"              
/>

Events
All events are available through the react component like so:

<Plupload 
	runtimes="html5,flash,html4"
	buttonBrowse="Browse"
	buttonUpload="Upload"
	onFilesAddes=scopeFilesAddedd             
/>

All available events are on http://www.plupload.com/examples/events

just call them with the "on" prefix like this:

UploadComplete becomes onUploadComplete
Destroy => onBecomes

