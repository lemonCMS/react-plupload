import React from 'react';
import Helmet from 'react-helmet';
import Plupload from 'react-plupload';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          title="Site"
          titleTemplate="MySite.com - %s"
          link={[{'rel': 'stylesheet', 'href': 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.css', 'type': 'text/css', 'media': 'screen'}]}
          />
        <h1>Home</h1>
        <Plupload
          id="plupload"
          runtimes="html5,flash,html4"
          multipart
          chunk_size="1mb"
          url="/"
          flash_swf_url="/plupload-2.1.8/js/Moxie.swf"
          />
      </div>
    );
  }
}
