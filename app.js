require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, task: 'Finish Week 4 Slides', completed: false },
  { id: 2, task: 'Deploy API (today!)', completed: false }
];

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Todo API is ready' });
});

app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task required' });
  }

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const { task, completed } = req.body;

  if (task !== undefined) {
    if (typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({ error: 'Task required' });
    }
    todo.task = task.trim();
  }

  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const lengthBefore = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === lengthBefore) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API is live on port ${PORT}`);
});
