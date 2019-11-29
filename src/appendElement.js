export default (parent, tag, attributes = {}) => {
  const elem = document.createElement(tag);
  parent.appendChild(elem);
  
  Object.entries(attributes).forEach(pair => {
    elem.setAttribute(pair[0], pair[1])
  })

  return elem;
};
