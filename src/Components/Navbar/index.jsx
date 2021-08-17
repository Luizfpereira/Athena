import React from "react";
import styled from "styled-components";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="topnav">
      <a className="brand active" href="#home">
        Athena
      </a>
      <a href="#news">News</a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
  );
};

export default Navbar;
