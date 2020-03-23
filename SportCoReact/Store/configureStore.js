// Store/configureStore.js

import { createStore } from 'redux';
import rootReduce from './Reducers/rootReducer';

export default createStore(rootReduce);
