import React from "react";
import { Field, Form, Formik } from "formik";

const Home = () => {
  return (
    <div>
      <h1>Simple Form</h1>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
        }}
      ></Formik>
    </div>
  );
};

export default Home;
