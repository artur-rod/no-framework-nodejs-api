import fs from "node:fs/promises"

const DATABASE_PATH = new URL("./db.json", import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(DATABASE_PATH, "utf-8")
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, "\t"))
  }

  insert({ table, data }) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  select({ table, query }) {
    let data = this.#database[table] || []

    if (query) {
      data = data.filter(row => {
        return Object.entries(query).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  selectById({ table, id }) {
    return this.#database[table].find(row => row.id === id)
  }

  update({ table, id, data }) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    Object.entries(data).map(([key, value]) => {
      this.#database[table][rowIndex][key] = value
    })
    this.#database[table][rowIndex].updated_at = new Date()

    this.#persist()
    return this.#database[table][rowIndex]
  }

  delete({ table, id }) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}