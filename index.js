const express = require('express');
const makeRepositories = require('./middleware/repositories');

const STORAGE_FILE_PATH = 'questions.json';
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(makeRepositories(STORAGE_FILE_PATH));

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' });
});

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions();
  res.json(questions);
});

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId,
  );

  if (question === null) {
    return res.status(404).json('Question not found.');
  }
  res.json(question);
});

app.post('/questions', async (req, res) => {
  const id = await req.repositories.questionRepo.addQuestion(req.body);

  if (id === null) {
    return res.status(422).json('Author and question contents are required.');
  }

  if (id === false) {
    return res.status(500).json('Failed to add question.');
  }

  res.status(201).json(id);
});

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId,
  );

  if (answers === null) {
    return res.status(404).json('Question not found.');
  }
  res.json(answers);
});

app.post('/questions/:questionId/answers', async (req, res) => {
  const id = await req.repositories.questionRepo.addAnswer(
    req.params.questionId,
    req.body,
  );

  if (id === null) {
    return res.status(404).json('Question not found.');
  }

  if (id === undefined) {
    return res.status(422).json('Author and answer contents are required.');
  }

  if (id === false) {
    return res.status(500).json('Failed to add answer.');
  }

  res.status(201).json(id);
});

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(
    req.params.questionId,
    req.params.answerId,
  );

  if (answer === null) {
    return res.status(404).json('Question not found.');
  }

  if (answer === undefined) {
    return res.status(404).json('Answer not found.');
  }

  res.json(answer);
});

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
