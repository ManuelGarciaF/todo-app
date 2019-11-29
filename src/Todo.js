const TodoFactory = (title = "untitled", description = "", dateDue) => ({
  title,
  description,
  dateDue,
  completed: false
});

export default TodoFactory;
