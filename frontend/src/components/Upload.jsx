import React, { useState, useRef } from "react";
import { LuFileStack } from "react-icons/lu";
import Processing from "./Processing";
import axios from "axios";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Upload = ({ setPage, setUploadComplete, uploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const email = Cookies.get("sessionEmail");

  
  const acceptedFileExtensions = ["jpg", "jpeg", "png"];
  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (
      !acceptedFileExtensions.includes(file.name.split(".").pop().toLowerCase())
    ) {
      window.alert(
        `Only ${acceptedFileExtensions.join(", ")} files are allowed.`
      );
      return;
    }

    processFile(file);
  };

  const processFile = (file) => {
    const fileExtension = file?.name.split(".").pop().toLowerCase();

    if (!acceptedFileExtensions.includes(fileExtension)) {
      window.alert(
        `Only ${acceptedFileExtensions.join(", ")} files are allowed.`
      );
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
    setError("");
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleProcessSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload a file before processing.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("email", email); 
      formData.append("fileName", selectedFile.name);

      const apiResponse = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (apiResponse.status === 200) {
        setUploadComplete(uploadComplete + 1);
        setPage(
          "Conversation",
          apiResponse.data.data._id,
          apiResponse.data.data.uploadedImage
        );
      } else {
        setError(apiResponse.data.message || "Processing failed.");
      }
    } catch (error) {
      console.error("Error during file upload or processing:", error);
      setError("An error occurred while uploading or processing the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("sessionEmail", "sessionName");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return isLoading ? (
    <Processing downloading={true} />
  ) : (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "calc(100% - 10px)",
        height: "calc(100vh - 20px)",
        background: "#C2E7F2",
        margin: "10px 10px 10px 5px",
        borderRadius: "16px 16px 16px 16px",
        position: "relative",
      }}
    >
      <button
        title="Logout"
        className="btn btn-link"
        onClick={handleLogout}
        style={{
          color: "#004D66",
          fontSize: "1.5rem",
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
      >
        <FiLogOut />
      </button>

      <div
        className="card p-4 shadow-lg text-white"
        style={{
          height: "75%",
          width: "70%",
          background: "#aadbea",
          border: "5px dashed ghostwhite",
          borderRadius: "12px",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <div className="text-center">
            <h4 className="mb-4" style={{ color: "#004d66" }}>
              Uploaded File
            </h4>
            <div
              className="d-flex justify-content-between align-items-center border p-3 rounded"
              style={{ background: "#F0FCFF", color: "#004d66" }}
            >
              <span>{selectedFile.name}</span>
              <button
                type="button"
                className="btn btn-link text-danger p-0"
                onClick={handleFileDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="bi bi-x-lg"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M6 4l8 8M14 4l-8 8"
                  />
                </svg>
              </button>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleProcessSubmit}
              style={{ backgroundColor: "#004d66" }}
            >
              Process File
            </button>
          </div>
        ) : (
          <div
            className="text-center border rounded p-4"
            style={{
              background: "#F0FCFF",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <LuFileStack
              style={{ width: "35%", height: "35%", color: "#004D66" }}
            />
            <p style={{ color: "#004D66" }}>or</p>
            <button
              type="button"
              onClick={handleCustomButtonClick}
              className="btn"
              style={{
                backgroundColor: "#004D66",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1vw",
              }}
            >
              Upload File
            </button>

            <input
              type="file"
              id="file"
              name="image"
              accept={acceptedFileTypesString}
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileChange}
              onClick={(event) => (event.target.value = null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
