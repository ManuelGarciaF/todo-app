const TodoFactory = ({
  title = "untitled",
  description = "",
  dueDate,
  priority = 0,
  projectId
} = {}) => ({
  title,
  description,
  dueDate,
  creationDate: new Date(),
  priority,
  projectId,
  completed: false
})

export default TodoFactory;
