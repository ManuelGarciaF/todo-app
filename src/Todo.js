const TodoFactory = ({
  title = "untitled",
  description = "",
  dueDate = "",
  priority = 0,
  projectId
} = {}) => ({
  title,
  description,
  dueDate,
  priority,
  projectId,
  completed: false
})

export default TodoFactory;
