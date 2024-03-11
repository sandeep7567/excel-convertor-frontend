import React, { useEffect, useState } from "react";
import { CONSTANT } from "./constant";
import { useNavigate } from "react-router-dom";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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

      console.log(artist.length === 0);

      if (artist.length === 0) {
        setHeader([]);
        setData([]);
      };

      const requiredData: ArtistData[] = artist.map(
        (art: any, index: number) => ({
          No: index + 1,
          _id: art?._id,
          speciality: art?.speciality,
          about: art?.about,
          name: art?.name,
          email: art?.email,
        })
      );

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

  const onEditHandle = (id: string) => {

    navigate(`/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!file) {
      setError("No file selected");
      setIsSubmitting(false);
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
        throw new Error("please upload valid excel file");
      }
      console.log(response)

      await fetchData();
    } catch (error: any) {
      setError(error?.message || "An error occurred while uploading file");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            cursor: "pointer",
          }}
          disabled={isSubmitting || !file}
        >
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <br />
      <hr />

      {data.length > 0 && (
        <div>
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Fetched Artist Sheet Data
          </h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Below is the data fetched from the backend:
          </p>

          <table
            style={{
              margin: "auto",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              maxWidth: "1080px",
            }}
          >
            <thead>
              <tr style={{ background: "#007bff", color: "#fff" }}>
                {header.map((key, i) => {
                  if (i === 1) return;
                  return (
                    <th
                      key={i}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {key}
                    </th>
                  );
                })}
                <th style={{ padding: "10px", textAlign: "center" }}>...</th>
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
                  {Object.values(item).map((value: any, index) => {
                    if (index === 1) return;

                    return (
                      <td
                        key={index}
                        style={{ padding: "10px", border: "1px solid #ddd" }}
                      >
                        {value}
                      </td>
                    );
                  })}

                  <td
                    onClick={() => onEditHandle(item?._id)}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    edit
                  </td>

                  {/* {Object.values(item).map((value, index) => (
                    <td key={index} style={{ padding: "10px", border: "1px solid #ddd" }} >
                      <input
                        key={index}
                        type="text"
                        name=""
                        id=""
                        value={value}
                        onChange={e => e.target.value}
                        style={{ padding: "10px", border: "1px solid #ddd" }}
                      />
                    </td>
                  ))} */}
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
