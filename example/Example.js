import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader';
import Plupload from '../src/Plupload';

class Example extends Component {
  render() {
    return (
      <div>
        <h2>Plupload</h2>
        <Plupload id={'amber'}/>
      </div>
    );
  }
}

Example.propTypes = {};
Example.defaultProps = {};

const HotExample = hot(module)(Example);
ReactDOM.render(<HotExample />, document.getElementById('root'));
