import React from "react";
import { Map, GoogleApiWrapper, Marker, Circle } from "google-maps-react";
import { useState } from "react";
import MapService from "../../service/MapService";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import "../Sidebar/sidebar.css";
import Popup from '../Popup/Popup';
import '../Popup/Popup.css';
import Geocode from "react-geocode";

const MapContainer = (props) => {
  const [coord, setCoord] = useState([]);

  let info_array = [];

  useEffect(() => {
    retrieveData();
    decideMarks(props.display);
  }, [props.display]);

  let precip_array = [];
  let umid_array = [];
  const [precip, setPrecip] = useState([]);
  const [umid, setUmid] = useState([]);

  async function retrieveData(){
    await MapService.retrieveData().then((response) => {
      response.data.map(e => {
        info_array.push(e)
        precip_array.push(e.precip);
        umid_array.push(e.umid);
      })
    });
    setPrecip([Math.min(...precip_array), Math.max(...precip_array)]);
    setUmid([Math.min(...umid_array), Math.max(...umid_array)]);
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
            onClick={() => {setBtnPopup(true); setInfoCoord(coord); geocodeMark(coord.lat, coord.lon)}}
          />
      );
    });
  };

  const colorInterp = (value) => {
    let color1 = 'FF0000';
    let color2 = '0000FF';
    let ratio = (value - precip[0])/(precip[1] - precip[0]);
    let hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };
    
    let r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    let g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    let b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
    
    let middle = hex(r) + hex(g) + hex(b);
    console.log(middle)
    return ("#" + middle.toString());
  }

  const displayCircles = () => {
    return coord.map((item, index) => {
      return (
        <Circle
          key={index}
          id={index}
          center={{
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }}
          radius={80000}
          onClick={(event) => {
            console.log("click");
          }}
          strokeColor={colorInterp(item.precip)}
          strokeOpacity={0.8}
          strokeWeight={1}
          fillColor={colorInterp(item.precip)}
          fillOpacity={0.6}
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

  Geocode.setApiKey("AIzaSyC-nVVcbP-VGQBn7luYhTaTV2HnQNexMKw");
  Geocode.setRegion("pt");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  const [location, setLocation] = useState("");

  function geocodeMark(lat, lon) {
    Geocode.fromLatLng(lat, lon).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            console.log(response.results[0].address_components[i].types[j]);
            switch (response.results[0].address_components[i].types[j]) {
              case "administrative_area_level_2":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              default:
                console.log("Sorry, there is no address");
            }
          }
        }
        console.log(city, state, country);
        setLocation(city + ", " + state + ", " + country );
        //console.log(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  return (
    <>
      <Popup trigger={btnPopup} setTrigger={setBtnPopup}>
        <h5>{location}</h5>
        <p>Precipitação: {infoCoord.precip}</p>
        <p>Umidade: {infoCoord.umid}</p>
        <h5>Temperaturas:</h5>
        <p>Max: {infoCoord.tempMax}; Min: {infoCoord.tempMin}</p>
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
