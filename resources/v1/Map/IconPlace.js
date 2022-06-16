import L from 'leaflet';

const iconPlace= new L.Icon({
    iconUrl: '/v1/map/img/place-location.svg',
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export { iconPlace };