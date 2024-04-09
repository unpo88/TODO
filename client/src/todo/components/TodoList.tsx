import { List } from "antd";

import { ITodo } from "@client/todo/types/todo.ts";
import TodoItem from "@client/todo/components/TodoItem.tsx";

interface TodoListProps {
  todos: ITodo[];
  onTodoRemoval: (todo: ITodo) => void;
  onTodoToggle: (todo: ITodo) => void;
}

function TodoList({
  todos,
  onTodoRemoval,
  onTodoToggle,
}: TodoListProps): JSX.Element {
  return (
    <List
      locale={{
        emptyText: "할 일 목록이 비어 있습니다.",
      }}
      dataSource={todos}
      renderItem={(todo) => (
        <TodoItem
          todo={todo}
          onTodoToggle={onTodoToggle}
          onTodoRemoval={onTodoRemoval}
        />
      )}
      pagination={{
        position: "bottom",
        pageSize: 10,
      }}
    />
  );
}

export default TodoList;
