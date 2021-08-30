
import { useState } from 'react';
import React from 'react';
import {GlobalStyle} from "../../Components/GlobalStyle";
import MapContainer from '../../Components/MapContainer';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';

function Athena() {

const [display, setDisplay] = useState([]);
  const changeDisplay = (value) => {
    console.log(value);
    let displayUpdated;
    if(display.indexOf(value) > -1){
      displayUpdated = display.filter(e => e !== value);
    } else {
      displayUpdated = [...display, value];
    }
    console.log(displayUpdated);
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

export default Athena;