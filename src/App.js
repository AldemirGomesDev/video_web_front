import React from 'react';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import './global.css'

import Routes from './routes';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  offset: '30px',
  transition: 'scale',
};


function App() {
  return (
    <Provider template={AlertTemplate} {...options}>
      <Routes />
    </Provider>
  );
}

export default App;
