const { readFile, writeFile } = require('fs/promises');
const { v4: uuid } = require('uuid');

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' });
    return JSON.parse(fileContent);
  };

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' });
    const questions = JSON.parse(fileContent);

    return questions.find(question => question.id === questionId) ?? null;
  };

  const addQuestion = async question => {
    if (!question.author || question.author === '') {
      return null;
    }

    if (!question.summary || question.summary === '') {
      return null;
    }

    const id = uuid();
    const answers = [];

    const questionToWrite = {
      id,
      ...question,
      answers,
    };

    try {
      const fileContent = await readFile('./questions.json', {
        encoding: 'utf-8',
      });
      let questions;

      fileContent === ''
        ? (questions = [])
        : (questions = JSON.parse(fileContent));

      questions.push(questionToWrite);

      await writeFile('./questions.json', JSON.stringify(questions));
      return id;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' });
    const questions = JSON.parse(fileContent);

    const question = questions.find(question => question.id === questionId);

    return question === undefined ? null : question.answers;
  };

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' });
    const questions = JSON.parse(fileContent);

    const question = questions.find(question => question.id === questionId);

    if (question === undefined) {
      return null;
    }

    const answers = question.answers;

    return answers.find(answer => answer.id === answerId);
  };

  const addAnswer = async (questionId, answer) => {
    if (!answer.author || answer.author === '') {
      return undefined;
    }

    if (!answer.summary || answer.summary === '') {
      return undefined;
    }

    const fileContent = await readFile(fileName, { encoding: 'utf-8' });
    const questions = JSON.parse(fileContent);

    const questionIndex = questions.findIndex(
      question => question.id === questionId,
    );

    if (questionIndex === -1) {
      return null;
    }

    const id = uuid();

    const answerToWrite = {
      id,
      ...answer,
    };

    questions[questionIndex].answers.push(answerToWrite);

    try {
      await writeFile('./questions.json', JSON.stringify(questions));
      return id;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer,
  };
};

module.exports = { makeQuestionRepository }
