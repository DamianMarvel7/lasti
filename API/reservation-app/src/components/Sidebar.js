import React from 'react';
import { Box, Link, VStack, Text, Flex } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaDoorOpen } from 'react-icons/fa'; // Import icons
import './Sidebar.css';

const Sidebar = () => {
  return (
    <Box
      className="sidebar" // Added class name for styling
      w="250px" // Width
      bg="teal.500" // Background color
      h="100vh" // Full height
      color="white" // Text color
      p={4} // Padding
    >
      {/* Logo */}
      <Flex mb={4} justifyContent="center">
        <Text fontSize="xl" fontWeight="bold">
          My App
        </Text>
      </Flex>

      {/* Navigation Links */}
      <VStack spacing={3} align="stretch">
        <NavLink to="/home" activeClassName="active" className="nav-link">
          <Link as={Flex} align="center" fontSize="md" justifyContent="center">
            <FaHome size="1.2em" style={{ marginRight: '8px' }} /> Home
          </Link>
        </NavLink>
        <NavLink to="/rooms" activeClassName="active" className="nav-link">
          <Link as={Flex} align="center" fontSize="md" justifyContent="center">
            <FaDoorOpen size="1.2em" style={{ marginRight: '8px' }} /> Rooms
          </Link>
        </NavLink>
        {/* Additional Links */}
      </VStack>
    </Box>
  );
};

export default Sidebar;
