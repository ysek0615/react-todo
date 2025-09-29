/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Create from '@mui/icons-material/Create';

export default function ToDoForm({ addTodo }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(false); // エラー状態を管理

  const handleChange = (e) => {
    setText(e.target.value);
    if (error && e.target.value.trim()) {
      setError(false); // 入力されたらエラーを解除
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(true); // エラー状態にする
      return;
    }

    addTodo(text);
    setText('');
    setError(false);
  };

  return (
    <ListItem>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="新規追加"
          variant="outlined"
          value={text}
          onChange={handleChange}
          error={error} // エラー状態を指定
          helperText={error ? '内容を入力してください' : ' '} // 空白で高さキープ
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="create todo" edge="end" type="submit">
                    <Create />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
    </ListItem>
  );
}
