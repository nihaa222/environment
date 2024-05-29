import React, { useRef, useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
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

const initialValues = {
  fullname: "",
  email: "",
  username: "",
  bio: "",
  image: "",
};

const MAX_BIO_LENGTH = 200;
const validate = (values) => {
  let errors = {};
  if (!values.fullname) {
    errors.name = "Required";
  }

  return errors;
};

const onSubmit = (values, { resetForm }) => {
  console.log("Form data", values);

  resetForm();
};

const Profile = () => {
  const bioRef = useRef(null);
  const imgRef = useRef();

  const { currentUser } = useSelector((state) => state.user);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [remainingChars, setRemainingChars] = useState(MAX_BIO_LENGTH);
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
    const updateCharCount = () => {
      const remaining = MAX_BIO_LENGTH - bioRef.current.value.length;
      setRemainingChars(remaining);
    };

    bioRef.current.addEventListener("input", updateCharCount);

    return () => {
      bioRef.current.removeEventListener("input", updateCharCount);
    };
  }, []);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

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
        setImageFileUploadError("(File must be less than 2mb)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-5 my-20">
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        <Form className="grid grid-cols-1 md:grid-cols-2 px-10 gap-10 items-center w-full">
          <div className="justify-self-start w-full order-1 md:order-none">
            <h1 className="font-bold text-xl mb-10">My Profile</h1>
            <div className="form-outline items-center">
              <label htmlFor="fullname">
                <span className="mr-3">Full name:</span>
              </label>
              <Field
                className="rounded-xl w-full flex-1 text-gray-600"
                type="text"
                id="fullname"
                name="fullname"
              />
            </div>
            <div className="form-outline items-center">
              <label htmlFor="username">
                <span className="mr-3">Username:</span>
              </label>
              <Field
                className="rounded-xl flex-1 w-full"
                type="text"
                id="username"
                name="username"
              />
            </div>
            <div className="form-outline  items-center">
              <label htmlFor="email">
                <span className="mr-3">Email:</span>
              </label>
              <Field
                className="rounded-xl flex-1 w-full"
                type="text"
                id="email"
                name="email"
              />
            </div>
            <div className="form-outline flex-col">
              <label htmlFor="bio" className="mb-1">
                <span className="mr-3">Bio:</span>
              </label>
              <textarea
                ref={bioRef}
                className="rounded-xl w-full flex-1 mb-2"
                id="bio"
                name="bio"
              />
              <div className="w-full">
                <p className="text-xs text-gray-500">{remainingChars} left</p>
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
                        }`,
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
                  src={imageFileUrl || currentUser.image}
                />
              </div>
            </div>
            <div className="justify-self-center md:justify-self-end">
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
              className=""
              size="xl"
              gradientDuoTone="greenToBlue"
            >
              Update
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Profile;
