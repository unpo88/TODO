import axios from "axios";
import { ITodo } from "@client/todo/types/todo.ts";

function TodoApi() {
  async function getTodos() {
    const response = await axios.get("http://localhost:8000/api/todo/");
    const responseData: ITodo[] = response.data;

    return responseData;
  }

  async function createTodo(name: string) {
    await axios.post("http://localhost:8000/api/todo/", { name: name });
  }

  async function deleteTodo(entityId: string) {
    await axios.delete(`http://localhost:8000/api/todo/${entityId}`);
  }

  async function updateTodo(
    entityId: string,
    name: string,
    completed: boolean,
  ) {
    await axios.put(`http://localhost:8000/api/todo/${entityId}/`, {
      name: name,
      completed: completed,
    });
  }

  return { getTodos, createTodo, deleteTodo, updateTodo };
}

export default TodoApi;
