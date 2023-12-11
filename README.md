# No Framework NodeJS API

Project created to study how NodeJS behaves under the covers.

It's a CRUD for tasks, and also have the ability to create a batch of tasks in the POST request.

It was created using only intern NodeJS modules like `crypto`, `http`... Except for the `csv-parse`, used to parse the `.csv` files.

## Running locally

Clone the project

```bash
  git clone https://github.com/artur-rod/no-framework-nodejs-api.git
```

Enter the directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Run server

```bash
  npm start
```

## API References

#### Get all tasks

```http
  GET https://localhost:3333/tasks
```

| Parameter | Type    | Description                                     |
| :-------- | :------ | :---------------------------------------------- |
| `search`  | `query` | Used to filter the tasks by name or description |

#### Create a task

```http
  POST https://localhost:3333/tasks
```

| Parameter     | Type   | Description                 |
| :------------ | :----- | :-------------------------- |
| `name`        | `body` | Task name `required`        |
| `description` | `body` | Task description `required` |

#### Create a batch of tasks

```http
  POST https://localhost:3333/tasks
```

| Parameter | Type   | Description                                            |
| :-------- | :----- | :----------------------------------------------------- |
| `file`    | `body` | `.csv` file with rows in the format `name,description` |

#### Update task name or description

```http
  PUT https://localhost:3333/tasks/{id}
```

| Parameter     | Type   | Description      |
| :------------ | :----- | :--------------- |
| `id`          | `url`  | Task ID          |
| `name`        | `body` | Task name        |
| `description` | `body` | Task description |

#### Mark task as completed or uncompleted

```http
  PATCH https://localhost:3333/tasks/{id}/complete
```

| Parameter | Type  | Description |
| :-------- | :---- | :---------- |
| `id`      | `url` | Task ID     |

#### Delete task

```http
  DELETE https://localhost:3333/tasks/{id}
```

| Parameter | Type  | Description |
| :-------- | :---- | :---------- |
| `id`      | `url` | Task ID     |
