import React, { useEffect, useState } from "react";
import { CONSTANT } from "./constant";

interface ArtistData {
  _id: string;
  speciality: string;
  about: string;
  name: string;
  email: string;
}

const App = () => {
  const { USER } = CONSTANT;
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ArtistData[]>([]);
  const [header, setHeader] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${USER}/data`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const { success, artist } = await response.json();

      if (!success) {
        throw new Error("Failed to fetch data");
      }

      const requiredData: ArtistData[] = artist.map((art: any) => ({
        _id: art?._id,
        speciality: art?.speciality,
        about: art?.about,
        name: art?.name,
        email: art?.email,
      }));

      if (requiredData.length > 0) {
        const headers = Object.keys(requiredData[0]);
        setHeader(headers);
        setData(requiredData);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    selectedFile && setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    if (!file) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("uploadfile", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${USER}/upload-file`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      await fetchData();
    } catch (error: any) {
      setError(error?.message || "An error occurred while uploading file");
    } finally {
      setDisabled(false);
    }
  };

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div>Error {error}</div>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "#007bff",
            color: "#fff",
            border: "none",
          }}
          onClick={() => {
            window?.location.reload();
          }}
        >
          Refresh
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="container" style={{ margin: "20px 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Upload Excel File
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ textAlign: "center" }}
      >
        <input
          type="file"
          name="excelFile"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "#007bff",
            color: "#fff",
            border: "none",
          }}
          disabled={disabled}
        >
          Upload
        </button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {data.length > 0 && (
        <div>
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Fetched Data
          </h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Below is the data fetched from the backend:
          </p>
          <table
            style={{
              margin: "auto",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr style={{ background: "#007bff", color: "#fff" }}>
                {header.map((key, i) => (
                  <th
                    key={i}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "transparent" : "#f9f9f9",
                  }}
                >
                  {Object.values(item).map((value, index) => (
                    <td
                      key={index}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
