const addInTitles = {}

function applyRules(tabId, changeInfo) {

  if (!!addInTitles[tabId] && addInTitles[tabId] == changeInfo.title) {
    return
  }

  let targetTab = browser.tabs.get(tabId);
  targetTab.then((tab) => {

    let title = changeInfo.title || tab.title;
    let url = changeInfo.url || tab.url;

      let allRules = browser.storage.sync.get("regexTitleRules");
      allRules.then((data) => {
        const rules = data.regexTitleRules || [];
        for (const rule of rules) {

          if (RegExp(rule.pattern, 'i').test(url)) {

            if (rule.title) {
              let newTitle = String(rule.title)

            const pageURL = new URL(url)
            const now = new Date()

            newTitle = newTitle.replaceAll('[page_title]', title)
              .replaceAll('[page_url]', pageURL.href)
              .replaceAll('[page_host]', pageURL.host)
              .replaceAll('[page_hostname]', pageURL.hostname)
              .replaceAll('[page_hash]', pageURL.hash)
              .replaceAll('[page_search]', pageURL.search)
              .replaceAll('[page_username]', pageURL.username)
              .replaceAll('[page_origin]', pageURL.origin)
              .replaceAll('[page_pathname]', pageURL.pathname)
              .replaceAll('[page_port]', pageURL.port)
              .replaceAll('[page_protocol]', pageURL.protocol)
              .replaceAll('[year]', now.getFullYear())
              .replaceAll('[month]', now.getMonth() + 1)
              .replaceAll('[date]', now.getDate())
              .replaceAll('[weekday]', now.getDay())
              .replaceAll('[hours]', now.getHours())
              .replaceAll('[minutes]', now.getMinutes())
              .replaceAll('[seconds]', now.getSeconds())
            browser.tabs.executeScript(tabId, {
              code: "document.title = '" + newTitle + "'; "
            });

            addInTitles[tabId] = newTitle
          }

        }
      }
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

