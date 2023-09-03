import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function BasicTable() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8000/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleEditChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:8000/api/users/${userId}`, editedUser);

      const updatedUsers = users.map(user => 
        user.id === userId ? response.data.user : user
      );
      setUsers(updatedUsers);
    
      console.log(`User with ID: ${userId} updated successfully`);
      setEditingId(null);
      setEditedUser(null);

    } catch (error) {
      console.error(`Error updating user with ID: ${userId}. Error: ${error}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      await axios.delete(`http://localhost:8000/api/users/${userId}`);
      
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      console.log(`User with ID: ${userId} deleted successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">User Type</TableCell>
            <TableCell align="right">Portfolio</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => {
            const uniqueKey = user.id || `backup-${index}`; // Use index as a backup key if user.id is undefined

            return (
              <TableRow key={uniqueKey}>
                <TableCell component="th" scope="row">
                  {editingId === user.id ? (
                    <TextField
                      value={editedUser.name}
                      onChange={e => handleEditChange('name', e.target.value)}
                    />
                  ) : user.name}
                </TableCell>
                <TableCell align="right">
                  {editingId === user.id ? (
                    <TextField
                      value={editedUser.email}
                      onChange={e => handleEditChange('email', e.target.value)}
                    />
                  ) : user.email}
                </TableCell>
                <TableCell align="right">
                  {editingId === user.id ? (
                    <TextField
                      value={editedUser.usertype}
                      onChange={e => handleEditChange('usertype', e.target.value)}
                    />
                  ) : user.usertype}
                </TableCell>
                <TableCell align="right">
                  {editingId === user.id ? (
                    <TextField
                      value={editedUser.portfolio}
                      onChange={e => handleEditChange('portfolio', e.target.value)}
                    />
                  ) : user.portfolio}
                </TableCell>
                <TableCell align="center">
                  {editingId === user.id ? (
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(user.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="outlined" color="primary" onClick={() => startEdit(user)}>
                      Edit
                    </Button>
                  )}
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
