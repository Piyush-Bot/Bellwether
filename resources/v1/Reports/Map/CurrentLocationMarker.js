import React, {useEffect, useState} from 'react';

import {Marker, Popup, useMapEvents} from 'react-leaflet';
import { iconPerson } from './IconPerson';
import {iconPlace} from './IconPlace';
import helpers from "../../../helpers"
import {useParams, useLocation, Link} from "react-router-dom";
import Modal from 'react-modal';


const CurrentLocationMarker = (props) => {

   

    let { id } = useParams();

   
       
    let hub_name = props.data ? props.data.hub_name : '';
    let rider_name = props.data ? props.data.rider_name : '';
    let checkin_latitute = props.data && props.data !== 'undefined' ? props.data.checkin_latitute : 0;
    let checkin_longitute = props.data && props.data !=='undefined'? props.data.checkin_longitute : 0;
    let checkout_latitute = props.data && props.data !=='undefined' ? props.data.checkout_latitute : 0;
    let checkout_longitute = props.data  && props.data !=='undefined' ? props.data.checkout_longitute : 0;
    let hub_latitute = props.data && props.data !=='undefined' ? props.data.hub_latitute : 0;
    let hub_longitute = props.data && props.data !=='undefined' ? props.data.hub_longitute : 0;
    let checkin_distance = props.data && props.data !=='undefined' ? props.data.checkin_distance : 0;
    let checkout_distance =    props.data && props.data !=='undefined' ? props.data.checkout_distance : 0;

    checkin_distance =  parseFloat(checkin_distance ).toFixed(2);
    checkout_distance =  parseFloat(checkout_distance ).toFixed(2);


   hub_latitute = hub_latitute === null ? 0 : hub_latitute ;  
   hub_longitute = hub_longitute === null ? 0 : hub_longitute ;  
   
   checkout_latitute = checkout_latitute === null ? 0 : checkout_latitute;
   checkout_longitute = checkout_longitute === null ? 0 :checkout_longitute;

   
    const [checkinLatLng, setCheckinLatLng] = useState([checkin_latitute, checkin_longitute]);
    const [checkoutLatLng, setCheckoutLatLng] = useState([checkout_latitute, checkout_longitute]);
    const [hubLatLng, setHubLatLng] = useState([ hub_latitute, hub_longitute]);
    

    useEffect(() => {
        setCheckinLatLng([checkin_latitute, checkin_longitute]);
        setCheckoutLatLng([checkout_latitute, checkout_longitute]);
       
        setHubLatLng([hub_latitute, hub_longitute]);
        map.locate();
      map.flyTo({lat: hub_latitute, lng: hub_longitute}, map.getZoom());
      
    }, []);

    const map = useMapEvents({
      
        /*click(e) {
            setCheckinLatLng([e.latlng.lat, e.latlng.lng]);
        },*/
    });

    {
        console.log( checkinLatLng+"------"+checkoutLatLng );
    }
 
    return checkinLatLng.length === 0 ? null : (
        <>
            <Marker position={checkinLatLng} icon={iconPerson}>
                <Popup>
                <span>Rider Name: {rider_name}</span>
                <br></br>
                <span>Checkin Lat Long: {checkinLatLng}</span>
                <br></br>
                <span>Checkin Distance: {checkin_distance}</span>
                </Popup>
            </Marker>

                    
            
            {   
            checkoutLatLng.length == 0 ?  null  :
            <Marker position={checkoutLatLng} icon={iconPerson}>
                <Popup>
                <span>Rider Name: {rider_name}</span>
                <br></br>
                <span>Checkout Lat Long: {checkoutLatLng}</span>
                <br></br>
                <span>Checkout Distance: {checkout_distance}</span>
                </Popup>
            </Marker> 
            }
            
            {
                hub_latitute !== ''  ?
                <Marker position={hubLatLng} icon={iconPlace}>
                <Popup>
                <span>Hub Name: {hub_name}</span>
                <br></br>
                <span>Hub Lat Long: {hubLatLng}</span>
                </Popup>
            </Marker> : null
            }
            
           
        </>
    );
}

export default CurrentLocationMarker;
