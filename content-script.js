window.onload = async () => {
  const src = chrome.runtime.getURL("modules/counter.js");
  const counterScript = await import(src);

  const { App } = counterScript;

  App.setTags();

  const allInputs = document.body.querySelectorAll("input");
  
  let current_theme = (await chrome.storage.local.get(["theme"]))["theme"];
  const initVisible = (await chrome.storage.local.get(["active"]))["active"];
  
  const app = new App(allInputs, current_theme);
  if (initVisible === 'false') {
    app.remove();
  }
  

  chrome.runtime.onMessage.addListener(({ theme, active }) => {
    
    if (theme !== undefined) {
      current_theme = theme;
      app.update(current_theme);
    }

    if (active === 'false') {
      app.remove();
    } else if (active === 'true') {
      app.update(current_theme)
    }
  });

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  const observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    app.remove();
    app.init(current_theme);
    // ...
  });

  allInputs.forEach((elem) => {
    if (
      elem.type === "text" ||
      elem.type === "password" ||
      elem.type === "number" ||
      elem.type === "search" ||
      elem.type === "email"
    ) {
      observer.observe(elem, {
        subtree: true,
        attributes: true,
        childList: true,
      });
    }
  });
};
