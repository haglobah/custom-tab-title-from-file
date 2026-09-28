// computeTitle and titleScript come from title-rules.js (loaded first).
const addInTitles = {}

function applyRules(tabId, changeInfo) {
  browser.tabs.get(tabId).then((tab) => {
    browser.storage.sync.get("regexTitleRules").then((data) => {
      const newTitle = computeTitle({
        changeTitle: changeInfo.title,
        tabTitle: tab.title,
        url: changeInfo.url || tab.url,
        lastApplied: addInTitles[tabId],
        rules: data.regexTitleRules || [],
        now: new Date(),
      })
      if (newTitle === null) {
        return
      }
      addInTitles[tabId] = newTitle
      browser.tabs.executeScript(tabId, { code: titleScript(newTitle) });
    });
  });
}

browser.tabs.onUpdated.addListener(
  (tabId, changeInfo) => {
    applyRules(tabId, changeInfo);
  }, {
    properties:['url', 'status', 'title', 'favIconUrl']
  }
);

browser.tabs.onRemoved.addListener((tabId) => {
  delete addInTitles[tabId]
});
