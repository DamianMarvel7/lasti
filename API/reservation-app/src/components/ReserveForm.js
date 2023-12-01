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
  const { dataAlat } = useReservation();

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
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, isUpdate)}>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={(e) => handleInputChange(e, "start_date")}
            isRequired
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={(e) => handleInputChange(e, "end_date")}
            isRequired
          />
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
          <FormLabel>End Date</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={(e) => handleInputChange(e, "end_date")}
            isRequired
          />
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
