"use strict";
import quotes from "/quotes.json" assert { type: "json" };

const addTask = document.querySelector(".add_task");
const addTaskBtn = document.querySelector(".add_task--btn");

const listaUl = document.querySelector(".lista_ul");
const listaCompletedUl = document.querySelector(".lista_ul_completed");
const clearTasks = document.querySelector(".clear_tasks_btn");
const calendar = document.querySelector(".calendar");

const quote = document.querySelector(".quotes");
const days = document.querySelectorAll(".calendar > div");
const date = document.querySelector(".date");
const titleDates = document.querySelectorAll(".title_date");

const todosArrSaved = localStorage.getItem("todosArrSaved")
  ? JSON.parse(localStorage.getItem("todosArrSaved"))
  : [];
let todayTodo;

const addQuote = () => {
  let randomIndex = Math.trunc(Math.random() * quotes.length);
  quote.innerHTML = `<p>"${quotes[randomIndex].text}"</p> <p class="peter">	&#8212; Peter Griffin</p>`;
};
addQuote();

const dateOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  weekday: "long",
};
const dateOptions2 = {
  day: "numeric",
  month: "short",
};
const locale = navigator.language;
const now = new Date();
date.textContent = new Intl.DateTimeFormat(locale, dateOptions).format(now);
for (const titleDate of titleDates) {
  titleDate.textContent = new Intl.DateTimeFormat(locale, dateOptions2).format(
    now
  );
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && addTask.value !== "") {
    let dayNumber;
    for (const titleDateNumber of titleDates) {
      dayNumber = titleDateNumber.textContent.slice(-2).trim();
    }
    const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
    dailytaskForDay.push(addTask.value);
    addTask.value = "";
    createTodo(dailytaskForDay);
  }
});

addTaskBtn.addEventListener("click", () => {
  if (addTask.value !== "") {
    let dayNumber;
    for (const titleDateNumber of titleDates) {
      dayNumber = titleDateNumber.textContent.slice(-2).trim();
    }
    const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
    dailytaskForDay.push(addTask.value);
    addTask.value = "";
    createTodo(dailytaskForDay);
  }
});

const createTodo = (arr) => {
  listaUl.innerHTML = "";

  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }

  arr.map((todo, id) => {
    let list = document.createElement("li");
    let btn = document.createElement("div");
    let xMark = document.createElement("div");
    let check = document.createElement("div");
    let checkCompleted = document.createElement("div");
    check.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    xMark.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    list.innerText = todo;

    xMark.addEventListener("click", () => {
      check.innerHTML = "";
      xMark.innerHTML = "";
      deleteTodo(id);
    });
    check.addEventListener("click", () => {
      btn.appendChild(checkCompleted);
      checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

      check.innerHTML = "";
      xMark.innerHTML = "";
      listaCompletedUl.appendChild(list);
      todosArrSaved[dayNumber - 1].completedDailyTasks.push(todo);
      deleteTodo(id);
    });
    list.appendChild(btn);
    btn.appendChild(xMark);
    btn.appendChild(check);
    listaUl.appendChild(list);
  });
  if (arr.length !== 0) {
    days[dayNumber - 1].classList.add("calendar_border");
  }

  localStorage.setItem("todosArrSaved", JSON.stringify(todosArrSaved));
};

const deleteTodo = (index) => {
  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }
  const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
  dailytaskForDay.splice(index, 1);

  if (index === 0) {
    days[dayNumber - 1].classList.remove("calendar_border");
  }
  localStorage.setItem("todosArrSaved", JSON.stringify(todosArrSaved));

  createTodo(dailytaskForDay);
};

const calendarFunction = () => {
  const firstDay = new Date(now.getFullYear(), now.getMonth());

  if (firstDay.getDay() === 0) {
    for (let i = 1; i < 7; i++) {
      calendar.insertAdjacentHTML("afterbegin", "<div></div>");
    }
    for (let i = 1; i < 6; i++) {
      calendar.insertAdjacentHTML("beforeend", "<div></div>");
    }
  }

  for (let i = 0; i < calendar.childElementCount; i++) {
    if (calendar.children[i].textContent === "") {
      calendar.children[i].style.border = "none";
    }
    if (calendar.children[i].textContent == now.getDate()) {
      let dayNumber = Number(calendar.children[i].textContent.slice(-2).trim());
      calendar.children[i].style.backgroundColor = "var(--darker)";
      calendar.children[i].style.color = "white";

      todosArrSaved[dayNumber - 1].completedDailyTasks.map((x) => {
        let btn = document.createElement("div");
        let xMark = document.createElement("div");
        let check = document.createElement("div");
        let checkCompleted = document.createElement("div");
        checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

        let list = document.createElement("li");
        list.innerText = x;
        btn.appendChild(checkCompleted);
        list.appendChild(btn);

        listaCompletedUl.appendChild(list);
        check.addEventListener("click", () => {
          checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

          check.innerHTML = "";
          xMark.innerHTML = "";
          btn.appendChild(checkCompleted);

          list.appendChild(btn);

          listaCompletedUl.appendChild(list);
        });
      });

      createTodo(todosArrSaved[dayNumber - 1].dailytask);
    }
  }
  localStorage.setItem("todosArrSaved", JSON.stringify(todosArrSaved));
};
calendarFunction();
for (const day of days) {
  todosArrSaved.push({
    dayNumber: `${day.textContent}`,
    dailytask: [],
    completedDailyTasks: [],
  });
  let dayNumb = Number(day.textContent.slice(-2).trim());
  if (todosArrSaved[dayNumb - 1].dailytask.length !== 0) {
    days[dayNumb - 1].classList.add("calendar_border");
  }
}

for (const day of days) {
  day.addEventListener("click", () => {
    let allDay = [...days];
    allDay.map((x) => (x.style.border = "none"));
    day.style.border = "3px dashed var(--lighter)";
    for (const titleDate of titleDates) {
      const now2 = new Date(
        now.getFullYear(),
        now.getMonth(),
        `${Number(day.textContent)}`
      );

      titleDate.textContent = new Intl.DateTimeFormat(
        locale,
        dateOptions2
      ).format(now2);
    }

    let dayNumber;
    for (const titleDateNumber of titleDates) {
      dayNumber = titleDateNumber.textContent.slice(-2).trim();
    }

    todayTodo = todosArrSaved.find((x) => x.dayNumber == `${day.textContent}`);

    listaUl.innerHTML = "";
    listaCompletedUl.innerHTML = "";

    todayTodo.dailytask.map((x, index) => {
      let btn = document.createElement("div");
      let xMark = document.createElement("div");
      let check = document.createElement("div");
      let list = document.createElement("li");
      check.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
      xMark.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
      list.innerText = x;
      list.appendChild(btn);
      btn.appendChild(xMark);
      btn.appendChild(check);
      listaUl.appendChild(list);

      xMark.addEventListener("click", () => {
        let xMark = document.createElement("div");
        let check = document.createElement("div");

        check.innerHTML = "";
        xMark.innerHTML = "";
        deleteTodo(index);
      });
      check.addEventListener("click", () => {
        let btn = document.createElement("div");
        let xMark = document.createElement("div");
        let check = document.createElement("div");
        let checkCompleted = document.createElement("div");
        let list = document.createElement("li");
        btn.appendChild(checkCompleted);
        checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        list.innerText = x;
        list.appendChild(btn);
        check.innerHTML = "";
        xMark.innerHTML = "";
        listaCompletedUl.appendChild(list);
        deleteTodo(index);
      });
    });
    todayTodo.completedDailyTasks.map((x) => {
      let btn = document.createElement("div");
      let xMark = document.createElement("div");
      let check = document.createElement("div");
      let checkCompleted = document.createElement("div");
      checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

      let list = document.createElement("li");
      list.innerText = x;
      btn.appendChild(checkCompleted);
      list.appendChild(btn);

      listaCompletedUl.appendChild(list);
      check.addEventListener("click", () => {
        checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

        check.innerHTML = "";
        xMark.innerHTML = "";
        btn.appendChild(checkCompleted);

        list.appendChild(btn);

        listaCompletedUl.appendChild(list);
        todosArrSaved[dayNumber - 1].completedDailyTasks.push(x);
        deleteTodo(id);
      });
    });
  });
}

clearTasks.addEventListener("click", () => {
  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }
  todosArrSaved[dayNumber - 1].completedDailyTasks = [];
  listaCompletedUl.innerHTML = "";
  localStorage.setItem("todosArrSaved", JSON.stringify(todosArrSaved));
});
