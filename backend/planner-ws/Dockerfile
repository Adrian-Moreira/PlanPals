FROM denoland/deno:alpine

WORKDIR /code

COPY . .

EXPOSE 8000

RUN deno task build

CMD ["./planner-ws"]