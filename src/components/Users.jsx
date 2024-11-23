import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'Active' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/users/${formData._id}`, formData);
    } else {
      await axios.post('http://localhost:5000/users', formData).then((res) => {
        setUsers([...users, res.data]);
      });
    }
    setShowModal(false);
    fetchUsers();
    setFormData('');
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Attempting to delete user with ID:', id);
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  return (
    <div className="d-flex" style={{width: '100%'}}>
      <div className="sidebar d-flex flex-column p-5"
        style={{ backgroundColor: '#F2F2F2', height:'95vh'}}>
          <h3 style={{marginBottom: '20px'}}>Dashboard</h3>
        <a
          style={{ textDecoration: 'none', color: '#000'}}
          className="mt-2"
        >
          User Management
        </a>
        <a
          style={{ textDecoration: 'none', color: '#000', cursor:'pointer'}}
          className="mt-2"
          onClick={() => navigate('/roles')}
        >
          Role Management
        </a>
      </div>

      <div style={{ width: 'calc(100% - 250px)' }}>
        <div className='d-flex ms-3' style={{ gap: '45rem' }}>
        <h4>User Management</h4>
        <Button onClick={() => setShowModal(true)} className="mb-3 me-3">Add User</Button>
        </div>

        <Table striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <Button variant="warning" className="me-3 ms-3" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button variant="danger" className="ms-3" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add/Edit User Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit User' : 'Add User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option>Admin</option>
                  <option>Editor</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="status" className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Users;
