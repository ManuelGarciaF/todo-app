import "./styles/main.scss";
import "./svg/clear.svg";
import "./favicons/favicons";

import TodoFactory from "./Todo";
import ProjectFactory from "./Project";
import appendElement from "./appendElement";

import { parse, format } from "date-fns";

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function setCurrentProject(index) {
  currentProject = projects[index];

  const projectList = document.getElementById("project-list");

  const selectedLi = projectList.querySelector(".selected");
  if (selectedLi) selectedLi.classList.remove("selected");

  projectList
    .querySelector(`[data-index="${index}"]`)
    .classList.add("selected");
}

// Renders the project list sidebar from a projects array.
function renderProjectList(projects) {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = "";

  projects.forEach((project, index) => {
    const li = appendElement(projectList, "li", {
      "data-index": index
    });
    li.innerHTML = project.title;
    projectList.appendChild(li);

    li.addEventListener("click", () => {
      setCurrentProject(projects.indexOf(project));
      renderCurrentProject(currentProject);
    });
  });
  setCurrentProject(projects.indexOf(currentProject));
}

function renderCurrentProject(project) {
  // Set title on card.
  document.getElementById("project-name").textContent = project.title;
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  // Make each li through a tedious process.
  project.todos.forEach((element, index) => {
    const li = appendElement(todoList, "li", {
      "data-index": index
    });

    const topBar = appendElement(li, "div", {
      class: "top-bar"
    });

    const label = appendElement(topBar, "label", {
      class: "checkbox"
    });

    const checkboxInput = appendElement(label, "input", {
      type: "checkbox"
    });
    if (element.completed) checkboxInput.setAttribute("checked", "");

    checkboxInput.addEventListener("change", event => {
      element.completed = event.target.checked;

      // Reload project.
      renderCurrentProject(currentProject);

      saveProjects();
    });

    appendElement(label, "span");
    const todoTitle = appendElement(
      label,
      "h4",
      element.completed ? { class: "done" } : {}
    );
    todoTitle.textContent = element.title;

    if (element.completed) {
      const clearIcon = appendElement(topBar, "img", {
        src: "clear.svg",
        alt: "clear"
      });
      clearIcon.addEventListener("click", () => {
        project.todos.splice(index, 1);

        // Reload project.
        renderCurrentProject(currentProject);

        saveProjects();
      });
    }

    const descriptionDiv = appendElement(li, "div", {
      class: "description"
    });
    const descriptionText = appendElement(descriptionDiv, "p");
    descriptionText.textContent = element.description;

    const dateDue = new Date(element.dateDue);
    const descriptionDate = appendElement(descriptionDiv, "p");
    descriptionDate.textContent = `Due ${format(dateDue, "dd/MM/yyyy")}`;
  });
}

// Gets projects from localStorage, if not present, sets it as an array with a default project.
let projects = JSON.parse(localStorage.getItem("projects"));
if (!projects) projects = [ProjectFactory("Default Project")];

// Set current project to the first project retrieved.
let currentProject = projects[0];

// Remove current project logic.
document.getElementById("delete-project").addEventListener("click", () => {
  projects.splice(projects.indexOf(currentProject), 1);

  // Set currentProject to the next first project or create a new one.
  if (projects.length < 1) {
    projects[0] = ProjectFactory("Default Project");
  }
  setCurrentProject(0);

  renderProjectList(projects);
  renderCurrentProject(currentProject);
  saveProjects();
});

// New project form logic.
document
  .getElementById("project-title-submit")
  .addEventListener("click", () => {
    const title = document.getElementById("project-title-input").value;

    if (title.length < 1) return;

    projects.push(ProjectFactory(title));
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjectList(projects);
  });

// New todo form logic.
document.getElementById("new-todo-submit").addEventListener("click", () => {
  const title = document.getElementById("new-todo-title").value;
  const description = document.getElementById("new-todo-description").value;

  // Parse the date into a date object.
  const dateDue = parse(
    document.getElementById("new-todo-date").value,
    "dd/MM/yyyy",
    new Date()
  );

  // Check if date is valid.
  if (!isNaN(dateDue)) {
    document.getElementById("date-error").style.display = "none";
    const todo = TodoFactory(title, description, dateDue.getTime());
    currentProject.todos.push(todo);
    saveProjects();
  } else {
    document.getElementById("date-error").style.display = "block";
  }

  renderCurrentProject(currentProject);
});

// Place current date on Due Date input
document.getElementById("new-todo-date").value = format(
  new Date(),
  "dd/MM/yyyy"
);

renderProjectList(projects);
renderCurrentProject(currentProject);
setCurrentProject(0);
