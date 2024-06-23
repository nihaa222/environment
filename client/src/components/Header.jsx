import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, NavbarToggle } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;

  const handleSignOut = async () => {
    const res = await fetch("/api/user/signout", {
      method: "POST",
    });
    const data = await res.json();
    dispatch(signoutSuccess());
    console.log(data);
  };

  useEffect(() => {
    const heading = document.querySelector(".container");
    if (heading) {
      heading.style.minWidth = "300px"; // Correct way to set style in React
      // Correct way to set style in React
    }
  }, []);

  return (
    <div className="  lg:px-20 bg-green-100 mx-auto  p-1 ">
      <Navbar
        className="py-1 max-w-[1300px] mx-auto  bg-green-100 flex justify-between items-center"
        id="navbar-sticky"
      >
        <Link to="/">
          <div className="flex gap-1 items-center justify-between  ">
            <img className="w-10 h-10 " src="/envilogo.png" alt="Logo" />
            <span className="font-semibold text-lg  text-green-800">
              EcoHub
            </span>
          </div>
        </Link>

        <div className="flex md:order-2 z-50 ">
          {currentUser ? (
            <Dropdown
              inline
              arrowIcon={false}
              label={
                <Avatar
                  img={currentUser.image}
                  alt="avatar of current User"
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
              </Dropdown.Header>
              <Link to="/profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Link to={`/dashboard/${currentUser._id}`}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>

              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              {path === "/sign-in" ? (
                <Link to="/sign-up">
                  <Button pill color="success">
                    SignUp
                  </Button>
                </Link>
              ) : (
                <Link to="/sign-in">
                  <Button pill color="success">
                    Login
                  </Button>
                </Link>
              )}
            </>
          )}
          <NavbarToggle height="0.2em" />
        </div>

        <Navbar.Collapse>
          <Navbar.Link
            active={path === "/"}
            className={path === "/" ? "active-link" : ""}
            as={"div"}
          >
            <Link to="/" className="text-sm">
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/initiatives"} as={"div"}>
            <Link
              to="/initiatives
            "
              className="text-sm"
            >
              Initiatives
            </Link>
          </Navbar.Link>

          <Navbar.Link active={path === "/map"} as={"div"}>
            <Link to="/map" className="text-sm">
              Map
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
