import React, { useState, useEffect } from "react";

export const AppraisalPage = (props) => {
  const [vin, setVin] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [iframeHeight, setIframeHeight] = useState("1800px");
  const [navHeight, setNavHeight] = useState(0);
  const [isIframeScroll, setIsIframeScroll] = useState(false);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.origin.includes("jotform")) {
        try {
          const { type, height } = JSON.parse(event.data);

          if (type === "setHeight") {
            setIframeHeight(`${height}px`);
          } else if (type === "scrollIntoView") {
            // Detect iframe-triggered scrolling
            setIsIframeScroll(true);

            const iframe = document.querySelector("iframe");
            if (iframe) {
              const iframeTop = iframe.getBoundingClientRect().top + window.scrollY - navHeight;
              window.scrollTo({ top: iframeTop, behavior: "smooth" });
            }

            // Reset iframe scroll detection after a short delay
            setTimeout(() => setIsIframeScroll(false), 300);
          }
        } catch (error) {
          console.error("Error parsing iframe message:", error);
        }
      }
    };

    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [navHeight]);

  useEffect(() => {
    // Allow normal scrolling unless triggered by the iframe
    const preventIframeScroll = (event) => {
      if (isIframeScroll) {
        event.preventDefault();
      }
    };

    window.addEventListener("scroll", preventIframeScroll, { passive: false });

    return () => {
      window.removeEventListener("scroll", preventIframeScroll);
    };
  }, [isIframeScroll]);

  const handleVinChange = (event) => {
    const inputVin = event.target.value;
    setVin(inputVin);

    if (inputVin.length === 17) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVIN/${inputVin}?format=json`)
        .then((response) => response.json())
        .then((data) => {
          const carYear = data.Results.find((item) => item.Variable === "Model Year")?.Value || "N/A";
          const carMake = data.Results.find((item) => item.Variable === "Make")?.Value || "N/A";
          const carModel = data.Results.find((item) => item.Variable === "Model")?.Value || "N/A";

          setVehicleData({ carYear, carMake, carModel });
        })
        .catch((error) => {
          console.error("Error fetching VIN data:", error);
        });
    }
  };

  const handleConfirmVehicle = () => {
    setShowForm(true);
  };

  const handleManualEntry = () => {
    setShowForm(true);
  };

  const prepopulateUrl = () => {
    if (vehicleData) {
      const { carYear, carMake, carModel } = vehicleData;
      return `https://form.jotform.com/250125180075245?vin=${vin}&carYear=${carYear}&carMake=${carMake}&carModel=${carModel}`;
    }
    return "https://form.jotform.com/250125180075245";
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        paddingTop: `${navHeight}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "50px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fdf4e3",
          color: "#000",
          width: "80%",
          maxWidth: "1200px",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Get Your Instant Appraisal</h1>
          {!showForm && (
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Enter Your VIN:</h2>
              <input
                type="text"
                value={vin}
                onChange={handleVinChange}
                placeholder="Enter 17-character VIN"
                style={{
                  margin: "10px auto",
                  padding: "10px",
                  width: "100%",
                  maxWidth: "400px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                }}
              />
              {vehicleData && (
                <div style={{ marginTop: "10px" }}>
                  <h3>
                    <strong>Vehicle Found: </strong>
                    {vehicleData.carYear} {vehicleData.carMake} {vehicleData.carModel}
                  </h3>
                </div>
              )}
              {vehicleData && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={handleConfirmVehicle}
                    style={{
                      margin: "10px",
                      padding: "10px 20px",
                      fontSize: "1rem",
                      color: "#fff",
                      backgroundColor: "#007bff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    This is my Vehicle
                  </button>
                  <button
                    onClick={handleManualEntry}
                    style={{
                      margin: "10px",
                      padding: "10px 20px",
                      fontSize: "1rem",
                      color: "#fff",
                      backgroundColor: "#6c757d",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Enter My Info Manually
                  </button>
                </div>
              )}
            </div>
          )}
          {showForm && (
            <iframe
              src={prepopulateUrl()}
              style={{
                width: "100%",
                height: iframeHeight,
                border: "none",
                marginTop: "10px",
              }}
              title="Get Your Appraisal"
              allowTransparency="true"
              scrolling="yes"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppraisalPage;