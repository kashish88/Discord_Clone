import { Provider} from 'react-redux'
import React from 'react';
import ReactDOM from 'react-dom';
import store from './app/store'


import App3 from './App3';
 

ReactDOM.render(
<Provider store={store}>
  <App3 />
  </Provider>,
  document.getElementById('root')
);


