import { useEffect, useState } from "react";
import { message } from "antd";

import { ITodo } from "@client/todo/types/todo.ts";
import TodoApi from "@client/todo/apis.ts";

export interface TodoServiceControllerObject {
  todos: ITodo[];
  handleAddTodo: (todo: ITodo) => void;
  handleDeleteTodo: (todo: ITodo) => void;
  handleUpdateStatusTodo: (todo: ITodo) => void;
}

function TodoServiceController(): TodoServiceControllerObject {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const { getTodos, createTodo, deleteTodo, updateTodo } = TodoApi();

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const todosData = await getTodos();
    setTodos(todosData);
  }

  async function handleAddTodo(todo: ITodo) {
    await createTodo(todo.name);
    await fetchTodos();
    message.success("할 일 목록을 추가했습니다");
  }

  async function handleDeleteTodo(todo: ITodo) {
    await deleteTodo(todo.entityId);
    await fetchTodos();
    message.warning("할 일 목록을 삭제했습니다");
  }

  async function handleUpdateStatusTodo(todo: ITodo) {
    await updateTodo(todo.entityId, todo.name, !todo.completed);
    await fetchTodos();
    message.info("할 일 목록의 상태를 변경하였습니다");
  }

  return {
    todos,
    handleAddTodo,
    handleDeleteTodo,
    handleUpdateStatusTodo,
  };
}

export default TodoServiceController;
