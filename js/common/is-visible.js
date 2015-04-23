var isVisible = function(el) {
  var top = el.getBoundingClientRect().top;
  var maxRectHeight = el.getBoundingClientRect().bottom - top;
  var rect, el = el.parentNode;
  do {
    if (el.style.display === 'none') {
      return false;
    }
    rect = el.getBoundingClientRect();
    if ((rect.bottom - rect.top >= maxRectHeight) && (top <= rect.bottom === false)) {
      return false;
    }
    maxRectHeight = Math.max(maxRectHeight, rect.bottom - rect.top);
    el = el.parentNode;
  } while (el != document.body);
  // Check its within the document viewport
  return top <= document.documentElement.clientHeight;
};
