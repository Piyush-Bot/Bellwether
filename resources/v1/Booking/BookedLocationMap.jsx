import React, {useEffect, useState} from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import CurrentLocationMarker from "../Map/CurrentLocationMarker";

export default function MapView() {
    const [position, setPosition] = useState([12.965325364550859, 77.58387888385118]);
    return (
        <div className="content map-card">
            <div className="container-fluid">
                <div>
                    <div className="col-md-12 text-right">
                        <a className="grid-btn btn btn-secondary mr-3 mb-2 mt-3" href="/app/booking-app"><i className="fa fa-cube mr-1"
                                                                                                             aria-hidden="true"></i>Grid View
                        </a>
                    </div>
                    <MapContainer center={position} zoom={15}
                                  style={{ height: 'calc(100vh - 220px)', width: '100wh' }}
                                  scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <CurrentLocationMarker/>
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
