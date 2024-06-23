import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Link, useLocation } from "react-router-dom";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  setInitiativeFailure,
  setInitiativeStart,
  setInitiativeSuccess,
} from "../redux/initiativeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addInitoDetail,
  addInitoUser,
  removeLocation,
} from "../redux/userSlice";
import { setremoveLocation } from "../redux/locationSlice";

const Create = () => {
  const { country, city, locality, mapLat, mapLng } = useSelector(
    (state) => state.location
  );
  // console.log(country, city, locality);
  const { currentUser } = useSelector((state) => state.user);
  const { initiative } = useSelector((state) => state.initiative);

  const locations = useLocation();
  const [locationInUrl, setLocationInUrl] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [imageUploadProgress, setImageUploadProgess] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      projecttitle: "",
      category: "",
      description: "",
      startdate: "",
      enddate: "",
      map: "",
      image: "",
      city: city || "", // Set default values in case the state is not available yet
      locality: locality || "",
      country: country || "",
      mapLat: "",
      mapLng: "",
      userId: currentUser?._id,
    },
    onSubmit: async (values, onSubmitProps) => {
      onSubmitProps.setSubmitting(false);
      try {
        dispatch(setInitiativeStart());
        const res = await fetch("/api/initiative/createInitiative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        console.log(data);
        navigate(
          `/initiative/${data.savedInitiative._id}/${data.savedInitiative.userId}`
        );
        dispatch(setInitiativeSuccess(data.savedInitiative));
        const latest = data.updateUser.initiatives.length;
        dispatch(addInitoUser(data.updateUser.initiatives[latest - 1]));
        // dispatch(addInitoDetail(data.updateUser.initiatives[latest - 1]));
        dispatch(
          setremoveLocation({
            country: " ",
            city: " ",
            locality: " ",
            mapLat: " ",
            mapLng: " ",
          })
        );

        // Remove the entire item from local storage
        localStorage.removeItem("formValues");
      } catch (error) {
        console.log(error);
        dispatch(setInitiativeFailure(error));
      }
    },

    validate: (values) => {
      const errors = {};
      if (!values.projecttitle && formik.touched.projecttitle)
        errors.projecttitle = "Required";
      if (!values.startdate && formik.touched.startdate)
        errors.startdate = "Required";
      if (!values.enddate && formik.touched.enddate)
        errors.enddate = "Required";
      if (!values.description && formik.touched.description)
        if (!values.category && formik.touched.category)
          errors.category = "Required";
      if (!values.category) errors.map = "Please set the category first";
      return errors;
    },
  });
  useEffect(() => {
    // console.log("setform", country, city, locality);
    formik.setValues({
      ...formik.values,
      city: city || "",
      locality: locality || "",
      country: country || "",
    });
  }, [country, city, locality]);
  // console.log(formik.values);

  useEffect(() => {
    const urlParams = new URLSearchParams(locations.search);
    const locationFromUrl = urlParams.get("location");
    setLocationInUrl(locationFromUrl);
  }, [locations]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    formik.setFieldValue(
      "projecttitle",
      title ? title.charAt(0).toUpperCase() + title.slice(1) : ""
    );
  };

  const handleDesChange = (e) => {
    const des = e.target.value;
    formik.setFieldValue(
      "description",
      des ? des.charAt(0).toUpperCase() + des.slice(1) : ""
    );
  };

  useEffect(() => {
    if (fileInput) {
      uploadImage();
    }
  }, [fileInput]);
  useEffect(() => {
    // Check if the city value has changed
    if (formik.values.city !== city) {
      formik.setFieldValue("city", city);
    }
    if (formik.values.country !== country) {
      formik.setFieldValue("country", country);
    }
    if (formik.values.locality !== locality) {
      formik.setFieldValue("locality", locality);
    }
    if (formik.values.mapLng !== mapLng) {
      formik.setFieldValue("mapLng", mapLng);
    }
    if (formik.values.mapLat !== mapLat) {
      formik.setFieldValue("mapLat", mapLat);
    }
  }, [city, country, formik]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + fileInput.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileInput);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgess(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("(File must be less than 300kb)");
        setImageUploadProgess(null);
        setFileInput(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploadError(null);
          setImageUploadProgess(100);
          formik.setFieldValue("image", downloadURL);
          formik.setSubmitting(false);
        });
      }
    );
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFileInput(file);
  };

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem("formValues"));
    // console.log(storedValues);
    if (storedValues) {
      formik.setValues(storedValues);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formik.values));
  }, [formik.values]);

  return (
    <>
      <div className="">
        <div className="gap-5 ">
          <img
            src="/sideleaf1.png"
            className="max-h-[120px] absolute -left-2 top-96 hidden md:inline"
            alt="Side Leaf 1"
          />
          <img
            src="/sideleaf2.png"
            className="max-h-[300px] absolute -right-20 hidden md:block overflow-hidden"
            alt="Side Leaf 2"
          />
        </div>
      </div>
      <div className="">
        <div className="max-w-[90%] md:max-w-[60%] mx-auto">
          <p className="text-center font-bold text-3xl mt-10">
            Create your Initiative
          </p>
          <form
            className="mt-5 border-2 pb-10 pt-10 px-7 md:px-16 lg:px-20 rounded-2xl bg-green-50 backdrop-blur-lg"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-outline">
              <label htmlFor="projecttitle">Title:</label>
              <div className="flex gap-3 flex-col lg:flex-row">
                <TextInput
                  color={formik.errors.projecttitle ? "failure" : ""}
                  id="projecttitle"
                  name="projecttitle"
                  onChange={handleTitleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.projecttitle}
                  className="flex-1"
                  sizing="sm"
                  helperText={
                    <>{formik.errors.projecttitle && <span>Required!</span>}</>
                  }
                />
              </div>
            </div>
            <div className="form-outline flex flex-col  lg:flex-row gap-2">
              <div className="flex gap-4 justify-center items-center flex-1 form-outline ">
                <div className="flex flex-col flex-1">
                  <FileInput
                    className="flex-1"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFileUploadError && (
                    <p className="text-red-600 mt-4 text-xs">
                      {imageFileUploadError}
                    </p>
                  )}
                </div>
                <input type="hidden" name="city" value={city}></input>
                <input type="hidden" name="country" value={country} />
                <input type="hidden" name="locality" value={locality} />

                <CircularProgressbar
                  className="h-10 w-10 "
                  value={imageUploadProgress || 0}
                  text={imageUploadProgress && `${imageUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    path: {
                      stroke: `rgba(63,152,199, ${imageUploadProgress / 100})`,
                    },
                  }}
                />
              </div>

              {!formik.values.category ? (
                <div>
                  <Button
                    disabled
                    required
                    className="w-full flex-1"
                    color="success"
                    sizing="sm"
                  >
                    Set Your Location
                  </Button>

                  <p className="text-red-700 text-xs">
                    Please set the category first
                  </p>
                </div>
              ) : (
                <Link
                  to={{
                    pathname: "/map",
                    search: `?startdate=${formik.values.startdate}&category=${formik.values.category}`,
                  }}
                >
                  <Button
                    required
                    className="w-full flex-1"
                    color="success"
                    name="map"
                    onChange={formik.handleChange}
                    value={formik.values.map}
                    sizing="sm"
                  >
                    {locationInUrl ? "Location Set" : "Set Your Location"}
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <div className="form-outline">
                <label htmlFor="startdate">
                  Start Date <span className="text-xs">(2024 only)</span>:
                </label>
                <input
                  className="w-full rounded-lg"
                  type="date"
                  id="startdate"
                  name="startdate"
                  value={formik.values.startdate}
                  onChange={formik.handleChange}
                />
                {formik.errors.startdate && (
                  <p className="text-red-700 text-xs">
                    {formik.errors.startdate}
                  </p>
                )}
              </div>
              <div className="form-outline">
                <label htmlFor="enddate">
                  End Date <span className="text-xs">(2024 only)</span>:
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg"
                  id="enddate"
                  name="enddate"
                  value={formik.values.enddate}
                  onChange={formik.handleChange}
                />
                {formik.errors.enddate && (
                  <p className="text-red-700 text-xs">
                    {formik.errors.enddate}
                  </p>
                )}
              </div>
            </div>
            <div className="form-outline">
              <label htmlFor="category">Category:</label>

              <Select
                size="md"
                id="category"
                name="category"
                onChange={formik.handleChange}
                required
                className="custom-select"
                value={formik.values.category}
              >
                <option>Select a category</option>
                <option>Sustainable Agriculture</option>
                <option>Renewable Energy Projects</option>
                <option>Waste Reduction and Recycling Programs</option>

                <option>Climate Action and Advocacy</option>
                <option>Environmental Education and Awareness</option>
                <option>Water Conservation</option>
                <option>Other</option>
              </Select>
              {formik.errors.category && (
                <p className="text-red-700 text-xs">{formik.errors.category}</p>
              )}
            </div>
            <div className="form-outline">
              <label htmlFor="description">Description:</label>
              <textarea
                className="w-full rounded-lg"
                type="text"
                id="description"
                name="description"
                onChange={handleDesChange}
                value={formik.values.description}
              ></textarea>
              {formik.errors.description && (
                <p className="text-red-700 text-xs">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                (imageUploadProgress !== 100 && imageUploadProgress !== 0)
              }
              color="success"
              pill
              size="lg"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
