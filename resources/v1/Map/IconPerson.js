import L from 'leaflet';

const iconPerson = new L.Icon({
    iconUrl: '/v1/map/img/person-location.svg',
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export { iconPerson };