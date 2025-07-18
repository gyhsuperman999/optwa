
// HTTP/HTTPS 测试
function testHTTP() {
    const url = document.getElementById('http-url').value.trim();
    const result = document.getElementById('http-result');
    if (!/^https?:\/\//.test(url)) {
        result.innerHTML = "<span style='color:red'>请输入有效的 http(s):// 地址</span>";
        return;
    }
    result.innerText = "Testing...";
    fetch(url, {method: 'HEAD', mode: 'no-cors'})
        .then(() => {
            result.innerHTML = "<span style='color:green'>✅ HTTP(S) 请求已发出，目标可达</span>";
        })
        .catch(e => {
            result.innerHTML = "<span style='color:red'>❌ 无法连通或被拦截（CORS/网络原因）</span>";
        });
}

// WebSocket 测试
function testWS() {
    const url = document.getElementById('ws-url').value.trim();
    const result = document.getElementById('ws-result');
    if (!/^wss?:\/\//.test(url)) {
        result.innerHTML = "<span style='color:red'>请输入有效的 ws(s):// 地址</span>";
        return;
    }
    result.innerText = "Connecting...";
    let ws;
    try {
        ws = new WebSocket(url);
    } catch(e) {
        result.innerHTML = "<span style='color:red'>❌ 无法创建 WebSocket：" + e.message + "</span>";
        return;
    }
    ws.onopen = () => {
        result.innerHTML = "<span style='color:green'>✅ WebSocket 连接成功！</span>";
        ws.close();
    };
    ws.onerror = (e) => {
        result.innerHTML = "<span style='color:red'>❌ WebSocket 连接失败。</span>";
    };
}

// Socket 测试
function testSocket() {
    const host = document.getElementById('tcp-host').value.trim();
    const port = document.getElementById('tcp-port').value.trim();
    const result = document.getElementById('tcp-result');
    result.innerText = "Testing...";
    // 前端无法直接测试原生TCP socket，只能提示
    result.innerHTML = "<span style='color:orange'>⚠️ 由于安全限制，网页无法直接测试 TCP Socket 端口。请使用后端服务或命令行工具测试。</span>";
}

function testSpeed() {
    const url = "https://speed.cloudflare.com/__down?bytes=1048576"; // 1MB测速块
    const result = document.getElementById('speed-result');
    result.innerText = "Testing...";
    const startTime = Date.now();
    fetch(url + "&_t=" + Math.random())
        .then(resp => resp.blob())
        .then(blob => {
            const duration = (Date.now() - startTime) / 1000;
            const sizeMb = blob.size / (1024 * 1024);
            const speedMbps = (sizeMb * 8 / duration).toFixed(2);
            result.innerHTML = `<span style="color:green">Download Speed: <b>${speedMbps}</b> Mbps</span>`;
        })
        .catch(e => {
            result.innerHTML = `<span style="color:red">❌ Test failed</span>`;
        });
}
