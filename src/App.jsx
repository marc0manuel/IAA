import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header data={landingPageData.Header} />
               
                <About data={landingPageData.About} />
              <Services data={landingPageData.Services} />
                <Gallery data={landingPageData.Gallery} />
                <Testimonials data={landingPageData.Testimonials} />
                <Team data={landingPageData.Team} />
                <Contact data={landingPageData.Contact} />
              </>
            }
          />
          <Route path="/appraisal" element={<AppraisalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
