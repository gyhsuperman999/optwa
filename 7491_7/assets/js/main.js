window.onload = function() {
    const units = {
        length: [
            { name: "Meter (m)", value: 1 },
            { name: "Kilometer (km)", value: 1000 },
            { name: "Centimeter (cm)", value: 0.01 },
            { name: "Millimeter (mm)", value: 0.001 },
            { name: "Inch (in)", value: 0.0254 },
            { name: "Foot (ft)", value: 0.3048 },
            { name: "Yard (yd)", value: 0.9144 },
            { name: "Mile (mi)", value: 1609.344 }
        ],
        weight: [
            { name: "Kilogram (kg)", value: 1 },
            { name: "Gram (g)", value: 0.001 },
            { name: "Milligram (mg)", value: 0.000001 },
            { name: "Pound (lb)", value: 0.45359237 },
            { name: "Ounce (oz)", value: 0.0283495 }
        ],
        temperature: [
            { name: "Celsius (°C)", value: "c" },
            { name: "Fahrenheit (°F)", value: "f" },
            { name: "Kelvin (K)", value: "k" }
        ],
        area: [
            { name: "Square meter (㎡)", value: 1 },
            { name: "Square kilometer (㎢)", value: 1e6 },
            { name: "Square foot (ft²)", value: 0.092903 },
            { name: "Square yard (yd²)", value: 0.836127 },
            { name: "Acre (ac)", value: 4046.86 },
            { name: "Hectare (ha)", value: 10000 }
        ],
        volume: [
            { name: "Cubic meter (m³)", value: 1 },
            { name: "Liter (L)", value: 0.001 },
            { name: "Milliliter (mL)", value: 0.000001 },
            { name: "Cubic foot (ft³)", value: 0.0283168 },
            { name: "Cubic inch (in³)", value: 0.0000163871 },
            { name: "Gallon (gal)", value: 0.00378541 }
        ],
        speed: [
            { name: "Meter/sec (m/s)", value: 1 },
            { name: "Kilometer/hour (km/h)", value: 0.277778 },
            { name: "Mile/hour (mph)", value: 0.44704 },
            { name: "Foot/sec (ft/s)", value: 0.3048 },
            { name: "Knot (kn)", value: 0.514444 }
        ]
    };

    function createUnitSelect(cat, selectId) {
        return `<select id="${selectId}">${units[cat].map((u,i)=>`<option value="${i}">${u.name}</option>`).join('')}</select>`;
    }

    function loadUnitRow() {
        const cat = document.getElementById("category").value;
        let html = `
            <input type="number" id="input-value" class="unit-input" placeholder="Enter value" style="width:120px;">
            ${createUnitSelect(cat, "from-unit")}
            <span style="font-size:1.2em; margin:0 5px;">→</span>
            ${createUnitSelect(cat, "to-unit")}
        `;
        document.getElementById("unit-row").innerHTML = html;
    }

    function convert() {
        const cat = document.getElementById("category").value;
        let val = parseFloat(document.getElementById("input-value").value);
        if (isNaN(val)) {
            document.getElementById("convert-result").textContent = "Please enter a value.";
            return;
        }
        const fromI = +document.getElementById("from-unit").value;
        const toI = +document.getElementById("to-unit").value;
        let res = "";
        if (cat === "temperature") {
            res = convertTemp(val, units[cat][fromI].value, units[cat][toI].value);
        } else {
            let v = val * units[cat][fromI].value / units[cat][toI].value;
            res = v.toLocaleString(undefined, { maximumFractionDigits: 8 });
        }
        document.getElementById("convert-result").textContent = `${val} ${units[cat][fromI].name} = ${res} ${units[cat][toI].name}`;
    }

    function convertTemp(val, from, to) {
        let c;
        if (from === "c") c = val;
        if (from === "f") c = (val - 32) * 5 / 9;
        if (from === "k") c = val - 273.15;
        if (to === "c") return c.toLocaleString(undefined, { maximumFractionDigits: 8 });
        if (to === "f") return (c * 9 / 5 + 32).toLocaleString(undefined, { maximumFractionDigits: 8 });
        if (to === "k") return (c + 273.15).toLocaleString(undefined, { maximumFractionDigits: 8 });
        return "";
    }

    document.getElementById("category").onchange = () => {
        loadUnitRow();
        setTimeout(convert, 50);
    };
    document.addEventListener("change", e => {
        if (["from-unit","to-unit"].includes(e.target.id)) convert();
    });
    document.addEventListener("input", e => {
        if (e.target.id === "input-value") convert();
    });
    document.getElementById("swap-btn").onclick = () => {
        let from = document.getElementById("from-unit"), to = document.getElementById("to-unit");
        let tmp = from.selectedIndex;
        from.selectedIndex = to.selectedIndex;
        to.selectedIndex = tmp;
        convert();
    };
    loadUnitRow();
};
