import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import api from '../../services/api/axiosConfig';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);
  return (
    <Container className="py-4">
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}