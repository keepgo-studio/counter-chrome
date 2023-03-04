import { App } from "./modules/counter.js";

function setTitle() {
  const titleMsg = chrome.i18n.getMessage("styleTitle");

  document.body.querySelector("h1").textContent = `${titleMsg} 😎`;
}

function setButton(isActive) {
  const buttonMsg = chrome.i18n.getMessage("button");
  let adjMsg = "";

  if (isActive === "false") {
    adjMsg = chrome.i18n.getMessage("active");
  } else {
    adjMsg = chrome.i18n.getMessage("inactive");
  }

  document.body.querySelector(".app-button").textContent = `${buttonMsg} ${adjMsg}`;
  document.body
    .querySelector(".app-button")
    .setAttribute("active", `${!JSON.parse(isActive)}`);
}

(async () => {
  App.setTags();

  const allTheme = document.body.querySelectorAll(".theme");

  allTheme.forEach((elem) => {
    elem
      .querySelector("button")
      .addEventListener("click", () => {
        chrome.storage.local.set({ theme: elem.classList.item(1) })
        chrome.storage.local
        .set({ active: 'true' })
        .then((result) => {
          setButton(isActive);
        })
        .catch((err) => {});
      }
      );

    new App(elem.querySelectorAll("input"), elem.classList.item(1));
  });

  const button = document.body.querySelector(".app-button");
  let isActive = (await chrome.storage.local.get(["active"]))["active"];

  button.addEventListener("click", () => {
    if (isActive === "true") {
      isActive = "false";
    } else {
      isActive = "true";
    }

    chrome.storage.local
      .set({ active: isActive })
      .then((result) => {
        setButton(isActive);
      })
      .catch((err) => {});
  });

  setTitle();
  setButton(isActive);
})();
