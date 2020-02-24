const express = require('express');
const router = express.Router();

const Task = require('../models/task');

// Получение списка задач
router.get('/', async (req, res) => {
  const tasks = await Task.find();

  res.json(tasks);
});

// Получение задачи по id
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);

  res.json(task);
});

// Создание новой задачи
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();

  res.json(savedTask);
});

// Полное изменение задачи
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body);

  res.json(task);
});

// Частичное изменение задачи
router.patch('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, {$set: req.body});

  res.json(task);
});

// Удаление задачи
router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);

  res.json(task);
});

module.exports = router;
