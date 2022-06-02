const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(req.params.questionId)

  if(question === null) {
    res.status(404).json('Question not found.')
  }
  res.json(question)
})

app.post('/questions', async (req, res) => {
  const id = await req.repositories.questionRepo.addQuestion(JSON.parse(req.body))

  if(id === null) {
    return res.status(422).json('Author and question contents are required.')
  }

  if(id === false) {
    return res.status(500).json('Failed to add question.')
  }

  res.status(201).json(id)
})

app.get('/questions/:questionId/answers', (req, res) => {})

app.post('/questions/:questionId/answers', (req, res) => {})

app.get('/questions/:questionId/answers/:answerId', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
