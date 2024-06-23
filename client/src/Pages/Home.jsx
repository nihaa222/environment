import React from "react";
import { Field, Form, Formik } from "formik";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-green-50 w-screen relative   h-screen p-4 sm:p-8 md:p-16">
      <img
        className="absolute top-20 md:-top-10 -left-20 z-0 blur-sm"
        src="/sideleaf1.png"
      ></img>
      <img
        className="lg:absolute top-20 md:-top-10 -right-20 z-0 blur-sm hidden lg:block"
        src="/sideleaf1rotate.png"
        alt="Rotated leaf"
      />

      <div className="max-w-7xl  rounded-2xl   md:max-w-5xl mx-0 md:mx-auto  sm:p:20 md:p-24 flex flex-col gap-16 my-10 justify-center">
        <Button
          className="text-center text-bold text-white w-fit mx-auto"
          pill
          color="success"
        >
          <p>Discover and create the world</p>
        </Button>
        <p className="text-center text-4xl  md:text-6xl z-50  leading-snug font-semibold  mx-auto">
          The World's destination for Environmentalist's
        </p>
        <p className="text-center z-50   text-green-900">
          Navigate through the initiatives and participate to bring a change to
          the globe
        </p>
        <Link to="/initiatives">
          <Button color="success" className="w-fit mx-auto">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
