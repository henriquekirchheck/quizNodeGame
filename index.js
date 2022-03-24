import inquirer from "inquirer"
import chalk from "chalk"
import chalkAnimation from "chalk-animation"
import fs from "fs"
import { createSpinner } from "nanospinner"
import figlet from "figlet"
import gradient from "gradient-string"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function welcome() {
  const text = chalkAnimation.rainbow("Quiz Game", 1)
  await sleep(1000)
  text.stop()

  console.log(
    chalk.grey(`
   -> This is a quiz game that reads its questions from a file
   -> Every question is read from the questions.json file
   -> Enjoy!
  `)
  )
}

function shuffle(originalArray) {
  var array = [].concat(originalArray);
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function question(prompt, responces, correct_index) {
  const random_responces = shuffle(responces)
  
  let result
  await inquirer
    .prompt([
      {
        type: "list",
        name: "question",
        message: prompt,
        choices: random_responces,
      },
    ])
    .then((answers) => {
      // if(answers.question != questions[correct_index]) result = false
      // result = true
      result = answers.question === responces[correct_index]
    })
    .catch((Error) => {
      if (Error.isTtyError) {
        throw Error("Your terminal is not compatible");
      } else {
        throw Error
      }
    })
    
    return result
}

async function checkAnswer(result) {

  const spinner = createSpinner("Checking the answer!")

  spinner.start()

  await sleep(3000)

  if(!result) {
    spinner.error({text: "Wrong Answer"})
    await sleep(1000)
    process.exit(1)
  }
  
  spinner.success({text: "Right Answer"})
}

async function listAnswers(questions) {
  const random_questions = shuffle(questions)

  for (let i = 0; i < random_questions.length; i++) {
    await checkAnswer(await question(random_questions[i].prompt, random_questions[i].responces, random_questions[i].correct_index))
  }
}

async function gameOver() {
  await sleep(500)

  figlet("Thank you for playing!", (Error, result) => {
    if(Error) throw Error
    
    console.log('\n', gradient.rainbow(result), '\n')
  })
}

await welcome()
await listAnswers(JSON.parse(fs.readFileSync('./questions.json')))
gameOver()