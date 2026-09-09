import { Request, Response } from 'express';
import { TaskModel } from '../models/task';

const taskModel = new TaskModel();

export const createTask = (req: Request, res: Response): void => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const task = taskModel.create({
      title,
      description,
      status: status || 'pending'
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTasks = (req: Request, res: Response): void => {
  try {
    const tasks = taskModel.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const task = taskModel.findById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = taskModel.update(id, { title, description, status });

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = taskModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
