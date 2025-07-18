// 基础加密算法
function base64encode(s) { return btoa(unescape(encodeURIComponent(s))); }
function base64decode(s) { try { return decodeURIComponent(escape(atob(s))); } catch { return ""; } }

function rot13(s) {
    return s.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(
            (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                ? c
                : c - 26
        )
    );
}

function caesar(s, offset, mode) {
    offset = ((Number(offset) || 0) % 26 + 26) % 26;
    return s.replace(/[a-zA-Z]/g, c => {
        let base = c <= "Z" ? 65 : 97;
        let code = c.charCodeAt(0) - base;
        code = mode === "encrypt"
            ? (code + offset) % 26
            : (code - offset + 26) % 26;
        return String.fromCharCode(base + code);
    });
}

function xorEncrypt(s, key) {
    key = key || "A";
    let res = "";
    for (let i = 0; i < s.length; i++) {
        res += String.fromCharCode(s.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(unescape(encodeURIComponent(res)));
}
function xorDecrypt(s, key) {
    key = key || "A";
    let out = "";
    try {
        s = decodeURIComponent(escape(atob(s)));
    } catch { return ""; }
    for (let i = 0; i < s.length; i++) {
        out += String.fromCharCode(s.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return out;
}

// AES 使用 CryptoJS
function aesEncrypt(text, key) {
    if (!window.CryptoJS) return "";
    return CryptoJS.AES.encrypt(text, key).toString();
}
function aesDecrypt(cipher, key) {
    if (!window.CryptoJS) return "";
    try {
        let bytes = CryptoJS.AES.decrypt(cipher, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch { return ""; }
}

// MD5/SHA256
function md5(s) { if (!window.CryptoJS) return ""; return CryptoJS.MD5(s).toString(); }
function sha256(s) { if (!window.CryptoJS) return ""; return CryptoJS.SHA256(s).toString(); }

// URL
function urlEncode(s) { return encodeURIComponent(s);}
function urlDecode(s) { try { return decodeURIComponent(s); } catch { return ""; }}

// Atbash
function atbash(s) {
    return s.replace(/[a-zA-Z]/g, c => {
        let base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
    });
}

// Morse
const MORSE_DICT = {
    "A": ".-",    "B": "-...",  "C": "-.-.",  "D": "-..",
    "E": ".",     "F": "..-.",  "G": "--.",   "H": "....",
    "I": "..",    "J": ".---",  "K": "-.-",   "L": ".-..",
    "M": "--",    "N": "-.",    "O": "---",   "P": ".--.",
    "Q": "--.-",  "R": ".-.",   "S": "...",   "T": "-",
    "U": "..-",   "V": "...-",  "W": ".--",   "X": "-..-",
    "Y": "-.--",  "Z": "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",
    ".": ".-.-.-",",": "--..--","?": "..--..","'": ".----.",
    "!": "-.-.--","/": "-..-.", "(": "-.--.", ")": "-.--.-",
    "&": ".-...", ":": "---...",";": "-.-.-.","=": "-...-",
    "+": ".-.-.", "-": "-....-","_": "..--.-","\"": ".-..-.",
    "$": "...-..-","@": ".--.-."," ": "/"
};
const MORSE_DICT_REV = Object.fromEntries(Object.entries(MORSE_DICT).map(([k,v])=>[v,k]));
function morseEncode(s) {
    return s.toUpperCase().split("").map(c => MORSE_DICT[c] || c).join(" ");
}
function morseDecode(s) {
    return s.trim().split(" ").map(code => MORSE_DICT_REV[code] || code).join("");
}

// 动态参数切换
function updateParamRow() {
    let algo = document.getElementById("algo").value;
    let html = "";
    if (algo === "caesar") {
        html = '<label>Offset</label><input id="caesar-offset" type="number" min="1" max="25" value="3" style="width:60px;">';
    } else if (algo === "aes" || algo === "xor") {
        html = `<label>Key</label><input id="${algo}-key" type="text" value="" placeholder="Enter key">`;
    }
    document.getElementById("param-row").innerHTML = html;
    // 控制Decrypt按钮显隐
    const decryptAlgos = ['base64', 'rot13', 'caesar', 'aes', 'xor', 'url', 'atbash', 'morse'];
    const decryptBtn = document.getElementById("decrypt-btn");
    if (decryptAlgos.includes(algo)) {
        decryptBtn.style.display = "";
    } else {
        decryptBtn.style.display = "none";
    }
}
document.getElementById("algo").onchange = updateParamRow;
updateParamRow();

function setOutput(val) {
    let out = document.getElementById("output");
    out.value = val;
}
document.getElementById("encrypt-btn").onclick = function() {
    let algo = document.getElementById("algo").value;
    let input = document.getElementById("input").value;
    if (!input) { setOutput(""); return; }
    if (algo === "base64") setOutput(base64encode(input));
    else if (algo === "rot13") setOutput(rot13(input));
    else if (algo === "caesar") setOutput(caesar(input, document.getElementById("caesar-offset").value, "encrypt"));
    else if (algo === "aes") setOutput(aesEncrypt(input, document.getElementById("aes-key").value));
    else if (algo === "xor") setOutput(xorEncrypt(input, document.getElementById("xor-key").value));
    else if (algo === "md5") setOutput(md5(input));
    else if (algo === "sha256") setOutput(sha256(input));
    else if (algo === "url") setOutput(urlEncode(input));
    else if (algo === "atbash") setOutput(atbash(input));
    else if (algo === "morse") setOutput(morseEncode(input));
};
document.getElementById("decrypt-btn").onclick = function() {
    let algo = document.getElementById("algo").value;
    let input = document.getElementById("input").value;
    if (!input) { setOutput(""); return; }
    if (algo === "base64") setOutput(base64decode(input));
    else if (algo === "rot13") setOutput(rot13(input));
    else if (algo === "caesar") setOutput(caesar(input, document.getElementById("caesar-offset").value, "decrypt"));
    else if (algo === "aes") setOutput(aesDecrypt(input, document.getElementById("aes-key").value));
    else if (algo === "xor") setOutput(xorDecrypt(input, document.getElementById("xor-key").value));
    else if (algo === "url") setOutput(urlDecode(input));
    else if (algo === "atbash") setOutput(atbash(input));
    else if (algo === "morse") setOutput(morseDecode(input));
};
document.getElementById("copy-btn").onclick = function() {
    let output = document.getElementById("output");
    output.select();
    output.setSelectionRange(0, 99999);
    document.execCommand("copy");
    let btn = document.getElementById("copy-btn");
    let old = btn.textContent;
    btn.textContent = "已复制";
    btn.style.background = "linear-gradient(90deg,#1ee9c4,#58c9e6 80%)";
    setTimeout(()=>{ btn.textContent = old; btn.style.background=""; }, 1500);
};