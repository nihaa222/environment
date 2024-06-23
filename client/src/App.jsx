import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Initiatives from "./Pages/Initiatives";
import Profile from "./Pages/Profile";
import Tracker from "./Pages/Tracker";
import Community from "./Pages/Community";
import Education from "./Pages/Education";
import Map from "./Pages/Map";
import Header from "./components/Header";

import PrivateRoute from "./components/PrivateRoute";
import Create from "./Pages/Create";
import { OneInitiative } from "./Pages/OneInitiative";
import { useEffect } from "react";
import DashBoard from "./Pages/DashBoard";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/initiative/:postid/:userid"
            element={<OneInitiative />}
          />
          <Route element={<PrivateRoute />}>
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/map" element={<Map />} />
            <Route path="/community" element={<Community />} />
            <Route path="/education" element={<Education />} />
            <Route path="/create" element={<Create />} />
            <Route path="/dashboard/:userId" element={<DashBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
