/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Create from '@mui/icons-material/Create';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const CATEGORY_OPTIONS = ['ToDo', 'Doing', 'Done']; // ← カテゴリ選択肢を定義

export default function ToDoForm({ addTodo }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(false); // エラー状態を管理
  const [category, setCategory] = useState('ToDo'); // ← カテゴリ用のstateを追加！

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

    addTodo(text, category); // ← カテゴリも渡す
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
          error={error}
          helperText={error ? '内容を入力してください' : ' '}
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

        <FormControl size="small" sx={{ mb: 2, ml: 1 }}>
          <InputLabel id="category-label">カテゴリ</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="カテゴリ"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    </ListItem>
  );
}
