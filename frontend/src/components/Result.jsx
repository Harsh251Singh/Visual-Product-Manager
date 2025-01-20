import React, { useEffect, useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import axios from "axios";
import "../css/Result.css";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSortAscending } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Result = ({ fileId }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [similarImages, setSimilarImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [threshold, setThreshold] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [overlayImage, setOverlayImage] = useState(null);
  const [showSliderValue, setShowSliderValue] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/images/similar/${fileId}`
        );
        const data = response.data;
        setUploadedImage(data.uploadedImage);
        setSimilarImages(data.similarImages);
      } catch (error) {
        console.error("Error fetching images:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [fileId]);

  useEffect(() => {
    const filtered = similarImages.filter(
      (image) => image.similarity >= threshold
    );
    const sorted = filtered.sort((a, b) => {
      return sortOrder === "ascending"
        ? a.similarity - b.similarity
        : b.similarity - a.similarity;
    });
    setFilteredImages(sorted);
  }, [similarImages, sortOrder, threshold]);

  const handleSortToggle = () => {
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "ascending" ? "descending" : "ascending"
    );
  };

  const handleThresholdChange = (value) => {
    setThreshold(parseFloat(value));
  };

  const handleLogout = () => {
    Cookies.remove("sessionEmail", "sessionName");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const openOverlay = (image) => {
    setOverlayImage(image);
  };

  const closeOverlay = () => {
    setOverlayImage(null);
  };

  const handleMouseDown = () => {
    setShowSliderValue(true);
  };

  const handleMouseUp = () => {
    setShowSliderValue(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="main">
      <button
        title="Logout"
        className="btn btn-link"
        onClick={handleLogout}
        style={{
          color: "#004d66",
          fontSize: "1.5rem",
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
      >
        <FiLogOut />
      </button>
      <div className="upper-container">
        <div className="image-card" onClick={() => openOverlay(uploadedImage)}>
          <img src={uploadedImage?.url} alt={uploadedImage?.name} />
        </div>
        <h4>{uploadedImage?.name || "Uploaded Image"}</h4>
      </div>
      <div className="lower-container">
        <h3 style={{ textAlign: "center", color: "#004d66" }}>
          Similar Images
        </h3>
        <div className="filter-container">
          <label title="Sort by Similarity">
            <AiOutlineSortAscending
              style={{ fontSize: "1.5rem", color: "#004d66" }}
            />
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={sortOrder === "descending"}
                onChange={handleSortToggle}
                id="sortToggle"
              />
              <span className="slider"></span>
            </div>
          </label>
          <div className="d-flex">
            <FaFilter style={{ marginRight: "10px", color: "#004d66" }} />
            <div
              className="slider-container"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <RangeSlider
                title="Sort by Range"
                style={{
                  cursor: "pointer",
                  "--bs-slider-track-color": "#004d66", 
                }}
                min={0.5}
                max={0.9}
                step={0.1}
                
                onChange={(e) => handleThresholdChange(e.target.value)}
              />
              {showSliderValue && (
                <div className="slider-value">{threshold.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>
        <div className="products">
          {filteredImages.map((image, index) => (
            <div
              className="product-card"
              key={index}
              onClick={() => openOverlay(image)}
            >
              <div className="image-card">
                <img src={image.base64} alt={image.filename} />
              </div>
              <div className="product-info">
                <div className="name" title={image.filename}>
                  {image.filename}
                </div>
                <div className="score">{image.similarity.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {overlayImage && (
        <div className="overlay">
          <img
            src={overlayImage?.base64 || overlayImage?.url}
            alt={overlayImage?.filename || overlayImage?.name}
          />
          <MdClose className="close-icon" onClick={closeOverlay} />
        </div>
      )}
    </div>
  );
};

export default Result;
