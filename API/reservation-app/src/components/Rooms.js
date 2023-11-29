import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  UnorderedList,
  CircularProgress,
} from '@chakra-ui/react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/jenis-ruang'); // Update the endpoint
        setRooms(response.data);
        setIsLoading(false);
      } catch (error) {
        setError('Could not fetch rooms');
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

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

  return (
    <Box mt={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
        Available Rooms
      </Heading>
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
                _hover={{ transform: 'scale(1.02)' }}
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
