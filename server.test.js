const supertest = require('supertest');
const createServer = require('./server');
const { faker } = require('@faker-js/faker');
const { readFileSync } = require('fs');

const app = createServer;

const STORAGE_FILE_PATH = 'questions.json';
const fileContent = readFileSync(STORAGE_FILE_PATH, { encoding: 'utf-8' });
const questions = JSON.parse(fileContent);

describe('endpoints', () => {
  describe("GET '/questions'", () => {
    test('should return a 200 status and the array of questions', async () => {
      const { body, statusCode } = await supertest(app).get('/questions');

      expect(statusCode).toBe(200);

      expect(body).toEqual(questions);
    });
  });

  describe("GET '/questions/:questionId'", () => {
    test('should return a 200 status and question when given valid id', async () => {
      const question = questions[0];
      const questionId = question.id;

      const { body, statusCode } = await supertest(app).get(
        `/questions/${questionId}`,
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual(question);
    });

    test('should return a 404 status when given invalid question id', async () => {
      const questionId = faker.datatype.uuid();

      const { statusCode } = await supertest(app).get(
        `/questions/${questionId}`,
      );

      expect(statusCode).toBe(404);
    });
  });

  describe("POST '/questions'", () => {
    test('should return a 422 status when req.body contains invalid data ', async () => {
      const testBody = {
        author: '',
        summary: '',
      };

      const { statusCode } = await supertest(app)
        .post('/questions')
        .send(testBody);

      expect(statusCode).toBe(422);
    });
  });

  describe("GET '/questions/:questionId/answers'", () => {
    test('should return a 200 status and the array of answers when given valid question id', async () => {
      const question = questions[0];
      const questionId = question.id;
      const answers = questions[0].answers;

      const { body, statusCode } = await supertest(app).get(
        `/questions/${questionId}/answers`,
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual(answers);
    });

    test('should return a 404 status when given invalid question id', async () => {
      const questionId = faker.datatype.uuid();

      const { statusCode } = await supertest(app).get(
        `/questions/${questionId}/answers`,
      );

      expect(statusCode).toBe(404);
    });
  });

  describe("GET ''/questions/:questionId/answers/:answerId'", () => {
    test('should return a 200 status and answer when given valid question id and valid answer id', async () => {
      const question = questions[0];
      const questionId = question.id;
      const answers = questions[0].answers;
      const answer = answers[0];
      const answerId = answer.id;

      const { body, statusCode } = await supertest(app).get(
        `/questions/${questionId}/answers/${answerId}`,
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual(answer);
    });

    test('should return a 404 status when given invalid question id', async () => {
      const questionId = faker.datatype.uuid();
      const answerId = faker.datatype.uuid();

      const { statusCode } = await supertest(app).get(
        `/questions/${questionId}/answers/${answerId}`,
      );

      expect(statusCode).toBe(404);
    });

    test('should return a 404 status when given valid question id and invalid answer id', async () => {
      const question = questions[0];
      const questionId = question.id;
      const answerId = faker.datatype.uuid();

      const { statusCode } = await supertest(app).get(
        `/questions/${questionId}/answers/${answerId}`,
      );

      expect(statusCode).toBe(404);
    });
  });

  describe("POST '/questions/:questionId/answers'", () => {
    test('should return a 404 status when given invalid question id and req.body contains valid data', async () => {
      const testBody = {
        author: 'Dummy author',
        summary: 'Dummy text...',
      };

      const questionId = faker.datatype.uuid();

      const { statusCode } = await supertest(app)
        .post(`/questions/${questionId}/answers`)
        .send(testBody);

      expect(statusCode).toBe(404);
    });

    test('should return a 422 status when given req.body contains invalid data', async () => {
      const questionId = faker.datatype.uuid();

      const testBody = {
        author: '',
        summary: '',
      };

      const { statusCode } = await supertest(app)
        .post(`/questions/${questionId}/answers`)
        .send(testBody);

      expect(statusCode).toBe(422);
    });
  });
});
