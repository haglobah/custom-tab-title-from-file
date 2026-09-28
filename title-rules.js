// Pure title logic, loaded before apply-rules.js and also by the tests.

function renderTemplate(template, title, url, now) {
  const pageURL = new URL(url)
  return String(template).replaceAll('[page_title]', title)
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
}

// True when `title` already has the form the template produces, e.g. it
// already ends in " | claude.ai" for "[page_title] | claude.ai".
function isApplied(template, title, url, now) {
  const parts = String(template).split('[page_title]')
  if (parts.length === 1) {
    return title === renderTemplate(template, title, url, now)
  }
  if (parts.length > 2) {
    return false
  }
  const prefix = renderTemplate(parts[0], '', url, now)
  const suffix = renderTemplate(parts[1], '', url, now)
  return title.length >= prefix.length + suffix.length
    && title.startsWith(prefix)
    && title.endsWith(suffix)
}

// Returns the title to set, or null to leave the tab alone.
// Events without a title (favicon, status) fall back to the tab's current
// title, which may already be one we set, so every path checks for that.
function computeTitle({ changeTitle, tabTitle, url, lastApplied, rules, now }) {
  const title = changeTitle || tabTitle
  if (title === lastApplied) {
    return null
  }
  const rule = rules.filter((r) => r.title && RegExp(r.pattern, 'i').test(url)).pop()
  if (!rule || isApplied(rule.title, title, url, now)) {
    return null
  }
  return renderTemplate(rule.title, title, url, now)
}

// Code for tabs.executeScript that sets document.title.
function titleScript(newTitle) {
  return 'document.title = ' + JSON.stringify(newTitle) + ';'
}

if (typeof module !== 'undefined') {
  module.exports = { computeTitle, titleScript }
}
