import { Alert, Button } from "flowbite-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      setError(null);
      e.preventDefault();
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/sign-in");
      }
      if (!res.ok) {
        setError(data.message);
        return;
      }
    } catch (error) {
      return setError(error.message);
    }
  };

  console.log(formdata);
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
            id="fullname"
            type="text"
            placeholder="Full Name"
            className="input-text placeholder-white outline-none"
            onChange={handleChange}
          />
          <input
            id="username"
            type="text"
            placeholder="username"
            className="input-text placeholder-white outline-none"
            onChange={handleChange}
          />
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
