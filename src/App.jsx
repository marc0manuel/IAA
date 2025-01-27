import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import { AppraisalPage } from "./components/AppraisalForm";
import AboutUs from "./components/AboutUs";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get('path');

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  useEffect(() => {
    if (path) {
      // Redirect to the correct route
      window.location.href = path;
    }
  }, [path]);

  return (
    <div>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header data={landingPageData.Header} />
              <About data={landingPageData.About} />
              <Contact data={landingPageData.Contact} />
            </>
          }
        />
        <Route path="/appraisal" element={<AppraisalPage />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </div>
  );
};

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}