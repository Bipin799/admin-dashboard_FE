import React, { useState } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import * as XLSX from "xlsx";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Handle adding new data
  const handleAddData = () => {
    if (!name || !email) return alert("Both fields are required!");

    const newData = [...data, { name, email }];
    setData(newData);
    setName("");
    setEmail("");
  };

  // Function to download data as an Excel file
  const downloadExcel = () => {
    if (data.length === 0) return alert("No data available to download!");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
    XLSX.writeFile(workbook, "UserData.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Save Data to Table & Excel</h2>

      {/* Input Fields */}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleAddData} style={{ marginLeft: 10 }}>
        Add
      </Button>

      {/* Data Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Download Excel Button */}
      <Button
        variant="contained"
        color="success"
        onClick={downloadExcel}
        style={{ marginTop: 20, display: "block" }}
      >
        Download Excel
      </Button>
    </div>
  );
};

export default DataTable;
