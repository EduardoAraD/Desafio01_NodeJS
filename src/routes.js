import { randomUUID } from 'node:crypto'

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const nameTaskTable = 'tasks';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.select(nameTaskTable, search ? {
        name: search,
        description: search,
      }: null);

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { name, description } = req.body;
      if(!name || !description) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Name or description not found!' }))
      }

      const time = new Date().toISOString()
      const newTask = {
        id: randomUUID(),
        name,
        description,
        completed_at: null,
        created_at: time,
        updated_at: time
      }

      database.insert(nameTaskTable, newTask);
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params; 
      const { name, description } = req.body;
      const time = new Date().toISOString()

      database.update(nameTaskTable, id, {
        name,
        description,
        updated_at: time
      });
      return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete(nameTaskTable, id);
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const time = new Date().toISOString();

      database.isComplete(nameTaskTable, id, {
        completed_at: time,
        updated_at: time,
      });
      return res.writeHead(201).end();
    }
  },
];
