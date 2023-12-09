import { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";

const useReservation = () => {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("tokenCore");

  const [data, setData] = useState();
  const [dataAlat, setDataAlat] = useState("temp");
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchData();
    fetchDataAlat();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/reservasi");

      // console.log("GET request successful:");
      const data = response.data;
      setData(data);
    } catch (error) {
      console.error("Error in GET request:", error);
      setError(error);
    }
  };

  const fetchDataAlat = async () => {
    try {
      const response = await axiosInstance.get("/peralatan-khusus");

      // console.log("GET request successful:");
      const data = response.data;
      setDataAlat(data);
    } catch (error) {
      console.error("Error in GET request:", error);
      setError(error);
    }
  };

  const postData = async (formData) => {
    try {
      console.log("ASD")
      const response = await axiosInstance.post("/reservasi", formData);
      console.log("Form submitted successfully:", response.data);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting form:", error);
      return { success: false, error };
    }
  };

 

  return {
    data,
    dataAlat,
    error,
    token,
    username,
    postData,
    fetchData,

  };
};

export default useReservation;
