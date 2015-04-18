var isVisible = function(el) {
  var top = el.getBoundingClientRect().top, rect, el = el.parentNode;
  do {
    rect = el.getBoundingClientRect();
    if (top <= rect.bottom === false)
      return false;
    el = el.parentNode;
  } while (el != document.body);
  // Check its within the document viewport
  return top <= document.documentElement.clientHeight;
};
