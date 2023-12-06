import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Input,
  Stack,
  Checkbox,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import useReservation from "../hooks/useReservation";

const ReserveForm = ({
  jenisRuang,
  formData,
  handleInputChange,
  handleSubmit,
  isUpdate,
  onClose,
}) => {
  const { data, dataAlat } = useReservation();

  const calculateTotalPrice = (selectedTools) => {
    let totalPrice = 0;
    if (selectedTools) {
      if (Array.isArray(dataAlat)) {
        for (const selectedTool of selectedTools) {
          const toolPrice = dataAlat.find(
            (price) => price.nama === selectedTool
          );

          if (toolPrice) {
            totalPrice += toolPrice.harga;
          }
        }
      } else {
        console.error("dataAlat is not an array");
      }

      return totalPrice;
    } else {
      return 0;
    }
  };


  const hargaAlat = calculateTotalPrice(formData.peralatan_khusus);
  const hargaRuang = jenisRuang == "54321" ? 150000 : 100000;

  useEffect(() => {
    handleInputChange(hargaAlat + hargaRuang, "total");
  }, [hargaRuang, hargaAlat]);

  const renderHourOptions = (inputDate) => {
    const reservedTimes = getReservedTimesByDate(inputDate);
    const availableHours = [];

    for (let i = 8; i <= 20; i++) {
      const hour = `${i}:00:00`;
      if (!reservedTimes.includes(hour)) {
        availableHours.push(
          <option key={i} value={hour}>
            {hour}
          </option>
        );
      }
    }

    return availableHours;
  };

  function getReservedTimesByDate(inputDate) {
    if (!data) {
      return [];
    }
    const reservedTimes = data
      .filter((reservation) => reservation.date === inputDate && reservation.jenis_ruang_id==formData.jenis_ruang_id)
      .map((reservation) => reservation.time);
    return reservedTimes;
  }

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, isUpdate)}>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleInputChange(e, "date")}
            min={getTomorrowDate()}
            isRequired
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="hourSelect">Select Hour:</FormLabel>
          <Select
            id="hourSelect"
            name="time"
            value={formData.time}
            onChange={(e) => handleInputChange(e, "time")}
            placeholder="Select hour"
            isRequired
            isDisabled={!formData.date}
          >
            {renderHourOptions(formData.date)}
          </Select>{" "}
          <FormHelperText>Input the date first</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Jumlah Orang</FormLabel>
          <NumberInput
            name="jumlah_orang"
            value={formData.jumlah_orang}
            min={0}
            onChange={(value) => handleInputChange(value, "jumlah_orang")}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Peralatan Khusus</FormLabel>
          <Stack spacing={5} direction="row" name="peralatan_khusus">
            <Checkbox
              value="whiteboard"
              isChecked={formData.peralatan_khusus.includes("whiteboard")}
              onChange={(e) => handleInputChange(e, "peralatan_khusus")}
            >
              Whiteboard
            </Checkbox>
            <Checkbox
              value="printer"
              isChecked={formData.peralatan_khusus.includes("printer")}
              onChange={(e) => handleInputChange(e, "peralatan_khusus")}
            >
              Printer
            </Checkbox>
            <Checkbox
              value="proyektor"
              isChecked={formData.peralatan_khusus.includes("proyektor")}
              onChange={(e) => handleInputChange(e, "peralatan_khusus")}
            >
              Proyektor
            </Checkbox>
            <Checkbox
              value="speaker"
              isChecked={formData.peralatan_khusus.includes("speaker")}
              onChange={(e) => handleInputChange(e, "peralatan_khusus")}
            >
              Speaker
            </Checkbox>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Metode Pembayaran</FormLabel>
          <Select
            name="metode_pembayaran"
            value={formData.metode_pembayaran}
            onChange={(e) => handleInputChange(e, "metode_pembayaran")}
          >
            <option value="transfer_bank">Transfer Bank</option>
            <option value="kartu_kredit">Kartu Kredit</option>
          </Select>
        </FormControl>
        <Input
          name="total"
          value={hargaRuang + hargaAlat}
          isRequired
          type="hidden"
        />
        <Text fontWeight="bold">Total Price: {hargaRuang + hargaAlat}</Text>

        <Button colorScheme="blue" margin="4" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ReserveForm;
