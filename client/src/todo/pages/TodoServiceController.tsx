import { useState } from "react";
import { message } from "antd";

import { ITodo } from "@client/todo/types/todo.ts";

export interface TodoServiceControllerObject {
  todos: ITodo[];
  handleAddTodo: (todo: ITodo) => void;
  handleDeleteTodo: (todo: ITodo) => void;
  handleUpdateStatusTodo: (todo: ITodo) => void;
}

function TodoServiceController(): TodoServiceControllerObject {
  const [todos, setTodos] = useState<ITodo[]>([]);

  function handleAddTodo(todo: ITodo) {
    setTodos((prevTodos) => [...prevTodos, todo]);
    message.success("할 일 목록을 추가했습니다");
  }

  function handleDeleteTodo(todo: ITodo) {
    setTodos((prevTodos) =>
      prevTodos.filter((item) => item.entityId !== todo.entityId),
    );

    message.warning("할 일 목록을 삭제했습니다");
  }

  function handleUpdateStatusTodo(todo: ITodo) {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.entityId === todo.entityId
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );

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
