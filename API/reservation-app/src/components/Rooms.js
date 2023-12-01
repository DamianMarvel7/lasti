import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  UnorderedList,
  CircularProgress,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import useReservation from "../hooks/useReservation";
import ReserveForm from "./ReserveForm";
import useRooms from "../hooks/useRoom";

const Rooms = () => {
  const { rooms, isLoading, error, formData, setFormData, updateFormData } =
    useRooms();
  const { data, postData, fetchData } = useReservation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e, name) => {
    if (name === "total" || name === "jumlah_orang") {
      updateFormData(name, e);
    } else {
      if (e && e.target) {
        const { value, type, checked } = e.target;

        if (type === "checkbox" && name === "peralatan_khusus") {
          const updatedPeralatanKhusus = checked
            ? [...formData.peralatan_khusus, value]
            : formData.peralatan_khusus.filter((id) => id !== value);

          updateFormData(name, updatedPeralatanKhusus);
        } else {
          updateFormData(name, value);
        }
      }
    }
  };

  const handleOpen = (jenisRuang) => {
    updateFormData("jenis_ruang_id", jenisRuang);
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await postData(formData);
    console.log(formData, result);
    if (result.success) {
      await fetchData();
    } else {
      console.error("Error submitting form:", result.error);
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress isIndeterminate color="teal.300" />
        <Text mt={4}>Loading rooms...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={8} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  console.log(formData);
  return (
    <Box mt={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={4}></Heading>
      {rooms.length > 0 ? (
        <List spacing={4} maxW="lg" mx="auto">
          {rooms.map((room) => (
            <ListItem key={room.jenis_ruang_id}>
              <Box
                borderWidth="1px"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                bg="white"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.02)" }}
              >
                <Heading as="h2" size="lg">
                  {room.nama}
                </Heading>
                <Text>Capacity: {room.kapasitas}</Text>
                <Text>Facilities:</Text>
                <UnorderedList>
                  {room.fasilitas.map((facility, index) => (
                    <ListItem key={index}>{facility}</ListItem>
                  ))}
                </UnorderedList>
                <Text fontWeight="bold">Price: {room.harga}</Text>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Reserve</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <ReserveForm
                        jenisRuang={formData.jenis_ruang_id}
                        setFormData={setFormData}
                        formData={formData}
                        handleInputChange={handleChange}
                        handleSubmit={handleSubmit}
                        isUpdate={true}
                        onClose={onClose}
                      />
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                  </ModalContent>
                </Modal>
                <Button
                  colorScheme="blue"
                  onClick={() => handleOpen(room.jenis_ruang_id)}
                >
                  Reserve
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text textAlign="center" mt={4}>
          No rooms available.
        </Text>
      )}
    </Box>
  );
};
export default Rooms;
