
function showTool(id, btn) {
  document.querySelectorAll('.tool-section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function tsToDate() {
  const ts = parseInt(document.getElementById('ts-input').value);
  const date = new Date(ts);
  document.getElementById('ts-output').innerText = isNaN(date.getTime()) ? 'Invalid timestamp' : date.toISOString();
}

function dateToTs() {
  const dt = document.getElementById('date-input').value;
  const ts = new Date(dt).getTime();
  document.getElementById('date-output').innerText = isNaN(ts) ? 'Invalid date' : ts;
}

function validateJson() {
  const txt = document.getElementById('json-input').value;
  try {
    JSON.parse(txt);
    document.getElementById('json-result').innerText = "✅ Valid JSON";
  } catch {
    document.getElementById('json-result').innerText = "❌ Invalid JSON";
  }
}

function encodeBase64() {
  const text = document.getElementById('base64-input').value;
  try {
    const result = btoa(unescape(encodeURIComponent(text)));
    document.getElementById('base64-result').innerText = result;
  } catch {
    document.getElementById('base64-result').innerText = "❌ Encode failed";
  }
}

function decodeBase64() {
  const text = document.getElementById('base64-input').value;
  try {
    const result = decodeURIComponent(escape(atob(text)));
    document.getElementById('base64-result').innerText = result;
  } catch {
    document.getElementById('base64-result').innerText = "❌ Decode failed";
  }
}

function copyBase64Result() {
  const result = document.getElementById("base64-result").innerText;
  if (!result) {
    alert("Nothing to copy!");
    return;
  }
  navigator.clipboard.writeText(result).then(
    () => {
      document.getElementById("copy-base64-btn").innerText = "Copied!";
      setTimeout(() => {
        document.getElementById("copy-base64-btn").innerText = "Copy";
      }, 1200);
    },
    () => alert("Copy failed!")
  );
}

