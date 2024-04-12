import axios from "axios";
import { ITodo } from "@client/todo/types/todo.ts";

const API_BASE_URL = "http://localhost:8000/api";


function TodoApi() {
  async function getTodos() {
    const response = await axios.get(`${API_BASE_URL}/todo/`);
    const responseData: ITodo[] = response.data;

    return responseData;
  }

  async function createTodo(name: string) {
    await axios.post(`${API_BASE_URL}/todo/`, { name: name });
  }

  async function deleteTodo(entityId: string) {
    await axios.delete(`${API_BASE_URL}/todo/${entityId}`);
  }

  async function updateTodo(
    entityId: string,
    name: string,
    completed: boolean,
  ) {
    await axios.put(`${API_BASE_URL}/todo/${entityId}/`, {
      name: name,
      completed: completed,
    });
  }

  return { getTodos, createTodo, deleteTodo, updateTodo };
}

export default TodoApi;
