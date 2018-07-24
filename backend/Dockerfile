FROM python:alpine

RUN mkdir /app
COPY ./requirements.txt /app

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/gunicorn", "-b", ":8080", "server:app"]
