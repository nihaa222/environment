import React, { useRef, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Alert, Button } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateStart, updateFailure, updateSuccess } from "../redux/userSlice";
import { useDispatch } from "react-redux";
const MAX_BIO_LENGTH = 50;

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const bioRef = useRef(null);
  const imgRef = useRef();
  const formik = useFormik({
    initialValues: {
      named: currentUser ? currentUser.named : "",
      title: currentUser ? currentUser.title : "",
      email: currentUser ? currentUser.email : "",
      username: currentUser ? currentUser.username : "",
      bio: currentUser ? currentUser.bio : "",
      image: currentUser ? currentUser.image : "",
    },
    onSubmit: async (values, onSubmitProps) => {
      onSubmitProps.setSubmitting(false);
      console.log("Form data", values);
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          dispatch(updateFailure(data.message));
        } else {
          dispatch(updateSuccess(data));
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
      }
    },

    validate: (values) => {
      let errors = {};
      if (!values.named) {
        errors.named = "Required";
      }
      if (!values.title) {
        errors.title = "Required";
      }
      if (!values.username) {
        errors.username = "Required";
      }
      if (values.bio.length > MAX_BIO_LENGTH - 1) {
        errors.bio = "0";
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(values.email)) {
        errors.email = "Invalid Email";
      } else if (!values.email) {
        errors.email = "Required";
      }
      return errors;
    },
    validateOnMount: true,
  });

  console.log("errors", formik.errors);

  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  console.log(imageFileUrl);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(snapshot.bytesTransferred);
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("(File must be less than 300kb)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUploadProgress(null);
          setImageFileUrl(downloadURL);
          setImageFileUploadError(null);
          formik.setFieldValue("image", downloadURL);
        });
      }
    );
  };

  return (
    <>
      <img
        className="hidden md:inline absolute  -left-20 "
        src="/sideleaf2rotate.png"
      ></img>
      <div className="max-w-6xl   mx-auto px-5 pt-8 rounded-xl my-8 border-2 ">
        <form
          onSubmit={formik.handleSubmit}
          className="backdrop-blur-sm relative grid grid-cols-1 md:grid-cols-2 px-10 gap-10 items-center w-full"
        >
          <div className="justify-self-start w-full order-1 md:order-none">
            <h1 className="font-bold text-xl mb-8">My Profile</h1>
            <div className="form-outline items-center">
              <label htmlFor="named">
                <span className="mr-3">Name:</span>
              </label>
              <input
                value={formik.values.named}
                id="named"
                className="rounded-xl w-full flex-1 text-gray-600"
                type="text"
                name="named"
                onChange={formik.handleChange}
              />
              {formik.errors.named && (
                <Alert color="failure">{formik.errors.named}</Alert>
              )}
            </div>
            <div className="form-outline items-center">
              <label htmlFor="fullname">
                <span className="mr-3">Title:</span>
              </label>
              <input
                value={formik.values.title}
                id="title"
                className="rounded-xl w-full flex-1 text-gray-600"
                type="text"
                name="title"
                onChange={formik.handleChange}
              />
              {formik.errors.title && (
                <Alert color="failure">{formik.errors.title}</Alert>
              )}
            </div>

            <div className="form-outline items-center">
              <label htmlFor="username">
                <span className="mr-3">Username:</span>
              </label>
              <input
                value={formik.values.username}
                className="rounded-xl w-full flex-1 text-gray-600"
                type="text"
                id="username"
                name="username"
                onChange={formik.handleChange}
              />
              {formik.errors.username && (
                <Alert color="failure">{formik.errors.username}</Alert>
              )}
            </div>
            <div className="form-outline  items-center">
              <label htmlFor="email">
                <span className="mr-3">Email:</span>
              </label>
              <input
                value={formik.values.email}
                className="rounded-xl w-full flex-1 text-gray-600"
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
              />
              {formik.errors.email && (
                <Alert color="failure">{formik.errors.email}</Alert>
              )}
            </div>
            <div className="form-outline flex-col">
              <label htmlFor="bio" className="mb-1">
                <span className="mr-3">Bio:</span>
              </label>
              <textarea
                value={formik.values.bio}
                ref={bioRef}
                className="rounded-xl w-full flex-1 text-gray-600"
                id="bio"
                name="bio"
                onChange={formik.handleChange}
              />

              <div className="w-full">
                <p className="text-xs">
                  {formik.errors.bio ? (
                    <span className="text-red-500">{formik.errors.bio}</span>
                  ) : (
                    MAX_BIO_LENGTH -
                    (formik.values.bio ? formik.values.bio.length : 0)
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-col-1 gap-4  form-outline">
            <div className=" justify-self-center md:justify-self-end">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                ref={imgRef}
                className="hidden "
                // Remove value binding for file input
              />

              <div
                className="cursor-pointer relative rounded-full justify-self-center flex flex-col h-44 w-44 shadow-md overflow-hidden"
                onClick={() => imgRef.current.click()}
              >
                {imageFileUploadingProgress && (
                  <CircularProgressbar
                    value={imageFileUploadingProgress || 0}
                    text={`${imageFileUploadingProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(63,152,199, ${
                          imageFileUploadingProgress / 100
                        })                  `,
                      },
                    }}
                  />
                )}
                <img
                  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                    imageFileUploadingProgress &&
                    imageFileUploadingProgress < 100 &&
                    "opacity-60"
                  }`}
                  src={imageFileUrl ? imageFileUrl : currentUser.image}
                />
              </div>
              <img
                className=" -top-24 md:top-64 absolute w-[180px] "
                src="leafone.png"
              ></img>
            </div>
            <div className="">
              {imageFileUploadError && (
                <Alert className="" color="failure">
                  {imageFileUploadError}
                </Alert>
              )}
            </div>
          </div>
          <div className="md:justify-self-end justify-self-center order-1">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              color="success"
              pill
              size="lg"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
