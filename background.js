chrome.storage.onChanged.addListener((valueObj, _) => {
  if ('theme' in valueObj) {
    const { newValue } = valueObj.theme;

    chrome.tabs.query({}).then((tabList) =>
      tabList.forEach((tab) =>
        chrome.tabs.sendMessage(tab.id, {
          theme: newValue,
        })
      )
    );
  }

  if ('active' in valueObj) {
    const { newValue } = valueObj.active;

    chrome.tabs.query({}).then((tabList) =>
      tabList.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          active: newValue,
        })

      }
      )
    );
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ theme: "normal" });
  chrome.storage.local.set({ active: "true" });
});
