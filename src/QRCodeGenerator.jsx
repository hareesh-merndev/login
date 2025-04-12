import "./App.css";

import { useState } from "react";

export const QRCodeGenerator = ({ user, setUser }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);

    fetch(`/api/qrcode?text=${encodeURIComponent(text)}`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }
        return response.json();
      })
      .then((data) => setImageUrl(data.imageUrl))
      .catch((error) => {
        console.error("Failed to get QR!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="qrcode-generator-container">
      <div className="header">
        <h3>Welcome {user.name}</h3>
        <button
          className="logout-button"
          onClick={() => {
            setUser(null);
          }}
        >
          Logout
        </button>
      </div>
      <div className="input-container">
        <textarea
          className="text-input"
          type="text"
          value={text}
          placeholder="Enter Text"
          onChange={(e) => setText(e.target.value)}
          maxLength={2096}
        />
        <button
          className="submit-button"
          onClick={onSubmit}
          disabled={loading || !text.trim()}
        >
          {loading ? "Generating..." : "Submit"}
        </button>
      </div>
      <div className="output-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : !imageUrl ? (
          <div className="placeholder">Enter Text & Click Submit</div>
        ) : (
          <div className="qr-code-container">
            <img src={imageUrl} alt="Generated QR Code" />
            <button
              className="download-button"
              onClick={() => {
                const a = document.createElement("a");
                a.href = imageUrl;
                a.download = "qrcode.png";
                a.click();
              }}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};