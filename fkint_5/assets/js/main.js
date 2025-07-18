function showTab(tab, btn) {
    document.querySelectorAll('.tab-section').forEach(s => s.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// 功能一：获取UA并解析
function getUA() {
    let uaRawElem = document.getElementById('ua-raw');
    let ua = uaRawElem.value && uaRawElem.value.trim() ? uaRawElem.value.trim() : navigator.userAgent;
    uaRawElem.value = ua; // 始终把最新 UA 显示在框内
    document.getElementById('ua-parsed').innerHTML = parseUA(ua);
}
function parseUA(ua) {
    let isMobile = /mobile|android|iphone|ipad|phone/i.test(ua);
    let isWindows = /Windows/i.test(ua);
    let isMac = /Macintosh|Mac OS X/i.test(ua);
    let isLinux = /Linux/i.test(ua) && !/Android/i.test(ua);
    let isAndroid = /Android/i.test(ua);
    let isIOS = /iPhone|iPad|iPod/i.test(ua);
    let browser = 'Unknown';
    let browserVer = '';
    if (/Edge\/|Edg\//i.test(ua)) {
        browser = 'Edge';
        let m = ua.match(/Edg(e|)\/([\d\.]+)/i);
        if (m) browserVer = m[2];
    }
    else if (/OPR|Opera/i.test(ua)) {
        browser = 'Opera';
        let m = ua.match(/(OPR|Opera)\/([\d\.]+)/i);
        if (m) browserVer = m[2];
    }
    else if (/Chrome/i.test(ua) && !/Edg|OPR|Opera/i.test(ua)) {
        browser = 'Chrome';
        let m = ua.match(/Chrome\/([\d\.]+)/i);
        if (m) browserVer = m[1];
    }
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
        browser = 'Safari';
        let m = ua.match(/Version\/([\d\.]+)/i);
        if (m) browserVer = m[1];
    }
    else if (/Firefox/i.test(ua)) {
        browser = 'Firefox';
        let m = ua.match(/Firefox\/([\d\.]+)/i);
        if (m) browserVer = m[1];
    }
    else if (/MSIE|Trident/i.test(ua)) {
        browser = 'IE';
        let m = ua.match(/(MSIE |rv:)([\d\.]+)/i);
        if (m) browserVer = m[2];
    }

    // 设备信息
    let device = 'Desktop';
    if (isMobile) {
        if (isAndroid) device = 'Android';
        else if (isIOS) device = 'iOS';
        else device = 'Mobile';
    } else if (isMac) device = 'Mac';
    else if (isWindows) device = 'Windows';
    else if (isLinux) device = 'Linux';

    // 渲染引擎
    let engine = 'Unknown';
    if (/AppleWebKit/i.test(ua)) engine = 'WebKit';
    else if (/Gecko/i.test(ua) && !/like Gecko/i.test(ua)) engine = 'Gecko';
    else if (/Trident/i.test(ua)) engine = 'Trident';
    else if (/Presto/i.test(ua)) engine = 'Presto';

    // 平台
    let platform = navigator.platform || '-';

    // 语言
    let language = navigator.language || '-';

    // 架构
    let arch = '-';
    if (/x86_64|Win64|x64|amd64/i.test(ua)) arch = 'x64';
    else if (/i686|i386/i.test(ua)) arch = 'x86';
    else if (/arm|aarch64/i.test(ua)) arch = 'ARM';

    // 是否移动端
    let isTouch = 'unknown';
    if (typeof window.matchMedia === "function") {
        isTouch = window.matchMedia("(pointer: coarse)").matches ? "Yes" : "No";
    }

    // 结果输出
    return `
        <b>User Agent:</b><br><div style="word-break:break-all;color:#888;font-size:.96em;">${ua}</div>
        <b>Device:</b> ${device}<br>
        <b>OS:</b> ${
            isWindows ? 'Windows'
            : isMac ? 'MacOS'
            : isAndroid ? 'Android'
            : isIOS ? 'iOS'
            : isLinux ? 'Linux'
            : 'Unknown'
        }<br>
        <b>Platform:</b> ${platform}<br>
        <b>Browser:</b> ${browser} ${browserVer ? '('+browserVer+')' : ''}<br>
        <b>Engine:</b> ${engine}<br>
        <b>Architecture:</b> ${arch}<br>
        <b>Language:</b> ${language}<br>
        <b>Is Mobile:</b> ${isMobile ? 'Yes' : 'No'}<br>
        <b>Is Touch Device:</b> ${isTouch}<br>`;
}

// 功能二：生成随机UA
function generateUA() {
    const type = document.getElementById('ua-type').value;
    let ua = '';
    if (type === 'desktop') ua = randomDesktopUA();
    else if (type === 'mobile') ua = randomMobileUA();
    else ua = Math.random() > 0.5 ? randomDesktopUA() : randomMobileUA();
    document.getElementById('ua-gen-result').value = ua;
}

// 桌面随机UA
function randomDesktopUA() {
    const chromeVer = `${rand(90,124)}.0.${rand(1100,5800)}.${rand(10,170)}`;
    const winVers = ['10.0; Win64; x64', '10.0; WOW64', '11.0; Win64; x64', '10.0'];
    const macVers = ['10_15_7', '11_6', '12_2_1', '13_0', '14_4_1'];
    if (Math.random() > 0.5) {
        // Windows Chrome
        return `Mozilla/5.0 (Windows NT ${pick(winVers)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Safari/537.36`;
    } else {
        // Mac Chrome
        return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${pick(macVers)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Safari/537.36`;
    }
}
function randomMobileUA() {
    const chromeVer = `${rand(90,124)}.0.${rand(1100,5800)}.${rand(10,170)}`;
    const androidVers = ['11', '12', '13', '14', '15'];
    const iphoneVers = ['15_5', '16_3', '17_0', '17_3_1', '14_7_1'];
    if (Math.random() > 0.5) {
        // Android Chrome
        return `Mozilla/5.0 (Linux; Android ${pick(androidVers)}; ${randDeviceAndroid()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Mobile Safari/537.36`;
    } else {
        // iPhone Chrome
        return `Mozilla/5.0 (iPhone; CPU iPhone OS ${pick(iphoneVers).replace('_','.')}) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${chromeVer} Mobile/15E148 Safari/604.1`;
    }
}
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function rand(a,b) { return a + Math.floor(Math.random()*(b-a+1)); }
function randDeviceAndroid() {
    const dev = [
        'SM-G991B', 'Pixel 7', 'SM-A5260', 'ONEPLUS A6000', 'Mi 11', 'Redmi K40', 'V2141A', 'CPH2269', 'VOG-L29',
        'SM-G998U', 'SM-N986U', 'SM-A725F', 'Pixel 6 Pro', 'SM-S908U', 'SM-G990U', 'ONEPLUS A5000', 'ONEPLUS A3000',
        'Mi 10', 'Redmi Note 10 Pro', 'V2050A', 'CPH2123', 'ELE-L29', 'SM-F926U', 'SM-F711U', 'SM-G9810',
        'Pixel 5', 'SM-A515F', 'ONEPLUS A7000', 'Mi 9', 'Redmi Note 9 Pro', 'V2029A', 'CPH2069', 'MHA-L29',
        'SM-G973F', 'SM-N975F', 'SM-A325F', 'Pixel 4a', 'SM-G960F', 'SM-N960U', 'ONEPLUS A6010', 'ONEPLUS A5010',
        'Mi 8', 'Redmi Note 8 Pro', 'V1981A', 'CPH1931', 'P30 Pro', 'SM-F916U', 'SM-F700U', 'SM-G950U',
        'Pixel 4 XL', 'SM-A217F', 'ONEPLUS A7000T', 'Mi 9 SE', 'Redmi K30 Pro', 'V1950A', 'CPH1920', 'Mate 20 Pro',
        'SM-G930F', 'SM-N930F', 'SM-A115F', 'Pixel 3 XL', 'SM-G920F', 'SM-N920C', 'ONEPLUS A3010', 'ONEPLUS A2003',
        'Mi 6', 'Redmi Note 7 Pro', 'V1916A', 'CPH1907', 'Honor 20 Pro', 'SM-F900U', 'SM-G970F', 'SM-N970F',
        'SM-A805F', 'Pixel 3a', 'SM-G900F', 'SM-N910F', 'ONEPLUS A2001', 'ONEPLUS A1001', 'Mi 5', 'Redmi Note 6 Pro',
        'V1821A', 'CPH1801', 'Honor 10', 'SM-G892A', 'SM-G955U', 'SM-N950U', 'SM-A705F', 'Pixel 2 XL',
        'SM-G781B', 'SM-A426B', 'ONEPLUS AC2003', 'Mi 10T Pro', 'Redmi K40 Pro', 'V2073A', 'CPH2173', 'SM-S901U',
        'Pixel 6', 'SM-A536B', 'ONEPLUS KB2005', 'Mi 11 Ultra', 'Redmi Note 11 Pro', 'V2186A', 'CPH2305', 'SM-F936U',
        'SM-G996U', 'SM-N981U', 'SM-A528B', 'Pixel 5a', 'SM-S906U', 'SM-G990U2', 'ONEPLUS LE2125', 'ONEPLUS IN2025',
        'Mi 11 Lite', 'Redmi 10', 'V2105A', 'CPH2207', 'SM-G991U', 'Pixel 7 Pro', 'SM-A546B', 'ONEPLUS CPH2447',
        'Mi 12', 'Redmi Note 12 Pro', 'V2202A', 'CPH2451'
    ];
    return pick(dev);
}


function copyToClipboard() {
    const uaParsed = document.getElementById('ua-parsed');
    if (!uaParsed) return;
    // 移除按钮内容
    let html = uaParsed.innerHTML.replace(/<button[\s\S]*?<\/button>/, '');
    // 转为纯文本
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let text = tempDiv.innerText || tempDiv.textContent || '';
    navigator.clipboard.writeText(text.trim()).then(function() {
        // 复制按钮变色、变字
        const btn = uaParsed.querySelector('.copy-btn');
        if (btn) {
            btn.textContent = "Copied!";
            btn.style.background = "linear-gradient(90deg,#3fc373,#60e98a)";
            btn.style.color = "#fff";
            // 2秒后恢复
            setTimeout(() => {
                btn.textContent = "Copy";
                btn.style.background = "";
                btn.style.color = "";
            }, 2000);
        }
    });
}

window.onload = () => showTab('ua-info', document.querySelector('nav button'));

function copyUaGenResult() {
    const textArea = document.getElementById('ua-gen-result');
    if (textArea) {
        navigator.clipboard.writeText(textArea.value).then(function() {
            const btn = document.getElementById('ua-gen-copy-btn');
            if (btn) {
                btn.textContent = "Copied!";
                btn.style.background = "linear-gradient(90deg,#3fc373,#60e98a)";
                btn.style.color = "#fff";
                setTimeout(() => {
                    btn.textContent = "Copy";
                    btn.style.background = "";
                    btn.style.color = "";
                }, 1000);
            }
        });
    }
}