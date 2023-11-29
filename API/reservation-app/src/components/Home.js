// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';


const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToRooms = () => {
    navigate('/rooms'); // This function will navigate to the /rooms route
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="xl" mb={4}>
        Home Page
      </Heading>
      <Text>Welcome to the home page of the Fitness Coaching App!</Text>
      <Button
        mt={4}
        colorScheme="blue"
        size="lg"
        fontSize="md"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Button
        mt={4}
        colorScheme="blue"
        size="lg"
        fontSize="md"
        onClick={goToRooms}
      >
        See Available Rooms
      </Button>
    </Box>
  );
};

export default Home;
