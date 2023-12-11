import { parse } from "csv-parse"
import { randomUUID } from "node:crypto"
import { Database } from "./database.js"

const db = new Database()

export async function batchCreate(req, res) {
  if (!req.method === "POST" && !req.url === "/tasks") {
    return res.writeHead(404).end()
  }

  const parser = req.pipe(parse({
    comment: "Content",
    delimiter: ",",
    recordDelimiter: "\n",
    relax_column_count: true,
    skip_records_with_error: true,
    trim: true,
    on_record: (record) => record[0].includes("--X" || "Content") || !record[0].length ? null : record
  }))

  const tasks = []

  for await (const record of parser) {
    tasks.push(record)
  }

  const createdTasks = tasks.map(([title, description], index) => {
    if (index === 0) return

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    db.insert({ table: "tasks", data: task })

    return true
  }).filter(task => task)

  return res.writeHead(200).end(JSON.stringify({ tasksCreated: createdTasks.length }))
}