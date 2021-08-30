import React from "react";
import "./Navbar.css";
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const UnList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: rgb(255, 175, 109);
`

const Navbar = () => {
  return (
    <ul>
      <li className="active"><Link to="/">Athena</Link></li>
      <li className="alt"><Link to="/graphs">Graphs</Link></li>
      <li className="alt"><Link to="/contact">Contact</Link></li>
      <li className="alt"><Link to="/about">About</Link></li>
    </ul>
  );
};

export default Navbar;
