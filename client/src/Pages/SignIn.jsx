import { Alert, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  console.log(errorMessage);
  const [formdata, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      dispatch(signInStart());
      e.preventDefault();
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        navigate("/");
        dispatch(signInSuccess(data));
      }
      console.log(data);
    } catch (error) {
      dispatch(signInFailure());
      return;
    }
  };

  return (
    <div
      className=""
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "2rem",
      }}
    >
      <div className="h-2/3 w-2/3  lg:w-1/2   bg-white bg-opacity-10 rounded-2xl shadow-2xl border border-r-0 border-b-0 border-opacity-30 backdrop-filter backdrop-blur-md">
        <form
          className="h-full flex flex-col justify-evenly items-center"
          onSubmit={handleSubmit}
        >
          <div className="px-20 text-green-700 text-2xl tracking-wider">
            Login form
          </div>

          <input
            id="email"
            className="input-text placeholder-white"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <input
            id="password"
            className="input-text placeholder-white"
            type="password"
            placeholder="password"
            onChange={handleChange}
          />
          {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
          <Button color="success" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
