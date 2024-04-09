import { Card, Flex } from "antd";
import AddTodoForm from "@client/todo/components/AddTodoForm.tsx";
import Introduction from "@client/todo/components/Introduction";
import TodoServiceController from "@client/todo/pages/TodoServiceController.tsx";
import TodoList from "@client/todo/components/TodoList.tsx";
import _S from "./styles";

function Todo() {
  const { todos, handleAddTodo, handleDeleteTodo, handleUpdateStatusTodo } =
    TodoServiceController();

  return (
    <Flex justify="center" align="center" wrap="wrap" gap="large" vertical>
      <div css={_S.ContentLayout}>
        <Introduction title="SOMA" subTitle="할 일 목록을 추가해주세요" />
      </div>

      <Card title="할 일 목록 추가" css={_S.ContentLayout}>
        <AddTodoForm onFormSubmit={handleAddTodo} />
      </Card>

      <Card title="할 일 목록" css={_S.ContentLayout}>
        <TodoList
          todos={todos}
          onTodoRemoval={handleDeleteTodo}
          onTodoToggle={handleUpdateStatusTodo}
        />
      </Card>
    </Flex>
  );
}

export default Todo;
