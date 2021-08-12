import './App.css';
import { GlobalStyle } from "./Components/GlobalStyle";
import MapContainer from './Components/MapContainer';
import Navbar from './Components/Navbar';
import Button from './Components/Button';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Components/Sidebar';
import { useState } from 'react';
import React from 'react';

function App() {

  const [display, setDisplay] = useState('');
  const changeDisplay = (value) => {
    let displayUpdated;
    if(display.indexOf(value) > -1){
      displayUpdated = display.filter(e => e !== value);
    } else {
      displayUpdated = [...display, value];
    }
    setDisplay(displayUpdated);

  }

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Sidebar changeDisplay={changeDisplay}/>
      <MapContainer display={display} />
    </>
  );
}

export default App;
