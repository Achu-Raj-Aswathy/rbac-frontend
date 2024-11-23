import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', permissions: [] });
  const navigate = useNavigate();

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:5000/roles');
    setRoles(response.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/roles/${formData._id}`, formData);
    } else {
      await axios.post('http://localhost:5000/roles', formData).then((res) => {
        setRoles([...roles, res.data]);
      });
    }
    setShowModal(false);
    fetchRoles();
    setFormData('')
  };

  const handleEdit = (role) => {
    setEditMode(true);
    setFormData(role);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error.message);
    }
  };

  return (
    <div className="d-flex" style={{width: '100%'}}>
      <div className="sidebar d-flex flex-column p-5"
        style={{ backgroundColor: '#F2F2F2', height:'95vh' }}>
          <h3 style={{marginBottom: '20px'}}>Dashboard</h3>
        <a
          style={{ textDecoration: 'none', color: '#000', cursor:'pointer'}}
          className="mt-2"
          onClick={() => navigate('/')}
        >
          User Management
        </a>
        <a
          style={{ textDecoration: 'none', color: '#000'}}
          className="mt-2"
        >
          Role Management
        </a>
      </div>

      <div style={{ width: 'calc(100% - 250px)' }}>
      <div className='d-flex ms-3' style={{ gap: '45rem' }}>
      <h4>Role Management</h4>
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Role
      </Button>
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-3 ms-3"
                  onClick={() => handleEdit(role)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-3"
                  onClick={() => handleDelete(role._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Role' : 'Add Role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Permissions (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.permissions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permissions: e.target.value.split(',').map((p) => p.trim()),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
};

export default Roles;
