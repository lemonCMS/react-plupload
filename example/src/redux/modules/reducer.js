import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerStateReducer } from 'redux-router';


export default combineReducers({
  router: routerStateReducer,
  form: formReducer
});
