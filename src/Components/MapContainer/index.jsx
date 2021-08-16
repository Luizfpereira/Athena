import React from "react";
import { Map, GoogleApiWrapper, Marker, Circle } from "google-maps-react";
import { useState } from "react";
import MapService from "../../service/MapService";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import "../Sidebar/sidebar.css";
import Popup from '../Popup/Popup';
import '../Popup/Popup.css';

const MapContainer = (props) => {
  const [coord, setCoord] = useState([]);

  let info_array = [];

  useEffect(() => {
    retrieveData();
    decideMarks(props.display);
  }, [props.display]);

  async function retrieveData(){
    await MapService.retrieveData().then((response) => {
      response.data.map(e => info_array.push(e))
    });
    setCoord(info_array);
  }

  const displayMarkers = () => {
    return coord.map((coord, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: coord.lat,
            lng: coord.lon,
          }}
          onClick={() => {setBtnPopup(true); setInfoCoord(coord);}}
        />
      );
    });
  };

  const displayCircles = () => {
    return coord.map((item, index) => {
      return (
        <Circle
          key={index}
          id={index}
          center={{
            lat: item.lat,
            lng: item.lon,
          }}
          radius={1200.7819845667905}
          onClick={(event) => {
            console.log("click");
          }}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={20}
          fillColor="#FF0000"
          fillOpacity={0.2}
        />
      );
    });
  };

  const [markerList, setMarkerList] = useState([]);

  let pic = false;
  let circle = false;
  function decideMarks(props){
    if (props.indexOf("pic") > -1) {
      pic = !pic;
     }
    if (props.indexOf("circle") > -1) {
      circle = !circle;
    }
    setMarkerList([pic ? displayMarkers() : null, circle ? displayCircles() : null])
    return markerList;
  }

  const [btnPopup, setBtnPopup] = useState(false);
  const [infoCoord, setInfoCoord] = useState([]);

  return (
    <>
      <Popup trigger={btnPopup} setTrigger={setBtnPopup}>
        <h2>Informações</h2>
        <p>Latitude: {infoCoord.lat}; Longitude: {infoCoord.lon}</p>
        <p>precip: {infoCoord.precip}</p>
      </Popup>
      <Map
        google={props.google}
        zoom={4}
        initialCenter={{ lat: -2.0, lng: -54.1 }}
      >
        {markerList}
      </Map>
    </>
  );
};

export default GoogleApiWrapper((props) => ({
  apiKey: "AIzaSyARWQl06VeasqI_idjWVydF_RgTDzTf9QI",
}))(MapContainer);
