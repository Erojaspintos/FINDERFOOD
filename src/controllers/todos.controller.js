const Joi = require("joi");
const {
  getToDos,
  createToDo,
  findToDo,
  deleteToDo,
  upateToDo,
} = require("../models/storage");
const sendEmail = require("../services/mailjet.service");

const getTodosController = (req, res) => {
  console.log('param: '+req.query);
  res.status(200).json(getToDos());
};

const getTodoController = (req, res) => {
  const toDoId = req.params.id;
  const toDo = findToDo(toDoId);
  if (toDo) {
    res.status(200).json(toDo);
    return;
  }
  res.status(404).json({
    message: `No se ha encontrado la tarea con id: ${toDoId} 😭`,
  });
};

const postTodoController = async (req, res) => {
  const { body } = req;
  createToDo(body.title);
  // const response = await sendEmail(body.title);
  res.status(201).json({
    message: "Tarea creada correctamente",
  });
};

const deleteTodoController = (req, res) => {
  const toDoId = req.params.id;
  deleteToDo(toDoId);
  res.status(200).json({
    message: "ToDo eliminado correctamente",
  });
};

const putTodoController = (req, res) => {
  const toDoId = req.params.id;
  const { body } = req;
  let toDo = findToDo(toDoId);
  if (toDo) {
    toDo = upateToDo(toDoId, body);
    res.status(200).json(toDo);
    return;
  }
  res.status(404).json({
    message: `No se ha encontrado la tarea con id: ${toDoId} 😭`,
  });
};

module.exports = {
  getTodosController,
  getTodoController,
  postTodoController,
  putTodoController,
  deleteTodoController,
};
