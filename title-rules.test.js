const { test } = require('node:test')
const assert = require('node:assert/strict')
const { computeTitle, titleScript } = require('./title-rules.js')

const rules = [{ pattern: 'claude\\.ai', title: '[page_title] | claude.ai' }]
const url = 'https://claude.ai/chat/abc'
const now = new Date(2026, 8, 28, 12, 0, 0)

test('page title change gets the suffix', () => {
  const t = computeTitle({ changeTitle: 'Chat', tabTitle: 'Chat', url, lastApplied: undefined, rules, now })
  assert.equal(t, 'Chat | claude.ai')
})

test('title change event for our own title is ignored', () => {
  const t = computeTitle({ changeTitle: 'Chat | claude.ai', tabTitle: 'Chat | claude.ai', url, lastApplied: 'Chat | claude.ai', rules, now })
  assert.equal(t, null)
})

test('favicon/status event after we set the title leaves it alone', () => {
  const t = computeTitle({ changeTitle: undefined, tabTitle: 'Chat | claude.ai', url, lastApplied: 'Chat | claude.ai', rules, now })
  assert.equal(t, null)
})

test('already-suffixed tab is left alone after the extension reloads', () => {
  const t = computeTitle({ changeTitle: undefined, tabTitle: 'Chat | claude.ai', url, lastApplied: undefined, rules, now })
  assert.equal(t, null)
})

test('fixed-title rule is not reapplied', () => {
  const fixed = [{ pattern: 'claude\\.ai', title: 'Claude' }]
  const t = computeTitle({ changeTitle: undefined, tabTitle: 'Claude', url, lastApplied: undefined, rules: fixed, now })
  assert.equal(t, null)
})

test('prefix and suffix template is recognised as applied', () => {
  const both = [{ pattern: 'claude\\.ai', title: 'AI: [page_title] | claude.ai' }]
  const t = computeTitle({ changeTitle: undefined, tabTitle: 'AI: Chat | claude.ai', url, lastApplied: undefined, rules: both, now })
  assert.equal(t, null)
})

test('new page title after navigation gets the suffix again', () => {
  const t = computeTitle({ changeTitle: 'Other', tabTitle: 'Other', url, lastApplied: 'Chat | claude.ai', rules, now })
  assert.equal(t, 'Other | claude.ai')
})

test('non-matching url is left alone', () => {
  const t = computeTitle({ changeTitle: 'X', tabTitle: 'X', url: 'https://example.com/', lastApplied: undefined, rules, now })
  assert.equal(t, null)
})

test('title script survives quotes and cannot inject code', () => {
  const title = "It's \"x\" '; globalThis.pwned = true; '"
  const document = {}
  new Function('document', titleScript(title))(document)
  assert.equal(document.title, title)
  assert.equal(globalThis.pwned, undefined)
})
