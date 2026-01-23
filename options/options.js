const fileInput = document.getElementById("jsonFile");
const statusEl = document.getElementById("status");

function setStatus(msg, error = false) {
  statusEl.textContent = msg;
  statusEl.style.color = error ? "red" : "green";
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Root JSON value must be an object");
      }

      const compiled = [];
      for (const [pattern, title] of Object.entries(data)) {
        if (typeof title !== "string") {
          throw new Error(`Title for pattern ${pattern} must be a string`);
        }
        new RegExp(pattern);
        compiled.push({ pattern, title });
      }

      browser.storage.sync.set({ regexTitleRules: compiled });
      setStatus(`Loaded ${compiled.length} rule(s) successfully`);
    } catch (e) {
      setStatus(`Invalid JSON: ${e.message}`, true);
    }
  };

  reader.readAsText(file);
});
