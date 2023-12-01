import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Stack,
  Button,
  Text,
  FormControl,
  FormLabel,
  Link, // Import Link from Chakra UI to create a link to the Register page
} from "@chakra-ui/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to access the navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/signin", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Navigate to the home page
      navigate("/home");
    } catch (err) {
      setError(
        err.response ? err.response.data.detail : "An unknown error occurred"
      );
    }
  };
  console.log(FormData);
  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="xl" mb={4}>
        Log In
      </Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
            Log In
          </Button>
          {/* Add a "Register" button that redirects to the register page */}
          <Link
            onClick={() => navigate("/register")}
            color="teal.500"
            fontSize="sm"
          >
            Register
          </Link>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
