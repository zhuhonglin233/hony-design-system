// 颜色选择器组件
let currentColorPicker = null;

// 切换颜色选择器面板
function toggleColorPicker(input, mode) {
    const picker = input.parentElement;
    const panel = picker.querySelector('.hony-cp-color-picker-panel');
    if (!panel) return;

    // 检查面板是否在body中（打开状态）
    const isOpen = panel.parentElement === document.body;

    if (isOpen) {
        // 关闭面板
        closeColorPickerPanel(panel);
    } else {
        // 打开面板
        openColorPickerPanel(input, panel);
    }
}

// 打开颜色选择器面板
function openColorPickerPanel(input, panel) {
    const picker = input.parentElement;

    // 关闭已打开的面板
    closeAllColorPickers();

    // 记录原始位置的下一个兄弟元素
    const nextSibling = panel.nextElementSibling;

    // 移动到body
    document.body.appendChild(panel);
    panel.style.display = 'block';

    // 保存状态
    panel._originalParent = picker;
    panel._originalNextSibling = nextSibling;

    // 更新位置
    updateColorPickerPosition(input, panel);

    // 添加滚动监听
    panel._scrollListener = function() {
        updateColorPickerPosition(input, panel);
    };
    window.addEventListener('scroll', panel._scrollListener);

    currentColorPicker = panel;
    panel._pickerInput = input;
}

// 关闭颜色选择器面板
function closeColorPickerPanel(panel) {
    panel.style.display = 'none';

    // 恢复到原始位置
    if (panel._originalParent) {
        const originalParent = panel._originalParent;
        const originalNextSibling = panel._originalNextSibling;
        originalParent.insertBefore(panel, originalNextSibling);

        // 清理状态
        delete panel._originalParent;
        delete panel._originalNextSibling;
    }

    // 移除滚动监听
    if (panel._scrollListener) {
        window.removeEventListener('scroll', panel._scrollListener);
        delete panel._scrollListener;
    }

    currentColorPicker = null;
}

// 关闭所有颜色选择器
function closeAllColorPickers() {
    const bodyPanel = document.body.querySelector('.hony-cp-color-picker-panel');
    if (bodyPanel) {
        closeColorPickerPanel(bodyPanel);
    }
}

// 更新颜色选择器位置
function updateColorPickerPosition(input, panel) {
    if (!panel || panel.style.display === 'none') return;

    const rect = input.getBoundingClientRect();
    const panelHeight = panel.offsetHeight || 400;
    const panelWidth = panel.offsetWidth || 224;

    let top = rect.bottom + 8;
    let left = rect.left;

    // 检查是否超出视口底部
    if (top + panelHeight > window.innerHeight) {
        top = rect.top - panelHeight - 8;
    }

    // 检查是否超出视口右侧
    if (left + panelWidth > window.innerWidth) {
        left = window.innerWidth - panelWidth - 16;
    }

    // 确保不超出左侧
    if (left < 8) {
        left = 8;
    }

    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
}

// 颜色模式切换
document.addEventListener('click', function(e) {
    const tab = e.target.closest('.hony-cp-color-tab');
    if (tab) {
        const panel = tab.closest('.hony-cp-color-picker-panel');
        const mode = tab.dataset.mode;

        // 更新标签状态
        panel.querySelectorAll('.hony-cp-color-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 切换内容显示
        const content = panel.querySelector('.hony-cp-color-content');
        if (mode === 'single') {
            content.innerHTML = `
                <div class="cp-color-swatch">
                    <div class="cp-swatch-title">系统预设颜色</div>
                    <div class="cp-swatch-grid">
                        <div class="cp-swatch-item" data-color="#165DFF" style="background-color: #165DFF;"></div>
                        <div class="cp-swatch-item" data-color="#0D3899" style="background-color: #0D3899;"></div>
                        <div class="cp-swatch-item" data-color="#739EFF" style="background-color: #739EFF;"></div>
                        <div class="cp-swatch-item" data-color="#00b42a" style="background-color: #00b42a;"></div>
                        <div class="cp-swatch-item" data-color="#73d13d" style="background-color: #73d13d;"></div>
                        <div class="cp-swatch-item" data-color="#fa8c16" style="background-color: #fa8c16;"></div>
                        <div class="cp-swatch-item" data-color="#ff4d4f" style="background-color: #ff4d4f;"></div>
                        <div class="cp-swatch-item" data-color="#9254de" style="background-color: #9254de;"></div>
                        <div class="cp-swatch-item" data-color="#13c2c2" style="background-color: #13c2c2;"></div>
                        <div class="cp-swatch-item" data-color="#1890ff" style="background-color: #1890ff;"></div>
                        <div class="cp-swatch-item" data-color="#eb2f96" style="background-color: #eb2f96;"></div>
                        <div class="cp-swatch-item" data-color="#faad14" style="background-color: #faad14;"></div>
                    </div>
                </div>
                <div class="cp-color-custom">
                    <div class="cp-custom-title">自定义颜色</div>
                    <div class="cp-color-wheel">
                        <div class="cp-hue-bar">
                            <div class="cp-hue-pointer"></div>
                        </div>
                        <div class="cp-saturation-box">
                            <div class="cp-sat-pointer"></div>
                        </div>
                    </div>
                    <div class="cp-alpha-control">
                        <span class="cp-alpha-label">透明度</span>
                        <div class="cp-alpha-bar">
                            <div class="cp-alpha-fill"></div>
                            <div class="cp-alpha-pointer"></div>
                        </div>
                        <input type="text" class="cp-alpha-value" value="100%" readonly>
                    </div>
                    <div class="cp-color-inputs">
                        <input type="text" class="cp-hex-input" value="#165DFF" placeholder="#RRGGBB">
                        <input type="text" class="cp-rgb-input" value="rgb(22, 93, 255)" placeholder="rgb(...)">
                    </div>
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="cp-gradient-preview">
                    <div class="cp-gradient-bar" style="background: linear-gradient(45deg, #165dff 0%, #00b42a 100%);"></div>
                </div>
                <div class="cp-gradient-colors">
                    <div class="cp-gradient-color-item">
                        <div class="cp-gradient-color-preview" style="background-color: #165dff;"></div>
                        <input type="text" class="cp-gradient-color-input" value="#165DFF">
                        <span class="cp-gradient-position">0%</span>
                    </div>
                    <div class="cp-gradient-arrow">→</div>
                    <div class="cp-gradient-color-item">
                        <div class="cp-gradient-color-preview" style="background-color: #00b42a;"></div>
                        <input type="text" class="cp-gradient-color-input" value="#00B42A">
                        <span class="cp-gradient-position">100%</span>
                    </div>
                </div>
                <div class="cp-gradient-presets">
                    <div class="cp-preset-title">渐变预设</div>
                    <div class="cp-preset-grid">
                        <div class="cp-preset-item" style="background: linear-gradient(90deg, #165dff, #739EFF);" data-gradient="linear-gradient(90deg, #165DFF, #739EFF)"></div>
                        <div class="cp-preset-item" style="background: linear-gradient(90deg, #00b42a, #73d13d);" data-gradient="linear-gradient(90deg, #00B42A, #73D13D)"></div>
                        <div class="cp-preset-item" style="background: linear-gradient(90deg, #fa8c16, #faad14);" data-gradient="linear-gradient(90deg, #FA8C16, #FAAD14)"></div>
                        <div class="cp-preset-item" style="background: linear-gradient(90deg, #ff4d4f, #eb2f96);" data-gradient="linear-gradient(90deg, #FF4D4F, #EB2F96)"></div>
                        <div class="cp-preset-item" style="background: linear-gradient(135deg, #165dff, #00b42a);" data-gradient="linear-gradient(135deg, #165DFF, #00B42A)"></div>
                        <div class="cp-preset-item" style="background: linear-gradient(135deg, #9254de, #13c2c2);" data-gradient="linear-gradient(135deg, #9254DE, #13C2C2)"></div>
                    </div>
                </div>
                <div class="cp-gradient-angle">
                    <span class="cp-angle-label">角度</span>
                    <input type="range" class="cp-angle-slider" min="0" max="360" value="45">
                    <span class="cp-angle-value">45°</span>
                </div>
            `;
        }

        // 更新位置
        if (panel._pickerInput) {
            updateColorPickerPosition(panel._pickerInput, panel);
        }
    }
});

// 选择预设颜色
document.addEventListener('click', function(e) {
    const swatchItem = e.target.closest('.hony-cp-swatch-item');
    if (swatchItem) {
        const color = swatchItem.dataset.color;
        const panel = swatchItem.closest('.hony-cp-color-picker-panel');
        const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;

        if (picker) {
            const input = picker.querySelector('.cp-color-picker-input');
            const preview = input.querySelector('.hony-cp-color-preview');
            const value = input.querySelector('.hony-cp-color-value');

            preview.style.backgroundColor = color;
            value.textContent = color.toUpperCase();
        }
    }

    // 选择最近使用颜色
    const recentItem = e.target.closest('.hony-cp-recent-item');
    if (recentItem) {
        const color = recentItem.dataset.color;
        const panel = recentItem.closest('.hony-cp-color-picker-panel');
        const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;

        if (picker) {
            const input = picker.querySelector('.cp-color-picker-input');
            const preview = input.querySelector('.hony-cp-color-preview');
            const value = input.querySelector('.hony-cp-color-value');

            preview.style.backgroundColor = color;
            value.textContent = color.toUpperCase();
        }
    }

    // 选择渐变预设
    const presetItem = e.target.closest('.hony-cp-preset-item');
    if (presetItem) {
        const gradient = presetItem.dataset.gradient;
        const panel = presetItem.closest('.hony-cp-color-picker-panel');
        const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;

        if (picker) {
            const input = picker.querySelector('.cp-color-picker-input');
            const preview = input.querySelector('.hony-cp-color-preview');
            const value = input.querySelector('.hony-cp-color-value');

            preview.style.background = gradient;
            value.textContent = '渐变';
        }
    }
});

// 确认选择
function confirmColorPicker(btn) {
    const panel = btn.closest('.hony-cp-color-picker-panel');
    if (panel) {
        closeColorPickerPanel(panel);
    }
}

// 重置颜色选择器
function resetColorPicker(btn) {
    const panel = btn.closest('.hony-cp-color-picker-panel');
    const picker = panel._pickerInput ? panel._pickerInput.parentElement : panel.querySelector('.cp-color-picker');

    const input = picker.querySelector('.cp-color-picker-input');
    const preview = input.querySelector('.hony-cp-color-preview');
    const value = input.querySelector('.hony-cp-color-value');

    if (input.classList.contains('gradient')) {
        preview.style.background = 'linear-gradient(45deg, #165dff 0%, #00b42a 100%)';
        value.textContent = '渐变';
    } else {
        preview.style.backgroundColor = '#165DFF';
        value.textContent = '#165DFF';
    }
}

// 点击外部关闭
document.addEventListener('click', function(e) {
    if (currentColorPicker) {
        const isClickOnPanel = e.target.closest('.hony-cp-color-picker-panel') === currentColorPicker;
        const isClickOnPicker = e.target.closest('.cp-color-picker');

        if (!isClickOnPanel && !isClickOnPicker) {
            closeAllColorPickers();
        }
    }
});

// 渐变角度滑块
document.addEventListener('input', function(e) {
    const slider = e.target.closest('.hony-cp-angle-slider');
    if (slider) {
        const value = slider.value;
        const panel = slider.closest('.hony-cp-color-picker-panel');
        const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;

        const angleValue = slider.parentElement.querySelector('.hony-cp-angle-value');
        const gradientBar = panel.querySelector('.hony-cp-gradient-bar');

        if (picker) {
            const input = picker.querySelector('.cp-color-picker-input');
            const preview = input.querySelector('.hony-cp-color-preview');
            angleValue.textContent = value + '°';

            const colorInputs = panel.querySelectorAll('.hony-cp-gradient-color-input');
            const color1 = colorInputs[0]?.value || '#165DFF';
            const color2 = colorInputs[1]?.value || '#00B42A';

            const gradient = `linear-gradient(${value}deg, ${color1}, ${color2})`;
            if (gradientBar) gradientBar.style.background = gradient;
            if (preview) preview.style.background = gradient;
        }
    }
});

// 渐变颜色输入
document.addEventListener('input', function(e) {
    const colorInput = e.target.closest('.hony-cp-gradient-color-input');
    if (colorInput) {
        const value = colorInput.value;
        const preview = colorInput.parentElement.querySelector('.hony-cp-gradient-color-preview');
        preview.style.backgroundColor = value;

        const panel = colorInput.closest('.hony-cp-color-picker-panel');
        const gradientBar = panel.querySelector('.hony-cp-gradient-bar');
        const slider = panel.querySelector('.hony-cp-angle-slider');
        const angle = slider?.value || 45;

        const colorInputs = panel.querySelectorAll('.hony-cp-gradient-color-input');
        const color1 = colorInputs[0]?.value || '#165DFF';
        const color2 = colorInputs[1]?.value || '#00B42A';

        const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        if (gradientBar) gradientBar.style.background = gradient;

        const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;
        if (picker) {
            const input = picker.querySelector('.cp-color-picker-input');
            const cpPreview = input.querySelector('.hony-cp-color-preview');
            if (cpPreview) cpPreview.style.background = gradient;
        }
    }
});

// 单色输入
document.addEventListener('input', function(e) {
    const hexInput = e.target.closest('.hony-cp-hex-input');
    if (hexInput) {
        const color = hexInput.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
            const panel = hexInput.closest('.hony-cp-color-picker-panel');
            const picker = panel._pickerInput ? panel._pickerInput.parentElement : null;

            if (picker) {
                const input = picker.querySelector('.cp-color-picker-input');
                const preview = input.querySelector('.hony-cp-color-preview');
                const rgbInput = panel.querySelector('.hony-cp-rgb-input');

                preview.style.backgroundColor = color;

                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                if (rgbInput) rgbInput.value = `rgb(${r}, ${g}, ${b})`;
            }
        }
    }
});

// 窗口调整大小时更新位置
window.addEventListener('resize', function() {
    if (currentColorPicker && currentColorPicker._pickerInput) {
        updateColorPickerPosition(currentColorPicker._pickerInput, currentColorPicker);
    }
});