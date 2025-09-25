import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import ToDoListItem from './ToDoListItem';
import ToDoForm from './ToDoForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const getSeedData = () => {
  const data = JSON.parse(localStorage.getItem('todos'));
  if (!data) return [];
  return data;
};

export default function ToDoList() {
  const [todos, setTodos] = useState(getSeedData);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  };

  const addTodo = (text) => {
    setTodos((prevTodos) => {
      return [...prevTodos, { text, id: crypto.randomUUID, completed: false }];
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5,
      }}
    >
      <Typography variant="h2" component="h1" sx={{ flexGrow: 1 }}>
        ReactToDos
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {todos.map((todo) => (
          <ToDoListItem
            key={todo.id}
            todo={todo}
            remove={removeTodo}
            toggle={toggleTodo}
          />
        ))}
        <ToDoForm addTodo={addTodo} />
      </List>
    </Box>
  );
}
