import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const Map = ({ zoom, coordinates }) => {
  return (
    <MapContainer
      center={coordinates}
      zoom={zoom}
      style={{ height: '5px', width: '5px' }} // Set the desired size of the map
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
      />
    </MapContainer>
  );
};

export default Map;
