import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { HashLoader } from "react-spinners"; // Import the spinner

const App = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(""); // Store summary
  const [loading, setLoading] = useState(false); // State to control loading spinner

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check if the file is either PDF or Image
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setFile(file);
      setError("");
    } else {
      setError("Only PDF or Image files are allowed.");
      setFile(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "image/*": [],
    },
  });

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file before submitting.");
      return;
    }

    setLoading(true); // Start loading when submit is clicked
    const formData = new FormData();
    formData.append("file", file);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Assuming the summary is returned in response.data.summary
      setSummary(response.data.summary);
      setMessage(""); // Reset error if submission is successful
    } catch (error) {
      setMessage("");
      setError("Error uploading file.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Upload PDF or Image</h1>

      {/* Drag-and-Drop Area */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          width: "300px",
          margin: "20px auto",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop a PDF or image here, or click to select</p>
      </div>

      {/* Display Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the File Name */}
      {file && (
        <div>
          <h3>Selected File: {file.name}</h3>
        </div>
      )}

      {/* Display Loading Spinner */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',// Full viewport height
        }}>
          <HashLoader size={50} color="#36D7B7" loading={loading} />
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ padding: "10px 20px"  }} disabled={loading}>
        Upload File
      </button>

      {/* Display Upload Result Message */}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Display the Summary */}
      {summary && (
        <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <h2>Summary:</h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;
