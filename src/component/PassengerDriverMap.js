import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ServerConfig } from '../config';
import carImg from "../asset/carImg.png";
import passengerImg from "../asset/passengerImg.png";


function PassengerDriverMap() {

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [platform, setPlatform] = useState(null);

    // State for the passenger and driver locations
    const [passengerLocation, setPassengerLocation] = useState({ lat: 52.5200, lng: 13.4050 }); // Default passenger location
    const [driverLocation, setDriverLocation] = useState({ lat: 52.5300, lng: 13.4050 }); // Default driver location

    useEffect(() => {

        // Initialize the HERE Maps platform
        const platformInstance = new window.H.service.Platform({
            apikey: ServerConfig.HERE_MAP_API_KEY
        });

        setPlatform(platformInstance);

        const defaultLayers = platformInstance.createDefaultLayers();

        // Initialize the map
        const mapInstance = new window.H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
                zoom: 14,
                center: { lat: 52.5200, lng: 13.4050 }  // Set initial center
            }
        );

        // Make the map interactive
        new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));
        window.H.ui.UI.createDefault(mapInstance, defaultLayers);

        setMap(mapInstance);
    }, []);

    // Effect to handle updating driver location on the map
    useEffect(() => {
        if (map && platform) {
            // Remove any existing markers
            map.removeObjects(map.getObjects());

            // Custom icons for passenger and driver
            const passengerIcon = new window.H.map.Icon(passengerImg, { size: { w: 32, h: 32 } });
            const driverIcon = new window.H.map.Icon(carImg, { size: { w: 32, h: 32 } });

            // Create markers for passenger and driver
            const passengerMarker = new window.H.map.Marker({ lat: passengerLocation.lat, lng: passengerLocation.lng }, { icon: passengerIcon });
            const driverMarker = new window.H.map.Marker({ lat: driverLocation.lat, lng: driverLocation.lng }, { icon: driverIcon });

            map.addObject(passengerMarker);
            map.addObject(driverMarker);


            // Draw polyline between passenger and driver
            const lineString = new window.H.geo.LineString();
            lineString.pushPoint({ lat: passengerLocation.lat, lng: passengerLocation.lng });
            lineString.pushPoint({ lat: driverLocation.lat, lng: driverLocation.lng });


            // Create the polyline
            const polyline = new window.H.map.Polyline(lineString, {
                style: { lineWidth: 4, strokeColor: 'rgba(0, 128, 255, 0.7)' }  // Customize line appearance
            });

            // Add the polyline to the map
            map.addObject(polyline);

            // Optionally, adjust the map to show both the driver and passenger
            map.getViewModel().setLookAtData({
                bounds: polyline.getBoundingBox()
            });
        }
    }, [passengerLocation, driverLocation, map, platform]);

    // Simulating fetching driver location from API (you can use WebSocket or another method)
    useEffect(() => {
        return;

        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get('/api/v1/driver/location'); // Replace with your API endpoint
                const { latitude, longitude } = response.data;

                setDriverLocation({ lat: latitude, lng: longitude });
            } catch (error) {
                console.error('Error fetching driver location:', error);
            }
        }, 5000);  // Poll every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h2>Driver Location Map</h2>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '500px' }}
            />
        </div>
    );
};

export default PassengerDriverMap;
