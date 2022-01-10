'use strict';

const likeBtnsQuery =
  '#top-level-buttons-computed > ytd-toggle-button-renderer, ytd-like-button-renderer > ytd-toggle-button-renderer';
const activeLikeBtnQuery = '.style-default-active';

const isActive = (el) => el.classList.contains('style-default-active');

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= document.documentElement.clientHeight &&
    rect.right <= document.documentElement.clientWidth
  );
};

const isVisible = (el) => {
  return el.offsetWidth > 0 && el.offsetHeight > 0;
};

const getLikeBtns = () => {
  const elButtons = document.querySelectorAll(likeBtnsQuery);

  return [...elButtons].filter(
    location.pathname.startsWith('/shorts/') ? isInViewport : isVisible
  );
};

const click = (el) => {
  el.click();
  el.blur();
};

const action = (type) => {
  const [elLikeBtn, elDislikeBtn] = getLikeBtns();
  switch (type) {
    case 'like':
      if (!isActive(elLikeBtn)) {
        click(elLikeBtn);
      }
      break;
    case 'dislike':
      if (!isActive(elDislikeBtn)) {
        click(elDislikeBtn);
      }
      break;
    case 'unlike':
      const elActiveBtn = document.querySelector(activeLikeBtnQuery);
      click(elActiveBtn);
      break;

    default:
      console.warn(`Action ${type} isn't implemented yet!`);
      break;
  }
};

if (!window.firstTimeExecuted) {
  window.firstTimeExecuted = true;
  chrome.runtime.onMessage.addListener(({ msg }) => {
    action(msg);
  });
}
