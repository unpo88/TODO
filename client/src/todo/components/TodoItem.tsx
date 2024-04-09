import { Tooltip, Tag, List, Button, Popconfirm, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

import { ITodo } from "../types/todo.ts";

interface TodoItemProps {
  todo: ITodo;
  onTodoRemoval: (todo: ITodo) => void;
  onTodoToggle: (todo: ITodo) => void;
}

function TodoItem({
  todo,
  onTodoRemoval,
  onTodoToggle,
}: TodoItemProps): JSX.Element {
  return (
    <List.Item
      actions={[
        <Tooltip title={todo.completed ? "미완료 처리" : "완료 처리"}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={() => onTodoToggle(todo)}
            defaultChecked={todo.completed}
          />
        </Tooltip>,
        <Popconfirm
          title="해당 할 일 목록을 삭제하겠습니까?"
          onConfirm={() => {
            onTodoRemoval(todo);
          }}
        >
          <Button type="primary" danger>
            삭제
          </Button>
        </Popconfirm>,
      ]}
      key={todo.entityId}
    >
      <Tag color={todo.completed ? "cyan" : "red"}>{todo.name}</Tag>
    </List.Item>
  );
}

export default TodoItem;
