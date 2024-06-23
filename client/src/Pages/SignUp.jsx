import { Alert, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  useEffect(() => {
    setError(null);
  }, []);
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(formdata);

  const handleNameChange = (e) => {
    const name = e.target.value.trim();
    const initial = name.split("")[0]?.toUpperCase() + name.slice(1);
    console.log(initial);
    console.log(initial);

    setFormData({ ...formdata, [e.target.id]: initial });
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value.trim();

    const unitial = username.split("")[0]?.toLowerCase() + username.slice(1);

    setFormData({ ...formdata, [e.target.id]: unitial });
  };
  const handleTitleChange = (e) => {
    const name = e.target.value.trim();
    const titial = name.split("")[0]?.toUpperCase() + name.slice(1);

    setFormData({ ...formdata, [e.target.id]: titial });
  };

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formdata.username && formdata.username.length > 8) {
      setError("Username should be less than or equal to 8 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div
      className=""
      style={{
        backgroundImage: 'url("/bg200.jpg")',
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
            SignUp form
          </div>
          <input
            id="named"
            type="text"
            placeholder="Name"
            className="input-text placeholder-white outline-none text-gray-800"
            onChange={handleNameChange}
          />
          <input
            id="title"
            type="text"
            placeholder="Title"
            className="input-text placeholder-white outline-none text-gray-800"
            onChange={handleTitleChange}
          />

          <input
            id="username"
            type="text"
            placeholder="username"
            autoComplete="off"
            className="input-text placeholder-white outline-none  text-gray-800"
            onChange={handleUsernameChange}
          />
          <input
            id="email"
            className="input-text placeholder-white text-gray-800"
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
          {error && <Alert color="failure">{error}</Alert>}
          <Button color="success" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
