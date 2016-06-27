import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'
import * as actions from './actions'

// Not all consoles (e.g the xcode logger) supports colors
// which causes annoying formatting issues for the store log.
const logger = createLogger({
  colors: false,
  //collapsed: (getState, action) => action.type !== actions.UPDATE_ONLINE_USERS,
  //predicate: (getState, action) => action.type == actions.UPDATE_LAST_READ_TIMESTAMP,
  predicate: (getState, action) => action.type == actions.MARK_MESSAGES_AS_RECEIVED,
  stateTransformer: (state: Object) => state.messages,
  //actionTransformer: (action) => action.type
});

export default function configureStore(initialState) {
	// NOTE: the logger middle ware must be at the end
	return createStore(
		rootReducer, 
		initialState,
		applyMiddleware(
			thunk,
			logger
		)
	)
}