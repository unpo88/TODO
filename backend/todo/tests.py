from django.test import TestCase
from .models import Todo
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status


class TodoModelTest(TestCase):
    def test__이름_길이_검증__when__최대_길이_초과__then__raise_error(self):
        todo = Todo(name="a" * 256)

        with self.assertRaises(ValidationError) as context:
            todo.full_clean()

        self.assertTrue("name" in context.exception.message_dict)
        self.assertTrue(
            "Ensure this value has at most 255 characters (it has 256)."
            in context.exception.message_dict["name"]
        )

    def test__기본값_검증__when__할_일_생성__expect__completed_false(self):
        todo = Todo.objects.create(name="New Todo")
        self.assertFalse(todo.completed)


class TodoAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.dummy_todo_data1 = Todo.objects.create(name="Todo1")
        self.dummy_todo_data2 = Todo.objects.create(name="Todo2")

    def test__get_todos(self):
        response = self.client.get("/api/todo/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test__create_todo(self):
        data = {"name": "New Todo"}
        response = self.client.post("/api/todo/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 3)
        self.assertEqual(Todo.objects.latest("created_at").name, "New Todo")

    def test__update_todo(self):
        data = {"name": "Update Todo"}
        response = self.client.put(f"/api/todo/{self.dummy_todo_data1.entityId}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_todo = Todo.objects.get(entityId=self.dummy_todo_data1.entityId)
        self.assertEqual(updated_todo.name, data.get("name"))

    def test__delete_todo(self):
        response = self.client.delete(f"/api/todo/{self.dummy_todo_data1.entityId}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(), 1)
