import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CONSTANT } from "../constant";

const EditExcelById = () => {
  const { USER } = CONSTANT;
  const { id } = useParams();

  const [formData, setFormData] = useState<any>({
    speciality: "",
    name: "",
    email: "",
    about: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${USER}/${id}`
        );
        setFormData(data?.artistById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, USER]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/${USER}/${id}`, formData);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data. Please try again later.");
    }
  };

  return (
    <section>
      <form style={{ maxWidth: "400px", margin: "100px auto" }} onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="speciality">Speciality</label>
          <input
            type="text"
            id="speciality"
            name="speciality"
            value={formData?.speciality || ""}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData?.name || ""}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData?.email || ""}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            readOnly
            // onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="about">About</label>
          <textarea
            id="about"
            name="about"
            value={formData?.about || ""}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            onChange={handleChange}
          />
        </div>
        
        <button
          type="submit"
          style={{
            backgroundColor: "#1c49cf",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
          }}
        >
          Update
        </button>
      </form>
    </section>
  );
};

export default EditExcelById;
