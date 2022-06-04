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
      answers: [
        {
          id: faker.datatype.uuid(),
          author: "Brian McKenzie",
          summary: "The Earth is flat."
        },
        {
          id: faker.datatype.uuid(),
          author: "Dr Strange",
          summary: "It is egg-shaped."
        }
      ]
    }
  ]

  const testJSON = JSON.stringify(testQuestions)

  questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)

  beforeAll(async () => {
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  describe('questionRepo.getQuestions()', () => {

    test('should return a list of 0 questions when there is no questions in file', async () => {

      const questions = await questionRepo.getQuestions()

      expect(questions).toHaveLength(0)
    })

    test('should return a list of 2 questions when there are two questions in file', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const questions = await questionRepo.getQuestions()

      expect(questions).toHaveLength(2)
    })
  })

  describe('questionRepo.getQuestionById()', () => {

    test('should return 1 question when given correct question id.', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestion = JSON.parse(testJSON)[0]

      const question = await questionRepo.getQuestionById(testQuestion.id)

      expect(question).toEqual(testQuestions[0])
    })

    test('should return null when given invalid question id.', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const invalidId = faker.datatype.uuid()

      const question = await questionRepo.getQuestionById(invalidId)

      expect(question).toBeNull()
    })
  })


  describe('questionRepo.addQuestion()', () => {

    test('should returns null if given invalid data', async () => {
      const invalidData1 = {
        summary: 'Dummy text...'
      }
      const invalidData2 = {
        author: '',
        summary: 'Dummy text...'
      }
      const invalidData3 = {
        author: 'Dummy author'
      }
      const invalidData4 = {
        author: 'Dummy author',
        summary: '',
      }

      const result1 = await questionRepo.addQuestion(invalidData1)
      const result2 = await questionRepo.addQuestion(invalidData2)
      const result3 = await questionRepo.addQuestion(invalidData3)
      const result4 = await questionRepo.addQuestion(invalidData4)


      expect(result1).toBeNull()
      expect(result2).toBeNull()
      expect(result3).toBeNull()
      expect(result4).toBeNull()
    })

    test('should returns valid id when given valid data', async () => {

      const validData = {
        author: 'Dummy author',
        summary: 'Dummy text...'
      }

      const id = await questionRepo.addQuestion(validData)

      expect(typeof id).toBe('string')
    })

    test('should call readFile()', async () => {

      const validData = {
        author: 'Dummy author',
        summary: 'Dummy text...'
      }

      await questionRepo.addQuestion(validData)

      expect(fsPromises.readFile).toBeCalled();
    })

    test('should call writeFile()', async () => {

      const validData = {
        author: 'Dummy author',
        summary: 'Dummy text...'
      }

      await questionRepo.addQuestion(validData)

      expect(fsPromises.readFile).toBeCalled();
    })

  })

  describe('questionRepo.getAnswers()', () => {

    test('should returns null when given invalid question id', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestionId = faker.datatype.uuid()
      const answers = await questionRepo.getAnswers(testQuestionId)

      expect(answers).toBeNull()
    })

    test('should returns a list of 0 answers when question have no answers', async () => {

     readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

     const testQuestion = JSON.parse(testJSON)[0]
     const answers = await questionRepo.getAnswers(testQuestion.id)

      expect(answers).toHaveLength(0)
    })

    test('should returns a list of 2 answers when question have two answers', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestion = JSON.parse(testJSON)[1]
      const answers = await questionRepo.getAnswers(testQuestion.id)

      expect(answers).toHaveLength(2)
    })

  })

  describe('questionRepo.getAnswer()', () => {

    test('should returns null when given invalid question id', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestionId = faker.datatype.uuid()
      const testAnswerId = faker.datatype.uuid()

      const answers = await questionRepo.getAnswer(testQuestionId, testAnswerId)

      expect(answers).toBeNull()
    })

    test('should returns undefined when given valid question id and invalid answer id', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestion = JSON.parse(testJSON)[0]
      const testAnswerId = faker.datatype.uuid()

      const answers = await questionRepo.getAnswer(testQuestion.id, testAnswerId)

      expect(answers).toBeUndefined()
    })

    test('should returns answer when given valid question id and valid answer id', async () => {

      readFile.mockImplementationOnce((path, options) => Promise.resolve(testJSON))

      const testQuestion = JSON.parse(testJSON)[1]
      const testAnswerId = testQuestion.answers[0].id

      const answers = await questionRepo.getAnswer(testQuestion.id, testAnswerId)

      expect(answers).toEqual(testQuestions[1].answers[0])
    })
  })

})
