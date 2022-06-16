import React, {useEffect, useState} from "react";
import {Marker, Popup} from 'react-leaflet';
import {iconPlace} from '../../Map/IconPlace';
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
                    if(error) { toast.error(error.response.data.errors);}
                });
        }
    }

    return socketData.length === 0 ? null : (
        socketData.map((element, index) => (
            <Marker position={[element.latitude, element.longitude]} icon={iconPlace} key={index}>
                <Popup>
                    <label className={"socket_no"}><Link  to={'/app/charging-app/socket/details/' + element._id + '?src=map'} title={element.ll_vendor_socket_id}>{'Socket Id: ' + element.ll_sno}</Link> </label>
                    <label className={"socket_no"}>Vendor Name: {element.vendor ? element.vendor.ll_vendor_name : '-'}</label>
                    <span> Address: {element.address ? element.address : element.re_location.ll_address_line1  + '  ' }</span>
                </Popup>
                </Marker>
        ))
    );
}

export default DynamicLocationMarker;
