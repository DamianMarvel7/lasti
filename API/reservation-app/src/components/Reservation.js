import React from "react";
import useReservation from "../hooks/useReservation";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from "@chakra-ui/react";

const Reservation = () => {
  const { data } = useReservation();
  const username = localStorage.getItem("username");
  const filterData = data ? data.filter((d) => d.username === username) : null;

  console.log(data);
  return (
    <div>
      {filterData && (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Reservation ID</Th>
                <Th>Username</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Jenis Ruang ID</Th>
                <Th>Jumlah Orang</Th>
                <Th>Peralatan Khusus</Th>
                <Th>Total</Th>
                <Th>Metode Pembayaran</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filterData.map((reservation) => (
                <Tr key={reservation.reservasi_id}>
                  <Td>{reservation.reservasi_id}</Td>
                  <Td>{reservation.username}</Td>
                  <Td>{reservation.date}</Td>
                  <Td>{reservation.time}</Td>
                  <Td>{reservation.jenis_ruang_id}</Td>
                  <Td>{reservation.jumlah_orang}</Td>
                  <Td>{reservation.peralatan_khusus.join(", ")}</Td>
                  <Td>{reservation.total}</Td>
                  <Td>{reservation.metode_pembayaran}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filterData.length === 0 && (
            <Text textAlign="center" mt={4}>
              No reservation history available.
            </Text>
          )}
        </Box>
      )}
    </div>
  );
};

export default Reservation;
