const fsPromises = require('fs/promises')
const {readFile} = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockImplementation((path, options) => Promise.resolve('[]')),
  writeFile: jest.fn().mockImplementation((path, options) => Promise.resolve())
}))

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  const testQuestions = [
    {
      id: faker.datatype.uuid(),
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    },
    {
      id: faker.datatype.uuid(),
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    }
  ]

  const testJSON = JSON.stringify(testQuestions)

  questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)

  beforeAll(async () => {
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  describe('questionRepo.getQuestions()', () => {

    test('should return a list of 0 questions', async () => {

      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {

      const testJSON = '[{"id":1,"summary":"Question1"},{"id":2,"name":"Question2"}]'

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe('questionRepo.getQuestionById()', () => {

    test('should return 1 question when given correct question id.', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestion = JSON.parse(testJSON)[0]

      expect(await questionRepo.getQuestionById(testQuestion.id)).toEqual(testQuestions[0])
    })

    test('should return null if given invalid question id.', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      expect(await questionRepo.getQuestionById(faker.datatype.uuid())).toBeNull()
    })
  })

})
