import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker, Circle, KmlLayer } from "google-maps-react";
import Geocode from "react-geocode";
import MapService from "../../service/MapService";
import Popup from '../Popup/Popup';
import Select from '../Select/Select';
import "../Sidebar/sidebar.css";
import '../Popup/Popup.css';

const MapContainer = (props) => {
  
  let info_array = [];
  let precip_array = [];
  let umid_array = [];
  let tempMax_array = [];
  let tempMin_array = [];
  let pic = false;
  let circle = false;

  const [select, setSelect] = useState('');
  const [precip, setPrecip] = useState([]);
  const [umid, setUmid] = useState([]);
  const [tempMax, setTempMax] = useState([]);
  const [tempMin, setTempMin] = useState([]);
  const [coord, setCoord] = useState([]);
  const [markerList, setMarkerList] = useState();
  const [circleList, setCircleList] = useState();
  const [btnPopup, setBtnPopup] = useState(false);
  const [infoCoord, setInfoCoord] = useState([]);
  const [location, setLocation] = useState("");
 
  useEffect(() => {
    retrieveData();
    decideMarks(props.display);
  }, [props.display]);

  useEffect(()=>{
    setCircleList();
    setCircleList(displayCircles());
  }, [select])

  Geocode.setApiKey("AIzaSyC-nVVcbP-VGQBn7luYhTaTV2HnQNexMKw");
  Geocode.setRegion("pt");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  // Retrieve data from BigQuery and store in arrays for each information
  async function retrieveData(){
    await MapService.retrieveData().then((response) => {
      response.data.map(e => {
        info_array.push(e)
        precip_array.push(e.precip);
        umid_array.push(e.umid);
        tempMax_array.push(e.tempMax);
        tempMin_array.push(e.tempMin);
      })
    });
    setPrecip([Math.min(...precip_array), Math.max(...precip_array)]);
    setUmid([Math.min(...umid_array), Math.max(...umid_array)]);
    setTempMax([Math.min(...tempMax_array), Math.max(...tempMax_array)]);
    setTempMin([Math.min(...tempMin_array), Math.max(...tempMin_array)]);
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

  const displayCircles = () => {
    return coord.map((item, index) => {
      let color = colorInterp(decideInfo(item));
      return (
        <Circle
          key={index}
          id={index}
          center={{
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }}
          radius={80000}
          strokeColor={color}
          strokeOpacity={0.8}
          strokeWeight={1}
          fillColor={color}
          fillOpacity={0.6}
        />
      );
    });
  };

  function decideInfo(item){
    switch(select){
      case 'temperatura':
        return [item.tempMax, ...tempMax];
      case 'umidade':
        return [item.umid, ...umid];
      case 'precipitacao':
        return [item.precip, ...precip];
      default:
        return '';
    }
  }

  const colorInterp = (props) => {
    let color1 = 'FF0000';
    let color2 = '0000FF';
    let ratio = (props[0] - props[1])/(props[2] - props[1]);
    let hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };
    
    let r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    let g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    let b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
    
    let middle = hex(r) + hex(g) + hex(b);
    return ("#" + middle.toString());
  }

  function decideMarks(props){
    if (props.indexOf("pic") > -1) {
      pic = !pic;
     }
    if (props.indexOf("circle") > -1) {
      circle = !circle;
    }
    setMarkerList(pic ? displayMarkers() : null)
    setCircleList(circle ? displayCircles() : null)
    return [markerList, circleList];
  }

  function geocodeMark(lat, lon) {
    Geocode.fromLatLng(lat, lon).then(
      (response) => {
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
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
        setLocation(city + ", " + state + ", " + country );
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
        {circleList}
      </Map>
      <Select setSelect={setSelect}/>
    </>
  );
};

export default GoogleApiWrapper((props) => ({
  apiKey: "AIzaSyARWQl06VeasqI_idjWVydF_RgTDzTf9QI",
}))(MapContainer);
