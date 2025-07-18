function showTab(tab, btn) {
    document.querySelectorAll('.tab-section').forEach(s => s.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if(tab === 'mortgage') {
        const r = document.getElementById('home-result');
        const d = document.getElementById('home-detail');
        const t = document.getElementById('home-detail-title');
        if(r) r.innerHTML = '';
        if(d) d.innerHTML = '';
        if(t) t.innerHTML = '';
    }
    if(tab === 'carloan') {
        const r = document.getElementById('car-result');
        const d = document.getElementById('car-detail');
        const t = document.getElementById('car-detail-title');
        if(r) r.innerHTML = '';
        if(d) d.innerHTML = '';
        if(t) t.innerHTML = '';
    }
    if(tab === 'general') {
        const r = document.getElementById('general-result');
        if(r) r.innerHTML = '';
        clearExp();
    }
}

function buildRepaymentTable(P, r, n, monthlyPay) {
    let rows = [];
    let remain = P;
    for(let i=1; i<=n; ++i) {
        let interest = remain * r;
        let principal = monthlyPay - interest;
        remain -= principal;
        if(remain<1e-6) remain = 0;
        rows.push({
            idx: i,
            pay: monthlyPay,
            remain: remain<0?0:remain
        });
    }
    return rows;
}

function renderRepaymentTableSimple(rows, container, maxShow=100) {
    if(rows.length===0) { container.innerHTML = ''; return; }
    let html = '<table><tr><th>Period</th><th>Payment</th><th>Balance</th></tr>';
    let n = rows.length;
    if(n <= maxShow*2) {
        for(let row of rows) html += `<tr>
            <td>${row.idx}</td>
            <td>$${row.pay.toFixed(2)}</td>
            <td>$${row.remain.toFixed(2)}</td>
        </tr>`;
    } else {
        for(let i=0; i<maxShow; ++i) {
            let row = rows[i];
            html += `<tr>
                <td>${row.idx}</td>
                <td>$${row.pay.toFixed(2)}</td>
                <td>$${row.remain.toFixed(2)}</td>
            </tr>`;
        }
        html += `<tr><td colspan="3" style="text-align:center;background:#f6fafd;">... ...</td></tr>`;
        for(let i=rows.length-maxShow;i<rows.length;++i) {
            let row = rows[i];
            html += `<tr>
                <td>${row.idx}</td>
                <td>$${row.pay.toFixed(2)}</td>
                <td>$${row.remain.toFixed(2)}</td>
            </tr>`;
        }
    }
    html += "</table>";
    container.innerHTML = html;
}

function calcMortgage() {
    let P = parseFloat(document.getElementById('home-amount').value);
    let r = parseFloat(document.getElementById('home-rate').value) / 100 / 12;
    let n = parseInt(document.getElementById('home-years').value) * 12;
    let mode = document.getElementById('home-mode').value;
    let res = document.getElementById('home-result');
    let detail = document.getElementById('home-detail');
    let title = document.getElementById('home-detail-title');
    if (!P || !r || !n) {
        res.innerHTML = "<span style='color:#c53d2c'>Please enter valid numbers.</span>";
        title.innerHTML = ""; detail.innerHTML = "";
        return;
    }
    let rows, monthPay, total, interest;
    if(mode === "equal_principal") {
        rows = buildEqualPrincipalTable(P, r, n);
        monthPay = rows[0].pay;
        total = rows.reduce((sum, row) => sum + row.pay, 0);
        interest = total - P;
        res.innerHTML = `<b>1st Month:</b> $${monthPay.toFixed(2)}<br/><b>Total Payment:</b> $${total.toFixed(2)}<br/><b>Total Principal:</b> $${P.toFixed(2)}<br/><b>Total Interest:</b> $${interest.toFixed(2)}`;
        title.innerHTML = `Repayment Detail (${n} periods, Equal Principal):`;
    } else {
        monthPay = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        total = monthPay * n;
        interest = total - P;
        res.innerHTML = `<b>Monthly:</b> $${monthPay.toFixed(2)}<br/><b>Total Payment:</b> $${total.toFixed(2)}<br/><b>Total Principal:</b> $${P.toFixed(2)}<br/><b>Total Interest:</b> $${interest.toFixed(2)}`;
        rows = buildRepaymentTable(P, r, n, monthPay);
        title.innerHTML = `Repayment Detail (${n} periods, Equal Payment):`;
    }
    renderRepaymentTableSimple(rows, detail);
}

function buildEqualPrincipalTable(P, r, n) {
    let rows = [];
    let principalPart = P / n;
    let remain = P;
    for(let i=1; i<=n; ++i) {
        let interest = remain * r;
        let pay = principalPart + interest;
        remain -= principalPart;
        if(remain < 1e-6) remain = 0;
        rows.push({
            idx: i,
            pay: pay,
            remain: remain<0?0:remain
        });
    }
    return rows;
}

function calcCarLoan() {
    let P = parseFloat(document.getElementById('car-amount').value);
    let r = parseFloat(document.getElementById('car-rate').value) / 100 / 12;
    let n = parseInt(document.getElementById('car-years').value) * 12;
    let mode = document.getElementById('car-mode').value;
    let res = document.getElementById('car-result');
    let detail = document.getElementById('car-detail');
    let title = document.getElementById('car-detail-title');
    if (!P || !r || !n) {
        res.innerHTML = "<span style='color:#c53d2c'>Please enter valid numbers.</span>";
        title.innerHTML = ""; detail.innerHTML = "";
        return;
    }
    let rows, monthPay, total, interest;
    if(mode === "equal_principal") {
        rows = buildEqualPrincipalTable(P, r, n);
        monthPay = rows[0].pay;
        total = rows.reduce((sum, row) => sum + row.pay, 0);
        interest = total - P;
        res.innerHTML = `<b>1st Month:</b> $${monthPay.toFixed(2)}<br/><b>Total Payment:</b> $${total.toFixed(2)}<br/><b>Total Principal:</b> $${P.toFixed(2)}<br/><b>Total Interest:</b> $${interest.toFixed(2)}`;
        title.innerHTML = `Repayment Detail (${n} periods, Equal Principal):`;
    } else {
        monthPay = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        total = monthPay * n;
        interest = total - P;
        res.innerHTML = `<b>Monthly:</b> $${monthPay.toFixed(2)}<br/><b>Total Payment:</b> $${total.toFixed(2)}<br/><b>Total Principal:</b> $${P.toFixed(2)}<br/><b>Total Interest:</b> $${interest.toFixed(2)}`;
        rows = buildRepaymentTable(P, r, n, monthPay);
        title.innerHTML = `Repayment Detail (${n} periods, Equal Payment):`;
    }
    renderRepaymentTableSimple(rows, detail);
}

// ---------- 自定义计算器键盘 ----------
let calcExp = "";
function appendExp(val) {
    const inp = document.getElementById('general-exp');
    if(val === '*' || val === '/' || val === '+' || val === '-') {
        if(calcExp.length===0) return;
        if("+-*/".includes(calcExp[calcExp.length-1])) return;
    }
    calcExp += val;
    inp.value = calcExp.replace(/\*/g,"×").replace(/\//g,"÷");
}
function clearExp() {
    calcExp = "";
    document.getElementById('general-exp').value = "";
    document.getElementById('general-result').innerHTML = "";
}
function calcGeneral() {
    let exp = calcExp.replace(/×/g,"*").replace(/÷/g,"/");
    let res = document.getElementById('general-result');
    try {
        let val = Function('"use strict";return (' + exp + ')')();
        res.innerHTML = `<b>Result:</b> ${val}
                        <br/><b>Binary:</b> ${parseInt(val).toString(2)}
                        <br/><b>Decimal:</b> ${val}
                        <br/><b>Hexadecimal:</b> ${parseInt(val).toString(16).toUpperCase()}`;
    } catch(e) {
        res.innerHTML = "<span style='color:#c53d2c'>Invalid expression.</span>";
    }
}
window.onload = () => {
    showTab('mortgage', document.querySelector('nav button'));
};
