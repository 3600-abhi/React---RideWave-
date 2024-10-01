import { useEffect, useRef, useState } from 'react';
import { ServerConfig } from '../config';
import carImg from "../asset/carImg.png";
import passengerImg from "../asset/passengerImg.png";
import { LocationApi } from "../apis";
import { useSelector } from 'react-redux';

function PassengerNearByDriversOnMap() {

    const userInfo = useSelector(store => store.user.userInfo);

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [platform, setPlatform] = useState(null);

    const [passengerCoord, setPassengerCoord] = useState({
        latitude: null,
        longitude: null
    });

    const [nearbyDriversList, setNearbyDriversList] = useState([]);


    useEffect(() => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("latitude :: ", latitude);
                console.log("longitude :: ", longitude);

                setPassengerCoord({
                    latitude: latitude,
                    longitude: longitude
                });

                LocationApi.getNearByDriverList({ latitude, longitude })
                    .then(response => {
                        const nearbyOtherDriverList = response.data.filter(driver => (driver.driverId !== userInfo.userId));
                        console.log("nearbyOtherDriverList :: ", nearbyOtherDriverList);
                        setNearbyDriversList(nearbyOtherDriverList);
                    });

            },
            (error) => {
                console.error(error);
            }
        );
    }, [userInfo.userId]);



    useEffect(() => {
        if (passengerCoord.latitude && passengerCoord.longitude) {
            const platformInstance = new window.H.service.Platform({
                apikey: ServerConfig.HERE_MAP_API_KEY
            });

            setPlatform(platformInstance);

            const defaultLayers = platformInstance.createDefaultLayers();

            console.log("passengerCoord :: ", passengerCoord);

            const mapInstance = new window.H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 14,
                    center: { lat: passengerCoord.latitude, lng: passengerCoord.longitude }
                }
            );

            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));
            window.H.ui.UI.createDefault(mapInstance, defaultLayers);

            setMap(mapInstance);
        }
    }, [passengerCoord]);



    useEffect(() => {
        if (map && platform) {
            map.removeObjects(map.getObjects());

            const passengerIcon = new window.H.map.Icon(passengerImg, { size: { w: 32, h: 32 } });
            const carIcon = new window.H.map.Icon(carImg, { size: { w: 32, h: 32 } });


            if (passengerCoord.latitude && passengerCoord.longitude) {
                const passengerMarker = new window.H.map.Marker(
                    { lat: passengerCoord.latitude, lng: passengerCoord.longitude },
                    { icon: passengerIcon }
                );
                map.addObject(passengerMarker);
            }


            nearbyDriversList.forEach(driver => {
                if (driver.latitude && driver.longitude) {
                    const carMarker = new window.H.map.Marker(
                        { lat: driver.latitude, lng: driver.longitude },
                        { icon: carIcon }
                    );
                    map.addObject(carMarker);
                }
            });
        }
    }, [passengerCoord, nearbyDriversList, map, platform]);

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

export default PassengerNearByDriversOnMap;
