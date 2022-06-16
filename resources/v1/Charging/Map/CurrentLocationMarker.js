import React, {useEffect, useState} from 'react';

import {Marker, Popup, useMapEvents} from 'react-leaflet';

import DynamicLocationMarker from "./DynamicLocationMarker";
import {NEAR_BY_SOCKET} from "../../Auth/Context/AppConstant";
import {iconPerson} from "../../Map/IconPerson";

const CurrentLocationMarker = () => {
    const [currentLatLng, setCurrentLatLng] = useState([12.906292183365192, 77.58561015129091]);

    useEffect(() => {
        setCurrentLatLng([12.906292183365192, 77.58561015129091]);
        map.locate();
        map.flyTo({lat: 12.906292183365192, lng: 77.58561015129091}, map.getZoom());
    }, []);

    const map = useMapEvents({
        /*locationfound(e) {
            setCurrentLatLng([e.latlng.lat, e.latlng.lng])
            map.flyTo(e.latlng, map.getZoom());
        },*/
        click(e) {
            
            //setCurrentLatLng([]);
            setCurrentLatLng([e.latlng.lat, e.latlng.lng]);
        },
    });

    return currentLatLng.length === 0 ? null : (
        <>
            <Marker position={currentLatLng} icon={iconPerson}>
                <Popup>
                    {currentLatLng}
                </Popup>
            </Marker>
            <DynamicLocationMarker currentPosition = {currentLatLng} Api_url={NEAR_BY_SOCKET}/>
        </>
    );
}

export default CurrentLocationMarker;
