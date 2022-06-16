import React, {useEffect, useState} from 'react'
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer} from 'react-leaflet';
import CurrentLocationMarker from "../Map/CurrentLocationMarker";

import {Marker, Popup, useMapEvents} from 'react-leaflet';
import Modal from 'react-modal';

import helpers from "../../../helpers"


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }

const CheckinOutMap = (props) => {
   

    let queryParam = helpers.useQueryParams();
    
    const [position, setPosition] = useState([12.965325364550859, 77.58387888385118]);

    let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
    
    return (
        <React.Fragment>
                    <div className="content map-card">
            <div className="container-fluid">
                <div>
                    
                    <MapContainer center={position} zoom={15}
                                  style={{ height: 'calc(100vh - 220px)', width: '100wh' }}
                                  scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                                           
                       <CurrentLocationMarker data= {props.data} />
                    </MapContainer>
                    
                </div>
            </div>
        </div>
            </React.Fragment>
    );

}

export default CheckinOutMap
