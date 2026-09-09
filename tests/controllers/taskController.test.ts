import request from 'supertest';
import app from '../../src/app';

describe('Task API', () => {
  describe('POST /tasks', () => {
    it('deve criar uma nova tarefa', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.status).toBe(taskData.status);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('deve retornar erro quando faltam campos obrigatórios', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /tasks', () => {
    it('deve listar todas as tarefas', async () => {
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar uma tarefa por ID', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending'
        });

      const taskId = createResponse.body.id;

      const response = await request(app).get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await request(app).get('/tasks/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('deve atualizar uma tarefa', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending'
        });

      const taskId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
          status: 'completed'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('Updated Task');
      expect(updateResponse.body.status).toBe('completed');
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await request(app)
        .put('/tasks/nonexistent-id')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve deletar uma tarefa', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending'
        });

      const taskId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/tasks/${taskId}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await request(app).delete('/tasks/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
