import { Flex, Form, Button, Input } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

import { ITodo } from "../types/todo.ts";

interface AddTodoFromProps {
  onFormSubmit: (todo: ITodo) => void;
}

function AddTodoForm({ onFormSubmit }: AddTodoFromProps): JSX.Element {
  const [form] = Form.useForm();

  const onFinish = () => {
    const todoData: ITodo = {
      entityId: uuidv4(),
      name: form.getFieldValue("name"),
      completed: false,
    };
    onFormSubmit(todoData);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="horizontal">
      <Flex align="center" justify="space-between" gap="large">
        <Form.Item
          name={"name"}
          style={{ width: "100%", marginBottom: "0px" }}
          rules={[
            { required: true, message: "해당 필드는 필수로 입력해야합니다." },
          ]}
        >
          <Input placeholder="해야할 일을 입력해주세요" />
        </Form.Item>
        <Button
          type="primary"
          style={{ width: "150px" }}
          htmlType="submit"
          block
        >
          <PlusCircleFilled />할 일 추가
        </Button>
      </Flex>
    </Form>
  );
}

export default AddTodoForm;
