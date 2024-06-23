import { Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLocation } from "../redux/locationSlice";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form({ start, category, mapLng, mapLat, initiative }) {
  // console.log(mapLat, mapLng);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Extract start and category from URL parameters
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [city, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [locality, setLocality] = useState("");

  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const [urlCategory, setUrlCategory] = useState("");
  const [geocodingError, setGeoCoddingError] = useState("");
  //   categoryis there or not

  useEffect(() => {
    const CategoryfromUrl = urlParams.get("category");
    setUrlCategory(CategoryfromUrl);
  }, []);

  useEffect(() => {
    async function fetchCityData() {
      try {
        setIsLoadingGeoCoding(true);
        setGeoCoddingError("");
        const res = await fetch(
          `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else"
          );
        setCityName(data.city);
        setCountry(data.countryName);
        setLocality(data.locality);
        // console.log(data);
        // console.log(data.city);
      } catch (err) {
        setGeoCoddingError(err.message);
        setIsLoadingGeoCoding(false);
      }
    }
    fetchCityData();
  }, [mapLat, mapLng]);

  const [formbtn, setFormBtn] = useState(true);
  const [placebtn, setPlaceBtn] = useState(false);

  const handleForm = () => {
    setFormBtn(true);
    setPlaceBtn(false);
  };

  const handlePlace = () => {
    setPlaceBtn(true);
    setFormBtn(false);
  };

  const handleCityClick = ({ lat, lng }) => {
    navigate(`/map?lat=${lat}&lng=${lng}`);
  };

  const handleSubmit = () => {
    // console.log("Submitting form...");
    // console.log("Country:", country);
    // console.log("City Name:", city);
    // console.log("Locality:", locality);
    dispatch(setLocation({ country, city, locality, mapLat, mapLng }));

    navigate(`/create?location=true`);
  };

  // console.log(country, city, locality);
  return (
    <div>
      <div className="p-4 flex flex-col gap-3  overflow-auto">
        <div className="flex justify-center   items-center gap-4 p-5  md:p-10 overflow-auto">
          <div>
            <Button
              size="small"
              onClick={handleForm}
              color={formbtn ? "dark" : "gray"}
              className="w-fit "
            >
              FORM
            </Button>
          </div>
          <div>
            <Button
              size="small"
              color={placebtn ? "dark" : "gray"}
              onClick={handlePlace}
              className="w-fit "
            >
              PLACES
            </Button>
          </div>
        </div>

        {urlCategory && formbtn
          ? !geocodingError && (
              <>
                <div>
                  <label className="text-white text-xs md:text-sm">
                    City name
                  </label>
                  <TextInput
                    sizing="sm"
                    readOnly
                    value={city ? city : "none"}
                  />
                </div>
                <div className="">
                  <label className="text-white text-xs md:text-sm">
                    Locality
                  </label>
                  <TextInput
                    sizing="sm"
                    type="text"
                    value={locality ? locality : "none"}
                    readOnly
                  />
                </div>
                <div className="hidden md:block">
                  <label className="text-white  text-xs md:text-sm">
                    Category
                  </label>
                  <TextInput
                    sizing="sm"
                    size="sm"
                    type="text text-xs md:text-sm"
                    value={category}
                    readOnly
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  size="sm"
                  className="mt-3"
                  color="dark"
                >
                  Submit
                </Button>
              </>
            )
          : !placebtn && (
              <>
                <p className="text-white text-center">
                  First Create a Initiative :)
                </p>
                <Link to="/create">
                  <Button
                    size="sm"
                    color="success"
                    className="w-fit  mx-auto"
                    pill
                  >
                    Create
                  </Button>
                </Link>

                {geocodingError && urlCategory && (
                  <p className="text-center text-white">{geocodingError}</p>
                )}
              </>
            )}
        {geocodingError && urlCategory && (
          <p className="text-white text-xs text-center">{geocodingError}</p>
        )}
      </div>
      {placebtn && (
        <div className="flex flex-wrap h-[200px] md:h-full justify-center overflow-y-auto  ">
          {initiative.map((place, index) => (
            <div key={index}>
              <Button
                color="light"
                onClick={() =>
                  handleCityClick({ lat: place.mapLat, lng: place.mapLng })
                }
                className="m-4"
              >
                <p className=" text-center mr-4 text-orange-600 ">
                  {place.city}
                </p>
                <p className=" text-center">{place.category}</p>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Form;
