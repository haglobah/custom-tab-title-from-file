# Custom Tab Title (from File)

_Custom Tab Title (from File)_ is a Firefox web extension that allows changing the title of any tab based on regular expressions applied to the tab URL.

## Rules

Rules are stored as JSON in Firefox sync storage under the key `regexTitleRules`. Each rule is an object describing when and how a tab title should be replaced.

You can manage tab title rules in:

- The add-on preferences in Firefox’s Extension Management
- The options page opened from the add-on

Each rule object supports the following properties:

| Property  | Type   | Description |
|-----------|--------|-------------|
| `pattern` | string | Regular expression applied to the tab URL. If the URL matches, the rule is applied. The expression is evaluated case‑insensitively. |
| `title`   | string | Custom title to apply when the rule matches. If omitted, the tab title is left unchanged. Supports dynamic placeholders (see below). |


### Dynamic title placeholders

The `title` property supports dynamic placeholders. When one of the placeholders below appears in the title string, it is automatically replaced with the corresponding runtime value.

| Placeholder | Description |
|-------------|-------------|
| `[page_title]` | Original tab title |
| `[page_url]` | Full page URL |
| `[page_host]` | Hostname including port |
| `[page_hostname]` | Hostname without port |
| `[page_hash]` | URL fragment including `#` |
| `[page_search]` | URL query string including `?` |
| `[page_username]` | Username from URL, if present |
| `[page_origin]` | URL origin (scheme + host + port) |
| `[page_pathname]` | URL path without query or fragment |
| `[page_port]` | URL port |
| `[page_protocol]` | URL protocol including `:` |
| `[year]` | Current year |
| `[month]` | Current month (1–12) |
| `[date]` | Day of month |
| `[weekday]` | Day of week (0–6, Sunday = 0) |
| `[hours]` | Current hour (0–23) |
| `[minutes]` | Current minute |
| `[seconds]` | Current second |
