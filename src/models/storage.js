const todos = [
  {
    id: 1,
    title: "Lavar la ropa",
    completed: true,
  },
  {
    id: 2,
    title: "Lavar los platos",
    completed: true,
  },
  {
    id: 3,
    title: "Hacer ejercicio",
    completed: false,
  },
  {
    id: 4,
    title: "Estudiar",
    completed: true,
  },
];

const getToDos = () => todos;

const createToDo = (title) => {
  const lastToDo = todos[todos.length - 1];
  const newToDo = {
    title: title,
    completed: false,
  };
  if (lastToDo) {
    newToDo.id = lastToDo.id + 1;
  } else {
    newToDo.id = 1;
  }
  todos.push(newToDo);
};

const findToDo = (id) => {
  const toDo = todos.find((todo) => todo.id == id);
  return toDo;
};

const findByIndex = (id) => {
  return todos.findIndex((toDo) => toDo.id == id);
};

const deleteToDo = (id) => {
  let indexToBeDeleted = todos.findIndex((toDo) => toDo.id == id);
  if (indexToBeDeleted >= 0) {
    todos.splice(indexToBeDeleted, 1);
  }
};

const upateToDo = (id, payload) => {
  const index = findByIndex(id);
  if (index >= 0) {
    todos[index] = { ...todos[index], ...payload };
  }
  return todos[index];
};

module.exports = {
  getToDos,
  findToDo,
  createToDo,
  deleteToDo,
  upateToDo,
};
