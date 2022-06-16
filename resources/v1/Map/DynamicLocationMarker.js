import React, {useEffect, useState} from "react";
import {Marker, Popup, useMapEvents} from 'react-leaflet';
import {iconPlace} from './IconPlace';
import axios from "axios";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
let socket_data = [];
const DynamicLocationMarker = (props) => {
    const [socketData, setSocketData] = useState([]);

    useEffect(() => {
        nearBySockets();
    }, [props.currentPosition]);

    const nearBySockets = async () => {
            if (props.currentPosition.length > 0) {
                await axios.get(props.Api_url + '?lat=' + props.currentPosition[0] + '&long=' + props.currentPosition[1])
                    .then(res => {
                        if (res.data && res.data.success) {
                            if(socketData.length === 0){
                                socket_data = res.data.data;
                                setSocketData(res.data.data);
                            } else {
                                socket_data = [...socketData, ...res.data.data];
                                setSocketData([...socketData, ...res.data.data]);
                            }
                        }else {
                            setSocketData([...socketData, ...socket_data]);
                        }
                    }).catch(function (error) {
                        if(error) { alert(error.response.data.errors);}
                        else { alert('unauthorized action')}
                    });
            }

    }

    return socketData.length === 0 ? null : (
        socketData.map((element, index) => (
            <Marker position={[element.latitude, element.longitude]} icon={iconPlace} key={index}>
                <Popup>
                    <label className={"socket_no"}>Socket Id: {element.ll_vendor_socket_id}</label>
                    <label className={"socket_no"}>
                    <Link to={'/app/booking-app/booking/details/' + element._id + '?src=map'} title={element.ll_vendor_socket_id}>Booking Id: {element.ll_booking_no}</Link>
                    </label>
                    <label className={"socket_no"}>Vendor Name: {element.vendor ? element.vendor.ll_vendor_name : '-'}</label>
                    <label className={"socket_no"}>Rider Name: {element.rider ? element.rider.name : '-'}</label>
                    <span>Address: {element.address ? element.address : ''}</span>
                </Popup>
            </Marker>
        ))
    );
}

export default DynamicLocationMarker;
