import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data);
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data;
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
  }

  update(table, id, data) {
    const findIndexTask = this.#database[table].findIndex(task => task.id === id);

    if(findIndexTask > -1) {
      const taskOld = this.#database[table][findIndexTask];
      this.#database[table][findIndexTask] = { id, ...taskOld, ...data };
      this.#persist()
    }
  }

  delete(table, id) {
    const findIndexTask = this.#database[table].findIndex(task => task.id === id);

    if(findIndexTask > -1) {
      this.#database[table].splice(findIndexTask, 1);
      this.#persist();
    }
  }

  isComplete(table, id, data) {
    const findIndexTask = this.#database[table].findIndex(task => task.id === id);

    if(findIndexTask > -1) {
      const taskOld = this.#database[table][findIndexTask];

      this.#database[table][findIndexTask] = {
        id,
        ...taskOld,
        ...data,
        completed_at: taskOld.completed_at ? null : data.completed_at,
      };
      this.#persist()
    }
  }
}
