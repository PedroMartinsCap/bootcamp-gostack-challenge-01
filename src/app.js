const express = require("express")
const cors = require("cors")
const { v4: uuid } = require('uuid')
const { isUuid } = require("uuidv4")
const { request } = require("express")

const app = express()

function IdValidate(request, response, next) {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" })
  }
  
  return next()
}

app.use(express.json())
app.use(cors())
app.use("/repositories/:id", IdValidate)

const repositories = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository)

  return response.json(repository)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], title, url, techs }

  return response.json(repositories[repositoryIndex])
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories[repositoryIndex].likes += 1

  return response.json(repositories[repositoryIndex])

})

module.exports = app
