window.onload = function() {
  let currentBgColor = '#ffffff'; // 默认背景色
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const bgSelect = document.getElementById('bg-select');
  const canvasColorPicker = document.getElementById('canvas-color-picker');
  const brushSelect = document.getElementById('brush-select');
  const sizeSlider = document.getElementById('size-slider');
  const colorPicker = document.getElementById('color-picker');
  const opacitySlider = document.getElementById('opacity-slider');
  const clearBtn = document.getElementById('clear-btn');
  const saveBtn = document.getElementById('save-btn');

  // Hidden buffer canvas for storing drawing content
  const bufferCanvas = document.createElement('canvas');
  const bufferCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });

  // UI skins mapping
  const skins = {
    mountains: 'assets/img/skin-mountains.jpg',
    ink: 'assets/img/skin-ink.jpg',
    sky: 'assets/img/skin-sky.jpg',
    universe: 'assets/img/skin-universe.jpg',
    starry: 'assets/img/skin-starry.jpg',
    animals: 'assets/img/skin-animals.jpg',
    forest: 'assets/img/skin-forest.jpg',
    desert: 'assets/img/skin-desert.jpg',
    ocean: 'assets/img/skin-ocean.jpg',
    sunset: 'assets/img/skin-sunset.jpg',
    abstract: 'assets/img/skin-abstract.jpg',
    vintage: 'assets/img/skin-vintage.jpg',
    watercolor: 'assets/img/skin-watercolor.jpg',
    night: 'assets/img/skin-night.jpg',
    geometric: 'assets/img/skin-geometric.jpg'
  };

  function applySkin() {
    const url = skins[bgSelect.value];
    document.querySelector('.toolbar').style.backgroundImage = `url('${url}')`;
  }
  bgSelect.onchange = applySkin;

  /**
   * Render full canvas: background + buffer drawing layer
   */
  function renderAll() {
    // Clear main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background
    ctx.fillStyle = currentBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw buffer layer (user drawings)
    ctx.drawImage(bufferCanvas, 0, 0);
  }

  // 切换画布颜色时保留已绘制内容，仅更新背景
  canvasColorPicker.addEventListener('input', () => {
    // Update background color and re-render
    currentBgColor = canvasColorPicker.value;
    renderAll();
  });

// 辅助函数：16进制颜色转RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(x => x + x).join("");
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

  function resizeCanvas() {
    // Resize both canvases
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    bufferCanvas.width = canvas.width = w;
    bufferCanvas.height = canvas.height = h;
    // Re-render everything
    renderAll();
  }
  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  applySkin();

  let drawing = false;

  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    const size = +sizeSlider.value;
    bufferCtx.globalAlpha = +opacitySlider.value;
    if (brushSelect.value === 'eraser') {
      bufferCtx.fillStyle = canvasColorPicker.value;
    } else {
      bufferCtx.fillStyle = colorPicker.value;
    }
    if (brushSelect.value === 'circle') {
      bufferCtx.beginPath();
      bufferCtx.arc(x, y, size / 2, 0, 2 * Math.PI);
      bufferCtx.fill();
    } else if (brushSelect.value === 'square') {
      bufferCtx.fillRect(x - size/2, y - size/2, size, size);
    } else if (brushSelect.value === 'spray') {
      for (let i = 0; i < size * 2; i++) {
        const ox = (Math.random()-0.5)*size;
        const oy = (Math.random()-0.5)*size;
        bufferCtx.fillRect(x+ox, y+oy, 1, 1);
      }
    } else if (brushSelect.value === 'eraser') {
      bufferCtx.beginPath();
      bufferCtx.arc(x, y, size / 2, 0, 2 * Math.PI);
      bufferCtx.fill();
    }
    renderAll();
  }
  canvas.addEventListener('mousedown', () => drawing = true);
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseout', () => drawing = false);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchstart', () => drawing = true);
  canvas.addEventListener('touchend', () => drawing = false);
  canvas.addEventListener('touchmove', draw);

  // 清除按钮不再绑定 applyCanvasColor
  clearBtn.onclick = () => {
    // Clear drawing layer
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    renderAll();
  };

  saveBtn.onclick = () => {
    // Ensure latest rendering
    renderAll();
    const link = document.createElement('a');
    link.download = 'doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };
};
