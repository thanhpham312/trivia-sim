const db = require('./database')
/**
 * @module
 */

/**
 * @param questionContent
 * @param correctAnswer
 * @param wrongAnswer1
 * @param wrongAnswer2
 * @param wrongAnswer3
 * @param userID
 * @param date
 * @returns {Promise<any>}
 */
let createQuestion = (
  questionContent,
  correctAnswer,
  wrongAnswer1,
  wrongAnswer2,
  wrongAnswer3,
  userID,
  date
) => {
  return new Promise((resolve, reject) => {
    if (
      questionContent !== '' &&
      correctAnswer !== '' &&
      wrongAnswer1 !== '' &&
      wrongAnswer2 !== '' &&
      wrongAnswer3 !== '' &&
      userID !== '' &&
      correctAnswer !== wrongAnswer1 &&
      correctAnswer !== wrongAnswer2 &&
      correctAnswer !== wrongAnswer3
    ) {
      db.executeQuery(`INSERT INTO public."QUESTIONS"(
      "QUESTION_CONTENT",
      "RIGHT_ANSWER",
      "WRONG_ANSWER1",
      "WRONG_ANSWER2",
      "WRONG_ANSWER3",
      "ACCOUNT_ID",
      "CREATED_DATE"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [
        questionContent,
        correctAnswer,
        wrongAnswer1,
        wrongAnswer2,
        wrongAnswer3,
        userID,
        date]
      ).then((result) => {
        resolve(true)
      })
    } else {
      resolve(false)
    }
  })
}

let getRandomQuestions = (num = 1) => {
  return new Promise((resolve, reject) => {
    db.executeQuery(`SELECT * FROM "QUESTIONS" ORDER BY RANDOM() LIMIT ${num}`)
      .then((result) => {
        resolve(result)
      })
  })
}

let createCustomQuiz = (accountID, quizName, date, questionIDList) => {
  return new Promise((resolve, reject) => {
    let customQuizID = null
    db.executeQuery(`INSERT INTO public."CUSTOM_QUIZZES"(
      "ACCOUNT_ID",
      "QUIZ_NAME",
      "DATE_CREATED"
      ) VALUES ($1, $2, $3);`, [
      accountID,
      quizName,
      date
    ]).then((result) => {
      db.executeQuery(`SELECT * FROM public."CUSTOM_QUIZZES" WHERE "ACCOUNT_ID" = ${accountID} AND "QUIZ_NAME" = '${quizName}'`).then((result2) => {
        customQuizID = JSON.parse(result2)[0].CUSTOM_QUIZ_ID
        if (customQuizID !== null) {
          db.executeQuery(`SELECT * FROM public."CUSTOM_QUIZZES_QUESTIONS" WHERE "CUSTOM_QUIZ_ID" = ${customQuizID}`).then((result3) => {
            if (JSON.parse(result3).length === 0) {
              for (let i = 0; i < questionIDList.length; i++) {
                db.executeQuery(`INSERT INTO public."CUSTOM_QUIZZES_QUESTIONS"(
                "CUSTOM_QUIZ_ID",
                "QUESTION_ID"
                ) VALUES ($1, $2);`, [
                  customQuizID,
                  questionIDList[i]
                ])
              }
              resolve(true)
            } else {
              resolve(false)
            }
          })
        } else {
          resolve(false)
        }
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

module.exports = {
  createQuestion,
  getRandomQuestions,
  createCustomQuiz
}
