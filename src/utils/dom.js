export function getOffsetTop(elem) {
  let top = 0;
  do {
    if (!isNaN(elem.offsetTop)) {
      top += elem.offsetTop;
    }

  } while ((elem = elem.offsetParent));
  return top;
}
