const ProjectFactory = (title = "Unnamed Project") => ({
  type: "project",
  title,
  todos: []
})

export default ProjectFactory