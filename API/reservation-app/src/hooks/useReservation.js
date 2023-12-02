import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios
import axiosInstance from "../components/axiosInstance";

const useReservation = () => {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("tokenCore");

  const [data, setData] = useState();
  const [dataAlat, setDataAlat] = useState("temp");
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetchData();
  //   fetchDataAlat();
  // }, [token, username]);

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
      const response = await axiosInstance.post("/reservasi", formData);
      console.log("Form submitted successfully:", response.data);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting form:", error);
      return { success: false, error };
    }
  };

  // const updateData = async (url, formData) => {
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   };

  //   console.log(formData);
  //   formData["Customer_ID"] = data["Customer_ID"];
  //   console.log(formData);

  //   try {
  //     const response = await axios.put(url + username, formData, { headers });
  //     console.log("Data updated successfully:", response.data);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //     return { success: false, error };
  //   }
  // };

  // const deleteData = async (url) => {
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   };
  //   try {
  //     const response = await axios.delete(url, { headers });
  //     setData("temp");
  //     console.log("Data deleted successfully:", response.data);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //     return { success: false, error };
  //   }
  // };

  return {
    data,
    dataAlat,
    error,
    token,
    username,
    postData,
    fetchData,
    // deleteData,
    // updateData,
  };
};

export default useReservation;
