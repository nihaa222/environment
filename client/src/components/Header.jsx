import React, { useEffect, useState } from "react";
import { Avatar, Button, Navbar, NavbarToggle } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;

  return (
    <div className="p-0 lg:px-20 2xl:px-96">
      <Navbar id="navbar-sticky">
        <Link to="/">
          <div className="flex gap-1 items-center justify-between">
            <img className="h-10 w-10" src="/envilogo.png" alt="Logo" />
            <span className="font-semibold text-sm sm:text-xl text-green-800">
              EcoHub
            </span>
          </div>
        </Link>

        <div className="flex md:order-2">
          {currentUser ? (
            <Link to="/profile">
              <Avatar
                img={currentUser.image}
                alt="avatar of current User"
                rounded
              />
            </Link>
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
          <NavbarToggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link
            active={path === "/"}
            className={path === "/" ? "active-link" : ""}
            as={"div"}
          >
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/initiatives"} as={"div"}>
            <Link to="/initiatives">Initiatives</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/community"} as={"div"}>
            <Link to="/community">Community</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/map"} as={"div"}>
            <Link to="/map">Map</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
