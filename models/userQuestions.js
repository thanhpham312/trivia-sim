const db = require('./database')

let createQuestion = (Q,CA,WA1,WA2,WA3) => {
	db.executeQuery(`INSERT INTO public."QUESTIONS"("QUESTION_CONTENT", "RIGHT_ANSWER", "WRONG_ANSWER1", "WRONG_ANSWER2", "WRONG_ANSWER3", "ACCOUNT_ID") VALUES (?, ?, ?, ?, ?, ?, ?);`)
}

module.exports = {
  createQuestion
}
