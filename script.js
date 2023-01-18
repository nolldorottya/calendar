"use strict";
import quotes from "./quotes.json" assert { type: "json" };
// TODO deletetodo id-ja! kell mindenhova az x és a pipa!
const addTask = document.querySelector(".add_task");
const addTaskBtn = document.querySelector(".add_task--btn");
const name = document.querySelector(".name");
const listaUl = document.querySelector(".lista_ul");
const listaCompletedUl = document.querySelector(".lista_ul_completed");
const clearTasks = document.querySelector(".clear_tasks_btn");
const calendar = document.querySelector(".calendar");
const overlay = document.querySelector(".overlay");
const chooseTheme = document.querySelector(".choose_theme");
const purpleTheme = document.querySelector(".purple");
const greenTheme = document.querySelector(".green");
const blackTheme = document.querySelector(".black");
const chooseThemeBtn = document.querySelector(".choose_theme--btn");
const promptMessage = document.querySelector(".prompt_message");
const nameInput = document.querySelector(".name_input");
const nameBtn = document.querySelector(".name_input--btn");
const quote = document.querySelector(".quotes");
const days = document.querySelectorAll(".calendar > div");
const date = document.querySelector(".date");
const titleDates = document.querySelectorAll(".title_date");
let daysinfo = new Map();
const todosArrSaved = [];
let todayTodo;
//MOBILE/////////////////////////

const addQuote = () => {
  let randomIndex = Math.trunc(Math.random() * quotes.length);
  quote.innerHTML = `<p>"${quotes[randomIndex].text}"</p> <p class="peter">	&#8212; Peter Griffin</p>`;
};
// choose theme
purpleTheme.addEventListener("click", () => {
  document.documentElement.style.setProperty(
    "--darker",
    "rgba(125, 97, 239, 1)"
  );
  document.documentElement.style.setProperty(
    "--lighter",
    "rgba(226, 114, 188, 1)"
  );
  document.documentElement.style.setProperty(
    "--border",
    "rgba(125, 97, 239, 0.2)"
  );
});
greenTheme.addEventListener("click", () => {
  document.documentElement.style.setProperty(
    "--darker",
    "rgba(9, 208, 137, 1)"
  );
  document.documentElement.style.setProperty(
    "--lighter",
    "rgba(134, 231, 244, 1)"
  );
  document.documentElement.style.setProperty(
    "--border",
    "rgba(9, 208, 137, 0.2)"
  );
});
blackTheme.addEventListener("click", () => {
  document.documentElement.style.setProperty("--darker", "rgba(0, 0, 0, 1)");
  document.documentElement.style.setProperty(
    "--lighter",
    "rgba(175, 175, 175, 1)"
  );
  document.documentElement.style.setProperty("--border", "rgba(0, 0, 0, 0.2)");
});

chooseThemeBtn.addEventListener("click", () => {
  chooseTheme.classList.add("hidden");
  promptMessage.classList.remove("hidden");
});

nameBtn.addEventListener("click", () => {
  if (nameInput.value !== "") {
    name.textContent = `Have a nice day, ${nameInput.value}!`;
    promptMessage.classList.add("hidden");
    overlay.classList.add("hidden");
    addQuote();
  }
});
document.addEventListener("keydown", (e) => {
  if (nameInput.value !== "" && e.key === "Enter") {
    name.textContent = `Have a nice day, ${nameInput.value}!`;
    promptMessage.classList.add("hidden");
    overlay.classList.add("hidden");
    addQuote();
  }
});

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

// document.addEventListener("keydown", function (e) {
//   if (e.key === "Enter" && addTask.value !== "") {
//     let dayNumber;
//     for (const titleDateNumber of titleDates) {
//       dayNumber = titleDateNumber.textContent.slice(-2).trim();
//     }
//     const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
//     dailytaskForDay.push(addTask.value);
//     createTodo(dailytaskForDay);
//     // createTodo(todosArr);
//     addTask.value = "";
//   }
// });
addTaskBtn.addEventListener("click", () => {
  if (addTask.value !== "") {
    let dayNumber;
    for (const titleDateNumber of titleDates) {
      dayNumber = titleDateNumber.textContent.slice(-2).trim();
    }
    const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
    dailytaskForDay.push(addTask.value);
    addTask.value = "";

    // console.log(dailytaskForDay);
    createTodo(dailytaskForDay);
  }
});

const createTodo = (arr) => {
  listaUl.innerHTML = "";

  console.log(arr);
  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }

  let list = document.createElement("li");
  let btn = document.createElement("div");
  let xMark = document.createElement("div");
  let check = document.createElement("div");
  let checkCompleted = document.createElement("div");
  arr.forEach((todo, id) => {
    check.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    xMark.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    list.innerText = todo;
    checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

    xMark.addEventListener("click", () => {
      check.innerHTML = ""; //??????
      xMark.innerHTML = ""; //??????
      console.log(id);
      deleteTodo(id);
    });
    check.addEventListener("click", () => {
      btn.appendChild(checkCompleted);
      checkCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

      check.innerHTML = "";
      xMark.innerHTML = "";
      listaCompletedUl.appendChild(list);
      todosArrSaved[dayNumber - 1].completedDailyTasks.push(todo);
      console.log(todosArrSaved[dayNumber - 1].completedDailyTasks);
      deleteTodo(id);
    });
    list.appendChild(btn);
    btn.appendChild(xMark);
    btn.appendChild(check);
    listaUl.appendChild(list);
  });

  console.log(todosArrSaved[dayNumber - 1]);
};

const deleteTodo = (index) => {
  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }
  const dailytaskForDay = todosArrSaved[dayNumber - 1].dailytask;
  dailytaskForDay.splice(index, 1);
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
      calendar.children[i].style.backgroundColor = "var(--darker)";
      calendar.children[i].style.color = "white";
    }
  }
};
calendarFunction();
for (const day of days) {
  todosArrSaved.push({
    dayNumber: `${day.textContent}`,
    dailytask: [],
    completedDailyTasks: [],
  });
}
for (const day of days) {
  // console.log(todosArrSaved);
  day.addEventListener("click", () => {
    todayTodo = todosArrSaved.find((x) => x.dayNumber == `${day.textContent}`);
    listaUl.innerHTML = "";
    listaCompletedUl.innerHTML = "";
    todayTodo.dailytask.map((x) => {
      const list = document.createElement("li");
      list.innerText = x;
      listaUl.appendChild(list);
    });
    todayTodo.completedDailyTasks.map((x) => {
      const list = document.createElement("li");
      list.innerText = x;
      listaCompletedUl.appendChild(list);
    });

    // console.log(todayTodo);
    // console.log(...todosArrSaved[dayNumber - 1].dailytask);
    // const node = todosArrSaved[dayNumber - 1].dailytask;
    // const [obj] = node;
    // const { dailytask } = node;

    // listaUl.insertAdjacentHTML(
    //   "afterbegin",
    //   `...${todosArrSaved[dayNumber - 1].dailytask}`
    // );
    // let savedList = document.createElement("li");
    // const node = document.createTextNode("valami");
    // savedList.appendChild(node);
    // savedList.innerText = todosArrSaved[dayNumber - 1].dailytask;
    // listaUl.appendChild(savedList);
    // console.log(todosArrSaved[dayNumber - 1].dailytask);

    // listaUl.textContent = todosArrSaved[dayNumber - 1].dailytask;
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
    // console.log(day.textContent);
    // console.log(todosArrSaved);
    // for (const todosArrSavedElement of todosArrSaved) {
    //   if (`${todosArrSavedElement}.${day.textContent}`) {
    //     console.log(`${todosArrSavedElement}`);
    //   }
    //   if (!`${todosArrSavedElement}.${day.textContent}`) {
    //     todosArrSaved.push(todosArrSavedElement);
    //   }
    // }
    // daysinfo.set(`${day.textContent}`, todosArrforMap);
    // console.log(daysinfo);
    // listaUl.textContent = daysinfo.get(`${day.textContent}`);
    // console.log(daysinfo.get("1"));
    // console.log(daysinfo.get("2"));
  });
  if (Number(day.textContent) !== now.getDate()) {
    day.addEventListener("click", () => {
      day.classList.toggle("calendar_border");
    });
  }
}

clearTasks.addEventListener("click", () => {
  let dayNumber;
  for (const titleDateNumber of titleDates) {
    dayNumber = titleDateNumber.textContent.slice(-2).trim();
  }
  todosArrSaved[dayNumber - 1].completedDailyTasks = [];
  listaCompletedUl.innerHTML = "";
});

console.log(todosArrSaved);
