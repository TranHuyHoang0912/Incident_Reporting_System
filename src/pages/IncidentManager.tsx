import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axiosClient from '../api/axiosClient';

const IncidentManager = () => {
  const [incidents, setIncidents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ incident_title: '', incident_description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchIncidents = async () => {
    const res = await axiosClient.get('/incidents');
    setIncidents(res.data);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSave = async () => {
    if (editingId) {
      await axiosClient.put(`/incidents/${editingId}`, form);
    } else {
      await axiosClient.post('/incidents', form);
    }
    fetchIncidents();
    setOpen(false);
    setForm({ incident_title: '', incident_description: '' });
    setEditingId(null);
  };

  const handleEdit = (incident: any) => {
    setForm(incident);
    setEditingId(incident.incident_id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await axiosClient.delete(`/incidents/${id}`);
    fetchIncidents();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Quản lý sự cố</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Thêm sự cố</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map((i: any) => (
            <TableRow key={i.incident_id}>
              <TableCell>{i.incident_title}</TableCell>
              <TableCell>{i.incident_description}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(i)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(i.incident_id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Sửa sự cố' : 'Thêm sự cố'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Tiêu đề" margin="normal" value={form.incident_title} onChange={(e) => setForm({ ...form, incident_title: e.target.value })} />
          <TextField fullWidth label="Mô tả" margin="normal" value={form.incident_description} onChange={(e) => setForm({ ...form, incident_description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Huỷ</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IncidentManager;
