import thunk from 'redux-thunk';
import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux'

const middleware = applyMiddleware(thunk);
const store = createStore(reducers, middleware);

export default store;
