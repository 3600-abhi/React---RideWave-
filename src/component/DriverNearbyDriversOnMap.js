import React, { useEffect, useRef, useState } from 'react';
import { ServerConfig } from '../config';
import carImg from "../asset/carImg.png";
import myCarImg from "../asset/myCarImg.png";
import { LocationApi } from "../apis";
import { useSelector } from 'react-redux';

function DriverNearByDriversOnMap() {

    const userInfo = useSelector(store => store.user.userInfo);

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [platform, setPlatform] = useState(null);

    const [driverCoord, setDriverCoord] = useState({
        latitude: null,
        longitude: null
    });

    const [nearbyDriversList, setNearbyDriversList] = useState([]);


    useEffect(() => {
        // setInterval(() => {

            console.log("Retrieving latitude & longitude");

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    console.log("latitude :: ", latitude);
                    console.log("longitude :: ", longitude);

                    if (latitude != driverCoord.latitude || longitude != driverCoord.longitude) {
                        setDriverCoord({
                            latitude: latitude,
                            longitude: longitude
                        });

                        LocationApi.getNearByDriverList({ latitude, longitude })
                            .then(response => {
                                const nearbyOtherDriverList = response.data.filter(driver => (driver.driverId !== userInfo.userId));
                                console.log("nearbyOtherDriverList :: ", nearbyOtherDriverList);
                                setNearbyDriversList(nearbyOtherDriverList);
                            });
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
        // }, 500000000);
    }, [userInfo.userId]);



    useEffect(() => {
        if (driverCoord.latitude && driverCoord.longitude) {
            const platformInstance = new window.H.service.Platform({
                apikey: ServerConfig.HERE_MAP_API_KEY
            });

            setPlatform(platformInstance);

            const defaultLayers = platformInstance.createDefaultLayers();

            console.log("driverCoord :: ", driverCoord);

            const mapInstance = new window.H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 14,
                    center: { lat: driverCoord.latitude, lng: driverCoord.longitude }
                }
            );

            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));
            window.H.ui.UI.createDefault(mapInstance, defaultLayers);

            setMap(mapInstance);
        }
    }, [driverCoord]);



    useEffect(() => {
        if (map && platform) {
            map.removeObjects(map.getObjects());

            const myCarIcon = new window.H.map.Icon(myCarImg, { size: { w: 32, h: 32 } });
            const othersCarIcon = new window.H.map.Icon(carImg, { size: { w: 32, h: 32 } });


            if (driverCoord.latitude && driverCoord.longitude) {
                const myCarMarker = new window.H.map.Marker(
                    { lat: driverCoord.latitude, lng: driverCoord.longitude },
                    { icon: myCarIcon }
                );
                map.addObject(myCarMarker);
            }


            nearbyDriversList.forEach(driver => {
                if (driver.latitude && driver.longitude) {
                    const othersDriverMarker = new window.H.map.Marker(
                        { lat: driver.latitude, lng: driver.longitude },
                        { icon: othersCarIcon }
                    );
                    map.addObject(othersDriverMarker);
                }
            });
        }
    }, [driverCoord, nearbyDriversList, map, platform]);

    return (
        <div>
            <h2>Drivers Location Map</h2>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '500px', margin: '10px' }}
            />
        </div>
    );
}

export default DriverNearByDriversOnMap;
