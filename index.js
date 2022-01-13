'use strict';

const likeBtnsQuery =
  '#top-level-buttons-computed > ytd-toggle-button-renderer, ytd-like-button-renderer > ytd-toggle-button-renderer';
const activeLikeBtnQuery = '.style-default-active';
const notifyMenuBtnQuery =
  '#notification-preference-button > ytd-subscription-notification-toggle-button-renderer';
const notifyBtnsQuery =
  '#items > ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer';
const subBtnQuery =
  '#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button';
const confirmBtnQuery = '#confirm-button';

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

const isPresent = (el) => {
  return location.pathname.startsWith('/shorts/')
    ? isInViewport(el)
    : isVisible(el);
};

const isHidden = (el) => {
  const style = window.getComputedStyle(el);
  return (style.display === 'none')
};

const getLikeBtns = () => {
  const elButtons = document.querySelectorAll(likeBtnsQuery);

  return [...elButtons].filter(isPresent);
};

const getActiveLikeBtn = () => {
  return document.querySelector(activeLikeBtnQuery);
};

const getNotifyMenuBtn = () => {
  return document.querySelector(notifyMenuBtnQuery);
};

const getNotifyBtns = () => {
  return document.querySelectorAll(notifyBtnsQuery);
};

const getSubBtn = () => {
  return document.querySelector(subBtnQuery);
};

const getConfirmBtn = () => {
  const elButton = document.querySelector(confirmBtnQuery);
  // if (isHidden(elButton)) return;
  return elButton;
};

const click = (el) => {
  if (!el) return;
  el.click();
  el.blur();
};

const activate = (el) => {
  if (!isActive(el)) {
    click(el);
  }
};

const onward = (cb, time = 0) => {
  setTimeout(cb, time);
};

const setLike = (mode) => {
  if (mode > 0) {
    activate(getLikeBtns()[0]);
    return;
  } else if (mode < 0) {
    activate(getLikeBtns()[1]);
    return;
  }

  click(getActiveLikeBtn());
};

const setNotify = (mode) => {
  const notifyBtns = getNotifyBtns();
  if (!notifyBtns[mode]) {
    click(getNotifyMenuBtn());
    onward(() => setNotify(mode));
    return;
  }
  click(notifyBtns[mode]);
};

const toggleSub = () => {
  const subBtn = getSubBtn();
  if (subBtn.hasAttribute('subscribed')) {
    onward(() => click(getConfirmBtn()));
  }
  click(subBtn);
};

const action = (type) => {
  switch (type) {
    case 'like':
      setLike(1);
      break;
    case 'dislike':
      setLike(-1)
      break;
    case 'unlike':
      setLike(0);
      break;

    case 'notify_all':
      setNotify(0);
      break;
    case 'notify_personal':
      setNotify(1);
      break;
    case 'notify_none':
      setNotify(2);
      break;

    case 'sub':
      toggleSub();
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
