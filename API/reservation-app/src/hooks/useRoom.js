// useRooms.js
import { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { v4 as uuidv4 } from "uuid";

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get("/jenis-ruang");
        setRooms(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Could not fetch rooms");
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const [formData, setFormData] = useState({
    reservasi_id: uuidv4(),
    username: localStorage.getItem("username"),
    start_date: "",
    end_date: "",
    jenis_ruang_id: "",
    jumlah_orang: 0,
    peralatan_khusus: [],
    total: 0,
    metode_pembayaran: "transfer_bank",
  });

  const updateFormData = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  return {
    rooms,
    isLoading,
    error,
    formData,
    setFormData,
    updateFormData,
  };
};

export default useRooms;
