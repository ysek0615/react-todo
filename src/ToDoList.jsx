import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import ToDoListItem from './ToDoListItem';
import ToDoForm from './ToDoForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ここがドラッグ関連のimport
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// ローカルストレージから初期データを取得
const getSeedData = () => {
  const data = JSON.parse(localStorage.getItem('todos'));
  if (!data) return [];
  return data.sort((a, b) => a.order - b.order); // 昇順に並べる
};

export default function ToDoList() {
  const [todos, setTodos] = useState(getSeedData);

  // todosが変更されたら保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const addTodo = (text) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        text,
        id: crypto.randomUUID(),
        completed: false,
        order: prevTodos.length,
      },
    ]);
  };

  // 🔁 並び替え後の状態を更新する関数
  const handleDragEnd = (result) => {
    if (!result.destination) return; // ドロップ先がなければ何もしない

    const newTodos = Array.from(todos);
    const [movedItem] = newTodos.splice(result.source.index, 1); // 元の場所から1個取り出す
    newTodos.splice(result.destination.index, 0, movedItem); // 新しい場所に入れ直す

    // ここで order を index として付け直す
    const reordered = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    setTodos(reordered); // ステート更新
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

      {/* 🔁 DragDropContextで囲む */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* 🟦 Droppable：リスト全体がドロップ領域 */}
        <Droppable droppableId="todo-list">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              {todos.map((todo, index) => (
                // 🟨 Draggable：1つ1つのToDoがドラッグ可能
                <Draggable
                  key={todo.id}
                  draggableId={String(todo.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ToDoListItem
                        todo={todo}
                        remove={removeTodo}
                        toggle={toggleTodo}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder} {/* 必須：ドラッグ時の隙間調整 */}
              <ToDoForm addTodo={addTodo} />
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
