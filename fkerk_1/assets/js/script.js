const queriedIPs = new Map();

function showTool(tool) {
  document.querySelectorAll('.tool-section').forEach(s => s.style.display = 'none');
  document.getElementById(tool).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  // IP & Timezone
  queryIp();
});

function lookupCustomIP() {
  const input = document.getElementById("ip-input").value.trim();
  console.log("正在查询IP:", input)
  if (!input) {
    alert("Please enter an IP address.");
    return;
  }

  if (queriedIPs.has(input)) {
    displayIpData(queriedIPs.get(input));
    return;
  }

  document.getElementById("ip-address").innerText = "Querying...";

  queryIp(input);
}

function displayIpData(data) {
  document.getElementById("ip-address").innerText = data.ip || "-";
  document.getElementById("ip-timezone").innerText = data.timezone || "-";
  document.getElementById("condition").innerText = data.continent_code || "-";
  document.getElementById("city").innerText = data.city || "-";
  document.getElementById("country").innerText = data.country || "-";
  document.getElementById("currency").innerText = data.currency_name || "-";
  document.getElementById("languages").innerText = data.languages || "-";
  document.getElementById("isp").innerText = data.org || "-";
  document.getElementById("region").innerText = data.region || "-";
  document.getElementById("capital").innerText = data.country_capital || "-";
  document.getElementById("continent").innerText = data.continent_code || "-";
  document.getElementById("postal").innerText = data.postal || "-";
  document.getElementById("coordinates").innerText = `${data.latitude}, ${data.longitude}` || "-";
  document.getElementById("utc").innerText = data.utc_offset || "-";
  document.getElementById("calling").innerText = data.country_calling_code || "-";
  document.getElementById("population").innerText = data.country_population || "-";
  document.getElementById("asn").innerText = data.asn || "-";
}

function queryIp(ip){
  const loadingText = "Loading...";
  const fields = [
    "ip-address", "ip-timezone", "condition", "city", "country", "currency",
    "languages", "isp", "region", "capital", "continent", "postal",
    "coordinates", "utc", "calling", "population", "asn"
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = loadingText;
  });

  const url = ip ? `https://ipapi.co/${ip}/json` : "https://ipapi.co/json";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayIpData(data);
      queriedIPs.set(data.ip, data);
    })
    .catch(() => {
      alert("Failed to fetch IP information.");
    });
}
