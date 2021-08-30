import React from "react";
import MapService from "../../service/MapService";
import MapContainer from "../MapContainer";
import "./sidebar.css";

const Sidebar = ({changeDisplay}) => {

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  return (
    <>
      <div id="mySidenav" className="sidenav" onMouseLeave={closeNav}>
        {/* <a href="#" class="closebtn" onClick={closeNav}>&times;</a> */}
        <a href="#" onClick={() => changeDisplay('pic')}>
          PICs
        </a>
        <a href="#" onClick={() => changeDisplay('circle')}>Circles</a>
        <a href="#" onClick={() => changeDisplay('polygon')}>Polygon</a>
        <a href="#">Contact</a>
      </div>
      <button  className="btn-menu" onMouseEnter={openNav} >
        &#9776; Menu
      </button>
    </>
  );
};

export default Sidebar;
