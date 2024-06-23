import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import { useGeoLocation } from "../hooks/useGeolocation";
import Form from "../components/Form";
import { Button, Modal } from "flowbite-react";
import { CiAlarmOn } from "react-icons/ci";

const Map = () => {
  const [initiate, setInitiate] = useState([]);
  console.log(initiate);
  useEffect(() => {
    const fetchInitiatives = async () => {
      const res = await fetch("/api/initiative/getInitiatives");
      const data = await res.json();

      setInitiate(data.initiatives);
    };
    fetchInitiatives();
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  const [mapPosition, setMapPosition] = useState(null);
  const mapLat = urlParams.get("lat");
  const mapLng = urlParams.get("lng");
  const start = urlParams.get("startdate");
  const category = urlParams.get("category");
  const [openModal, setOpenModal] = useState("true");

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    // Update mapPosition with geoLocationPosition once it's available
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      urlParams.set("lat", geoLocationPosition.lat);
      urlParams.set("lng", geoLocationPosition.lng);

      const searchQuery = urlParams.toString();
      navigate(`/map?${searchQuery}`);
    }
  }, [geoLocationPosition]);

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  return (
    <>
      <div className="min-w-screen max-h-screen max-w-full mx-5 mb-5 flex md:flex-row flex-col h-screen">
        <div className="md:w-2/5 h-2/5 w-full md:min-h-screen bg-gray-700">
          {/* Render the Form component */}
          <Form
            initiative={initiate}
            start={start}
            category={category}
            mapLng={mapLng}
            mapLat={mapLat}
          />
        </div>
        <div className="md:w-4/5 h-4/5 w-full md:h-screen z-20  bg-gray-300">
          {isLoadingPosition ? (
            "Loading..."
          ) : mapPosition ? (
            <MapContainer
              className="map"
              center={mapPosition || [40, 0]}
              zoom={7}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              {initiate.map((initiative, index) => (
                <Marker
                  key={index}
                  position={[initiative.mapLat || 40, initiative.mapLng || 0]}
                >
                  <Popup>
                    <span>{initiative.category}</span>
                  </Popup>
                </Marker>
              ))}
              <ChangeCenter position={mapPosition} />
              <DetectClick />
            </MapContainer>
          ) : null}
        </div>
      </div>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <CiAlarmOn className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Click on the map to set the location for you initiative?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setOpenModal(false)}>
                {"Ok"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const start = urlParams.get("startdate");
  const category = urlParams.get("category");
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      if (e.latlng) {
        navigate(
          `/map?lat=${e.latlng.lat}&lng=${e.latlng.lng}&startdate=${start}&category=${category}`
        );
      }
    },
  });
}

export default Map;
