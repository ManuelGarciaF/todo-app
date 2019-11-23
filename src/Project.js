const ProjectFactory = (title = "") => ({
  type: "project",
  title,
  todos: []
})

export default ProjectFactory