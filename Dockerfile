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