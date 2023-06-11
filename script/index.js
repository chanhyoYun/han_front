async function injectMainPage() {
  // 메인페이지 삽입
  for (let i = 1; i < 6; i++) {
    const navbarHtml = await fetch(`/html/landingPage/page${i}.html`);
    let data = await navbarHtml.text();
    document.querySelector(`div[data-anchor="page-${i}"]`).innerHTML = data;
  }
}

injectMainPage();

new Pageable("#scrollableContainer", {
  // 페이지 plugin
  pips: true,
  animation: 800,
  delay: 500,
  onBeforeStart: () => {
    document.querySelector(".nav").classList.add("nav-transparent");
  },
});

window.onload = () => {
  /**
   * 슬라이드 로딩 지연으로 setTimeout설정
   */
  setTimeout(() => {
    document.getElementById("menuStart").addEventListener("click", goQuiz);
    document.getElementById("mainStart").addEventListener("click", goQuiz);
    document.getElementById("menuLogin").addEventListener("click", goLogin);
    document.querySelector(".logo").addEventListener("click", goHome);
  }, 300);
};

function goQuiz() {
  window.location.href = "/html/quiz.html";
}

function goLogin() {
  window.location.href = "/html/login.html";
}

function goHome() {
  if (
    window.location.pathname === "/html/" ||
    window.location.pathname === "/html/index.html"
  ) {
    window.location.href = "/html/";
  } else {
    window.location.href = "/html/home.html";
  }
}
