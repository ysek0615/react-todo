import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import ToDoListItem from './ToDoListItem';
import ToDoForm from './ToDoForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ここがドラッグ関連のimport
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// モックデータを取得
const SeedData = [
  {
    id: crypto.randomUUID(),
    text: '牛乳を買う',
    completed: false,
    category: '買い物',
  },
  {
    id: crypto.randomUUID(),
    text: 'React勉強する',
    completed: false,
    category: '勉強',
  },
  {
    id: crypto.randomUUID(),
    text: '会議の準備',
    completed: true,
    category: '仕事',
  },
];

export default function ToDoList() {
  const [todos, setTodos] = useState(SeedData);
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

  const addTodo = (text, category) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        text,
        id: crypto.randomUUID(),
        completed: false,
        order: prevTodos.length,
        category: category?.trim() || '未分類',
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

  const categories = [...new Set(SeedData.map((todo) => todo.category))];

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

      <DragDropContext onDragEnd={handleDragEnd}>
        {categories.map((category) => (
          <Box key={category} sx={{ mb: 3, width: '100%', maxWidth: 360 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {category}
            </Typography>

            <Droppable droppableId={`category-${category}`}>
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  {todos
                    .filter((todo) => todo.category === category)
                    .map((todo, index) => (
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
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
        ))}
        {/* フォームは全カテゴリ共通で最後に置く */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 5,
          }}
        >
          <ToDoForm addTodo={addTodo} />
        </Box>
      </DragDropContext>
    </Box>
  );
}
