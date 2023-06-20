import { getQuizApi, sendQuizResultApi, sendQuizReportApi } from "./api.js";

// 랜덤으로 문제를 선택하는 함수
function randomChoice(obj) {
  let choicedIndex = Math.floor(Math.random() * obj.length);
  let choicedItem = obj.splice(choicedIndex, 1);
  return choicedItem[0];
}

// 퀴즈 가져오는 함수
async function getQuiz() {
  // query문에 따라서 다른 퀴즈에 접속가능하게 하기
  const urlParams = new URL(location.href).searchParams;
  const quizType = urlParams.get("type");
  let quizzes;

  if (!quizType) {
    quizzes = await getQuizApi();
  } else {
    quizzes = await getQuizApi(quizType);
  }

  return quizzes;
}

// 가져온 퀴즈를 보여주기
async function showQuiz(quizzes) {
  let quizProgress = 0;

  if (quizzes === Number) {
    // 문제를 가져오는데 실패했습니다.
  } else {
    const quizCounts = quizzes["counts"];
    const quizzesOneOfTwo = quizzes["one_of_two"] || [];
    const quizzesMeaning = quizzes["meaning"] || [];
    const quizzesFillInTheBlank = quizzes["fill_in_the_blank"] || [];

    quizzes = [...quizzesOneOfTwo, ...quizzesMeaning, ...quizzesFillInTheBlank];
    console.log(quizCounts);

    const sumQuiz = quizCounts.reduce((a, b) => a + b);
    let restOfQuiz = [...Array(sumQuiz).keys()];

    while (0 < restOfQuiz.length) {
      let nextQuizIndex = randomChoice(restOfQuiz);
      if (nextQuizIndex < quizCounts[0]) {
        OneOfTwo(quizzes[nextQuizIndex]);
      } else if (nextQuizIndex < quizCounts[0] + quizCounts[1]) {
        Meaning(quizzes[nextQuizIndex]);
      } else if (
        nextQuizIndex <
        quizCounts[0] + quizCounts[1] + quizCounts[2]
      ) {
        FillInTheBlank(quizzes[nextQuizIndex]);
      }
    }
  }

  xpBar.setAttribute("style", `width: calc(9.9% * ${quizProgress})`);
  xpText.innerText = `${quizProgress} / 10`;
}

async function OneOfTwo(quiz) {
  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "알쏭달쏭 우리말 퀴즈";
  quizTitle.innerHTML = `<h1>${quiz.title}</h1>`;

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";

  for (let i = 0; i < quiz.options.length; i++) {
    let optionDiv = document.createElement("div");
    optionDiv.setAttribute("class", "quiz");

    let optionH2 = document.createElement("h2");
    optionH2.setAttribute("id", i);
    optionH2.innerText = quiz.options[i].content;
    optionH2.addEventListener("click", selectOption);
    optionDiv.append(optionH2);

    quizContent.append(optionDiv);
  }
}

async function Meaning(quiz) {
  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "단어 맞추기";
  quiz.explains.forEach((explain) => {
    quizTitle.innerHTML = `<h1>${explain.content}</h1>`;
  });

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";

  for (let i = 0; i < quiz.words_list.length; i++) {
    let optionDiv = document.createElement("div");
    optionDiv.setAttribute("class", "quiz");

    let optionH2 = document.createElement("h2");
    optionH2.setAttribute("id", i);
    optionH2.innerText = quiz.words_list[i];
    optionH2.addEventListener("click", selectOption);
    optionDiv.append(optionH2);
    quizContent.append(optionDiv);
  }
}

async function FillInTheBlank(quiz) {
  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "빈칸 채우기";
  quizTitle.innerHTML = `<h1>${quiz.content}</h1>`;

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";
  quiz.dict_word.examples.forEach((example) => {
    quizContent.innerHTML += `<h3>${example}</h3>`;
  });
  quizContent.innerHTML += `
  <input id="inputBox" type="text" placeholder="답안 입력"></input>`;
}

function selectOption(e) {
  const options = document.querySelectorAll("h2");
  options.forEach((option) => {
    option.classList.remove("selected");
  });
  e.target.classList.add("selected");
}

function confirmQuiz() {
  const quiz = quizzes[quizIndex];

  if (quizIndex < quizCounts[0]) {
    const options = document.getElementsByClassName("selected");
    if (options.length == 0) {
      alert("❗ 정답을 골라주세요");
      return;
    }
    if (quiz.options[options[0].id].is_answer) {
      alert("✅ 정답입니다" + "\n\n해설:" + quiz.explain);
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + "\n\n해설:" + quiz.explain);
      quiz["solved"] = false;
    }
  } else if (quizIndex < quizCounts[0] + quizCounts[1]) {
    const options = document.getElementsByClassName("selected");
    if (options.length == 0) {
      alert("정답을 골라주세요");
      return;
    }
    if (quiz.answer_index == options[0].id) {
      alert("✅ 정답입니다");
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + `\n\n정답은" ${quiz.word} 입니다`);
      quiz["solved"] = false;
    }
  } else if (quizIndex < quizCounts[0] + quizCounts[1] + quizCounts[2]) {
    const inputWord = document.getElementById("inputBox").value;
    if (inputWord == false) {
      alert("정답을 적어주세요");
      return;
    }
    if (quiz.dict_word.word == inputWord) {
      alert("✅ 정답입니다");
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + `\n\n정답은 ${quiz.dict_word.word} 입니다`);
      quiz["solved"] = false;
    }
  }
  nextStep();
}

function nextStep() {
  quizIndex++;

  const xpBar = document.getElementById("xp-bar-now");
  const xpText = document.getElementById("xp-text");

  xpBar.setAttribute("style", `width: calc(9.9% * ${quizIndex})`);
  xpText.innerText = `${quizIndex} / 10`;

  if (quizIndex == quizzes.length) {
    answerBtn.style.display = "none";
    resultBtn.style.display = "block";

    finishQuiz();
  } else {
    showQuiz();
  }
}

async function finishQuiz() {
  await sendQuizResultApi(quizzes);
  localStorage.setItem("correctCount", correctCount);
}

function goResult() {
  window.location.replace("/html/quiz_result.html");
}

function reportModalOpen() {
  modal.classList.toggle("show");
}

// modal.addEventListener("click", (event) => {
//   if (event.target === modal) {
//     modal.classList.toggle("show");
//   }
// });

async function reportSubmitBtn() {
  const quiz = quizzes[quizIndex];
  const content = document.getElementById("report-content");

  const reportData = { content: content.value };
  const response = await sendQuizReportApi(quiz.id, reportData);
  alert(response.message);
  content.value = "";
}

// 페이지 로딩될 때 불러옴
getQuiz().then((quizzes) => {
  showQuiz(quizzes);
});

// document.getElementById("answer-button").addEventListener("click", confirmQuiz);
// document.getElementById("result-button").addEventListener("click", goResult);
// document
//   .getElementById("report-button")
//   .addEventListener("click", reportModalOpen);
// document
//   .getElementById("report-submit-button")
//   .addEventListener("click", reportSubmitBtn);
// let modal = document.querySelector(".modal");
// let quizzes;
// let quizCounts;
// let quizIndex = 0;
// let correctCount = 0;

// let quizzesOneOfTwo;
// let quizzesMeaning;
// let quizzesFillInTheBlank;

// const xpBar = document.getElementById("xp-bar-now");
// const xpText = document.getElementById("xp-text");

// const answerBtn = document.getElementById("answer-button");
// const resultBtn = document.getElementById("result-button");

// // query문에 따라서 다른 퀴즈에 접속가능하게 하기
// const urlParams = new URL(location.href).searchParams;
// const quizType = urlParams.get("type");

// function randomChoice(obj) {
//   let choicedIndex = Math.floor(Math.random() * obj.length);
//   let choicedItem = obj.splice(choicedIndex, 1);
//   return choicedItem[0];
// }

// async function getQuiz() {
//   if (!quizType) {
//     quizzes = await getQuizApi();
//   } else {
//     quizzes = await getQuizApi(quizType);
//   }
//   quizCounts = quizzes["counts"];
//   quizzesOneOfTwo = quizzes["one_of_two"] || [];
//   quizzesMeaning = quizzes["meaning"] || [];
//   quizzesFillInTheBlank = quizzes["fill_in_the_blank"] || [];

//   quizzes = [...quizzesOneOfTwo, ...quizzesMeaning, ...quizzesFillInTheBlank];

//   xpBar.setAttribute("style", `width: calc(9.9% * ${quizIndex})`);
//   xpText.innerText = `${quizIndex} / 10`;
// }

// async function showQuiz() {
//   const sumQuiz = quizCounts.reduce((a, b) => a + b);
//   let restOfQuiz = [...Array(sumQuiz).keys()];

//   while (0 < restOfQuiz.length) {
//     let nextQuizIndex = randomChoice(restOfQuiz);
//     console.log(quizzes[nextQuizIndex]);
//   }

//   if (quizIndex < quizCounts[0]) {
//     OneOfTwo();
//   } else if (quizIndex < quizCounts[0] + quizCounts[1]) {
//     Meaning();
//   } else if (quizIndex < quizCounts[0] + quizCounts[1] + quizCounts[2]) {
//     FillInTheBlank();
//   }
// }

// window.onload = async function () {
//   getQuiz().then(() => {
//     showQuiz();
//   });
//   resultBtn.style.display = "none";
//   localStorage.removeItem("correctCount");
// };
