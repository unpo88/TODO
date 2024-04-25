# Frontend Toturial

## 1. Install Brew & Node & Yarn
``` shell
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install node
$ brew install yarn --ignore-dependencies
```

## 2. Install Vite
``` shell
$ yarn create vite

# Project Name : frontend
# Select a framework: react
# Select a variant: TypeScript + SWC
```

## 3. Package 설치 후 최초 실행
``` shell
$ cd frontend
$ yarn install
# yarn dev
```

## 4. Emotion, Antd, UUID, Prettier, viteTsConfigPaths 등 설치
``` shell
$ yarn add antd @emotion/react @emotion/styled uuid 
$ yarn add -D prettier @types/uuid vite-tsconfig-paths @swc/plugin-emotion
```

## 5. Vite Config 설정
#### tsconfig.json
``` json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react", // 추가

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
    
    "paths": {
      "@frontend/*": ["src/*"],  // 추가
    },
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
``` ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
// plugins 추가
 plugins: [ 
    react({
      // NOTE: swc는 빌드 타겟을 es 버전으로 설정해야 함
      devTarget: "es2022",
      jsxImportSource: "@emotion/react",
      plugins: [["@swc/plugin-emotion", {}]],
    }),
    tsconfigPaths(),
  ],
});
```

### 폴더 구조

``` shell 
frontend
ㄴ src
   ㄴ todo
       ㄴ components
       ㄴ pages
       ㄴ types
   ㄴ Apps.tsx
   ㄴ main.tsx
```

# Backend Tutorial
``` shell
$ brew install pipenv
```

## 1. Install Django + DRF + Black
```shell
$ pipenv install django djangorestframework mysqlclient==2.1.1 gunicorn django-cors-headers
$ pipenv install --dev black
```

## 2. Django Project 생성 & 실행
```shell
$ pipenv shell
$ django-admin startproject backend
$ cd backend
$ python manage.py runserver
```

## 3. Django App 생성
```shell
$ python manage.py startapp todo
```

### 생성된 앱을 `settings.py`에 추가
``` python
# settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "todo",
]
```

## 4. Todo Model 생성
``` python
import uuid

from django.db import models


class Todo(models.Model):
    entityId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    completed= models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "todo"
```

### 추가된 Model을 Database에 반영하려면?
``` shell
$ python manage.py makemigrations
```

### Docker를 이용해서 MariaDB를 로컬에 띄어보자 

## 5. docker-compose.yml 생성
``` dockerfile
version: '3'

services:
  mariadb:
    image: 'mariadb:10.6'
    environment:
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_DATABASE: todo
      MYSQL_USER: whatsup
      MYSQL_PASSWORD: whatsuppw
    ports:
      - '3306:3306'
    volumes:
      - './.mariadb:/var/lib/mysql'
    restart: always
```

``` shell
$ docker ps
$ docker exec -it <container_id> /bin/bash
$ mysql -u whatsup -p
$ whatsuppw

mysql> show databases;
mysql> show tables;

```

## MariaDB를 기본 Database로 사용하도록 설정
``` python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "todo",
        "USER": "whatsup",
        "PASSWORD": "whatsuppw",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    }
}
```

### Pycharm에서 Database 연결 진행

## MakeMigration & Migrate
``` shell
$ python manage.py makemigrations --dry-run
$ python manage.py migrate --plan

$ python manage.py makemigrations
$ python manage.py showmigrations
$ python manage.py migrate
```

### DRF 설정
``` python
# settings.py
INSTALLED_APPS = [
    ...
    "rest_framework",
    "todo",
]
```
``` python
# todo/serializers.py
from .models import Todo
from rest_framework import serializers


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ("entityId", "name", "completed")
```

``` python
# todo/views.py
from rest_framework import viewsets, permissions

from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [permissions.AllowAny]
```


### API 생성을 위한 URLS 준비
``` python
# todo/urls.py
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register("todo", viewset=views.TodoViewSet, basename="todo")

urlpatterns = router.urls
```
``` python
# backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("todo.urls")),
]
```

http://127.0.0.1:8000/api/todo/ 접속하여 CRUD를 체험해보세요.
-> IDE Tool에 맞추어서 설정을 해주세요

## TEST Code 작성
권한 오류가 난다면 아래 코드를 참고해주세요
``` shell
$ docker ps
$ docker exec -it <container_id> /bin/bash
$ mysql -u root -p
$ rootpw 

mysql> GRANT ALL PRIVILEGES ON *.* TO 'whatsup'@'%'
mysql> FLUSH PRIVILEGES;
```
``` python
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
```

## CORS 문제 해결 - Frontend와 Backend 연결
``` python
# settings.py
INSTALLED_APPS = [
    ...
    "corsheaders",
    "todo",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware", # 최상단에 위치
    "django.middleware.common.CommonMiddleware",
    ...
]

CORS_ORIGIN_ALLOW_ALL = True
```

## Frontend에서 Backend API 호출하도록 코드 수정
``` shell
$ yarn add axios
```

``` ts
// apis.ts
import axios from "axios";
import { ITodo } from "@client/todo/types/todo.ts";

function TodoAPI() {
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

export default TodoAPI;
```

``` ts
// TodoServiceController.tsx
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
```

## Dockerfile Nginx 설정

### yarn build 후 dist 폴더 생성

``` ts
// vite.config.ts
export default defineConfig({
  base: "",
  plugins: [
    ...
});
```
``` ts
// tsconfig.json

{
    "compilerOptions": {
        ...
        "outDir": "./dist/",
        "baseUrl": ".",
        "paths": {
            "@client/*": ["src/*"]
        }
    },
}
```

`./client/.dockerignore` 파일 생성 후 아래 코드 입력
``` .dockerignore
node_modules/*
```

`./client/Dockerfile` 파일 생성 후 아래 코드 입력
``` Dockerfile
FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

WORKDIR /client

COPY dist/ dist/

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
```

`./client/nginx/nginx.conf` 파일 생성 후 아래 코드 입력

``` nginx configuration
server {
    listen 80;

    location / {
        root /client/dist/;
        index index.html;
        try_files $uri $uri/ /index.html =404;
    }
}
```

``` shell
$ docker build --no-cache --tag todo .
$ docker run -d -p 8080:80 --name todo todo
```

### 항상 Frontend 최신 Build 파일을 올려주어야한다.
``` dockerfile
FROM node:21-alpine as builder

WORKDIR /client

COPY package*.json /client/package.json

RUN npm install

COPY . /client

RUN npm run build --production

FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=builder /client/dist/ /client/dist/

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
```

http://localhost:8080 접속 -> Frontend 뜨는 것 확인

## Gunicorn 설정
``` python
# backend/config/gunicorn/conf.py
import multiprocessing

name = "todo"
loglevel = "info"
errorlog = "-"
accesslog = "-"

workers = multiprocessing.cpu_count() * 2

preload_app = True

reload = True
timeout = 300
```

``` shell
$ gunicorn -c config/gunicorn/conf.py --bind :8000 backend.wsgi:application
```

## Backend Dockerfile 작성
``` python
# settings.py
STATIC_ROOT = "static/"
ALLOWED_HOSTS = ["*"]
```

``` shell
$ python manage.py collectstatic
```

``` nginx configuration
server {
    listen 80;

    location / {
        root /client/dist/;
        index index.html;
        try_files $uri $uri/ /index.html =404;
    }
    
    location /static/ {
        alias /static/;
    }
}
```

``` python
# wsgi.py
"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler
from django.conf import settings


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

if settings.DEBUG:
    application = StaticFilesHandler(get_wsgi_application())
else:
    application = get_wsgi_application()
```

`.dockerignore` 파일에 아래 코드 추가
``` .dockerignore
Dockerfile*
docker-compose*
static
migrations/*
.mariadb
__pycache__
.dockerignore
node_modules/*
client/*
```

``` Dockerfile
FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /todo/
COPY Pipfile* /todo/

RUN pip install pipenv && pipenv install --system --ignore-pipfile --dev

COPY . /todo/

RUN apt-get update && apt-get install netcat-openbsd -y

RUN chmod +x /todo/entrypoint.sh
ENTRYPOINT ["/todo/entrypoint.sh"]

EXPOSE 8000
```

``` entrypoint.sh 
#!/bin/bash

maridb_host="mariadb"
maridb_port=3306

# Wait for the postgres docker to be running
while ! nc $maridb_host $maridb_port; do
  >&2 echo "MariaDB is unavailable - sleeping"
  sleep 5
done

cd backend

echo "Run collectstatic"
python manage.py collectstatic --no-input
echo "Run makemigrations"
python manage.py makemigrations
echo "Run migrate"
python manage.py migrate

gunicorn -c config/gunicorn/conf.py --bind :8000 backend.wsgi:application
```

## Frontend + Backend를 docker-compose.yml 파일로 묶어보자
``` dockerfile
version: '3'

services:
  backend:
    build: .
    ports:
      - '8000:8000'
    depends_on:
      - 'mariadb'

  frontend:
    build: ./client
    restart: always
    volumes:
      - './client/nginx:/etc/nginx/conf.d'
      - './backend/static:/static'
    ports:
      - '80:80'
    depends_on:
      - 'backend'

  mariadb:
    image: 'mariadb:10.6'
    environment:
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_DATABASE: todo
      MYSQL_USER: whatsup
      MYSQL_PASSWORD: whatsuppw
    ports:
      - '3306:3306'
    volumes:
      - './.mariadb:/var/lib/mysql'
    restart: always
```

``` python
# settings.py

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "todo",
        "USER": "whatsup",
        "PASSWORD": "whatsuppw",
        "HOST": "mariadb",  # 로컬 개발 환경에서는 localhost
        "PORT": "3306",
    }
}
```

``` shell
$ docker-compose up --build
```

# AWS EC2 설치 - 첫 번째 배포 방법
- Amazon Linux

``` shell
$ sudo yum install git
$ git clone https://github.com/unpo88/TODO.git

# Docker 설치
$ sudo yum install -y docker
$ sudo service docker start
$ sudo usermod -aG docker $(whoami)

# Docker Compose 설치
$ sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose

# API 호출을 하는 부분을 localhost가 아닌 Backend API를 호출하도록 변경
$ docker-compose up --build

----

$ SWAP 가상 메모리를 이용하여 메모리를 늘려주기
$ sudo dd if=/dev/zero of=/swapMem bs=128M count=16
$ sudo chmod 600 /swapMem
$ sudo mkswap /swapMem
$ sudo swapon /swapMem
$ sudo swapon -s
$ sudo vi /etc/fstab

sudo yum install git# 마지막 행에 아래 추가
/swapfile swap swap defaults 0 0

Dockerfile -> 기본 EC2 t2.micro는 Memory가 1GB라서 동작에 어려움있음
-> RUN node --max-old-space-size=750 /usr/local/bin/npm install -> Docker는 이미지 레이어에서 캐싱이 되기때문에 다시 기다릴 필요 없음

apis.ts 수정 필요
```

## ElasticIP 적용까지

# RDS 설정
### docker-compose.yml, entrypoint.sh 에서 mariadb 관련한 부분을 모두 제거
### AWS RDS 생성
### Django Database 설정 변경
``` python
  "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "todo",
        "USER": "<RDS_USER>",
        "PASSWORD": "<RDS_PASSWORD>",
        "HOST": "<RDS_HOST", 
        "PORT": "3306",
    }
```
### RDS Security Group -> 3306 Port 개방


# AWS ECS + ECR - 두 번째 배포 방법
- ECS에서 동작시키기 위한 nginx.conf 파일 수정 필요
``` nginx configuration
 server {
    listen 80;

    location ~ ^/(api)/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location /static/ {
        proxy_pass http://127.0.0.1:8000;
        alias /static/;
    }

    location / {
        root /client/dist/;
        index index.html;
        try_files $uri $uri/ /index.html =404;
    }
}
```

- ECR에 PUSH하기 위해 platform 설정 필요
``` docker-compose.yaml
version: '3.7'

services:
    backend:
        platform: linux/amd64
        ...
        
    frontend:
        platform: linux/amd64
        ...
```

- ECS - Service - TaskDefinition 생성 후 [생성할 때 로그 반드시 생성]
``` typescript
// apis.ts
const API_BASE_URL = "http://<ALB_DNS_NAME>/api";
```
