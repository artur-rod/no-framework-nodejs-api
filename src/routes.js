// import {fs} from "node:fs";
import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoute } from "./utils/build-route.js";
import { validateBodyProperties } from "./utils/validate-body-properties.js";

const db = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoute("/tasks"),
    handler: (req, res) => {
      const { search } = req.query

      const data = db.select({
        table: "tasks",
        query: search ? { title: search, description: search } : null
      })

      return res.end(JSON.stringify(data))
    }
  },
  {
    method: "POST",
    path: buildRoute("/tasks"),
    handler: async (req, res) => {
      const missingProperties = validateBodyProperties({
        requiredProperties: ["title", "description"],
        body: req.body
      })

      if (missingProperties) return res.writeHead(400).end(JSON.stringify({ errors: missingProperties }))

      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      db.insert({ table: "tasks", data: task })
      return res.writeHead(201).end()
    }
  },
  {
    method: "PUT",
    path: buildRoute("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const taskExists = db.selectById({ table: "tasks", id })
      if (!taskExists) return res.writeHead(400).end(JSON.stringify({ error: "Task not found" }))

      const updatedTask = db.update({ table: "tasks", id, data: { title, description } })
      return res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: "PATCH",
    path: buildRoute("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params

      const taskExists = db.selectById({ table: "tasks", id })
      if (!taskExists) return res.writeHead(400).end(JSON.stringify({ error: "Task not found" }))

      const completed_at = taskExists.completed_at ? null : new Date()

      const updatedTask = db.update({ table: "tasks", id, data: { completed_at } })
      return res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: "DELETE",
    path: buildRoute("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params

      const taskExists = db.selectById({ table: "tasks", id })
      if (!taskExists) return res.writeHead(400).end(JSON.stringify({ error: "Task not found" }))

      db.delete({ table: "tasks", id })
      return res.writeHead(204).end()
    }
  }
]