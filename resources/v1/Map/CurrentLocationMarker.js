import React, {useEffect, useState} from 'react';

import {Marker, Popup, useMapEvents} from 'react-leaflet';
import { iconPerson } from './IconPerson';
import DynamicLocationMarker from "./DynamicLocationMarker";
import {BOOKED_DATA_BASED_LOC, SOCKET_LIST} from "../Auth/Context/AppConstant";

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
            <DynamicLocationMarker currentPosition = {currentLatLng} Api_url={BOOKED_DATA_BASED_LOC}/>
        </>
    );
}

export default CurrentLocationMarker;
