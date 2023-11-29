import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import axiosInstance from './axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate(); // Create a navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post('/register', formData);

      if (response.status === 200) {
        if (response.data && response.data.username) {
          setSuccessMessage('Registration successful. You can now log in.');
          navigate('/login');
        } else if (response.data) {
          setErrorMessage(response.data);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mt={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </FormControl>
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        {successMessage && <Text color="green.500">{successMessage}</Text>}
        <Button type="submit" mt={4} colorScheme="teal">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
