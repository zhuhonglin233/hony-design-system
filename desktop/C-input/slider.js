/* ========================================
   SLIDER 滑块组件交互逻辑
   使用 sl- 前缀避免命名冲突
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSliderComponent();
});

// 全局初始化函数，供AJAX加载后调用
function initSlider() {
    initSliderComponent();
}

function initSliderComponent() {
    const sliders = document.querySelectorAll('.hony-slider:not(.hony-initialized)');
    sliders.forEach(slider => {
        slider.classList.add('hony-initialized');
        initSliderElement(slider);
    });
}

function initSliderElement(slider) {
    if (slider.classList.contains('hony-disabled')) return;

    const track = slider.querySelector('.hony-slider-track');
    const thumb = slider.querySelector('.hony-slider-thumb');
    const fill = slider.querySelector('.hony-slider-fill');
    const input = slider.querySelector('.hony-input');
    const isRange = slider.classList.contains('sl-slider-range');
    const isVertical = slider.classList.contains('hony-slider-vertical');

    if (!track || !thumb || !fill) return;

    const step = parseInt(slider.dataset.step) || 1;
    const min = parseInt(slider.dataset.min) || 0;
    const max = parseInt(slider.dataset.max) || 100;

    let thumbStart = null;
    let thumbEnd = null;
    let currentThumb = null;

    if (isRange) {
        thumbStart = thumb;
        thumbEnd = slider.querySelector('.hony-slider-thumb-end');
    }

    if (isRange) {
        initRangeSlider(slider, track, thumbStart, thumbEnd, fill, input, min, max, step, isVertical);
    } else {
        initSingleSlider(slider, track, thumb, fill, input, min, max, step, isVertical);
    }

    initMarks(slider);

    if (input) {
        input.addEventListener('change', function() {
            let value = parseInt(this.value) || min;
            value = Math.max(min, Math.min(max, value));
            value = Math.round(value / step) * step;
            this.value = value;
            updateSliderPosition(slider, thumb, fill, value, min, max, isVertical);
        });
    }
}

function initSingleSlider(slider, track, thumb, fill, input, min, max, step, isVertical) {
    let isDragging = false;
    const popup = thumb.querySelector('.hony-slider-popup');

    function handleStart(e) {
        if (slider.classList.contains('hony-disabled')) return;
        isDragging = true;
        slider.classList.add('hony-dragging');
        thumb.classList.add('hony-active');
        updatePosition(e);

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }

    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e);
    }

    function handleEnd() {
        isDragging = false;
        slider.classList.remove('hony-dragging');
        thumb.classList.remove('hony-active');
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    }

    function updatePosition(e) {
        const rect = track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let percentage;
        if (isVertical) {
            percentage = (rect.bottom - clientY) / rect.height;
        } else {
            percentage = (clientX - rect.left) / rect.width;
        }

        percentage = Math.max(0, Math.min(1, percentage));
        let value = percentage * (max - min) + min;
        value = Math.round(value / step) * step;
        value = Math.max(min, Math.min(max, value));

        updateSliderPosition(slider, thumb, fill, value, min, max, isVertical);

        if (input) {
            input.value = value;
        }
    }

    thumb.addEventListener('mousedown', handleStart);
    thumb.addEventListener('touchstart', handleStart, { passive: false });
    track.addEventListener('click', updatePosition);

    thumb.addEventListener('mouseenter', function() {
        if (!isDragging) {
            thumb.classList.add('hony-active');
        }
    });

    thumb.addEventListener('mouseleave', function() {
        if (!isDragging) {
            thumb.classList.remove('hony-active');
        }
    });
}

function initRangeSlider(slider, track, thumbStart, thumbEnd, fill, input, min, max, step, isVertical) {
    let isDragging = false;
    let activeThumb = null;

    function handleStart(e, thumb) {
        if (slider.classList.contains('hony-disabled')) return;
        isDragging = true;
        activeThumb = thumb;
        slider.classList.add('hony-dragging');
        thumb.classList.add('hony-active');
        updatePosition(e);

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }

    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e);
    }

    function handleEnd() {
        if (activeThumb) {
            activeThumb.classList.remove('hony-active');
        }
        isDragging = false;
        activeThumb = null;
        slider.classList.remove('hony-dragging');
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    }

    function updatePosition(e) {
        const rect = track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let percentage;
        if (isVertical) {
            percentage = (rect.bottom - clientY) / rect.height;
        } else {
            percentage = (clientX - rect.left) / rect.width;
        }

        percentage = Math.max(0, Math.min(1, percentage));
        let value = percentage * (max - min) + min;
        value = Math.round(value / step) * step;
        value = Math.max(min, Math.min(max, value));

        const startValue = isVertical
            ? (parseFloat(thumbStart.style.bottom) || 0) / 100 * (max - min) + min
            : (parseFloat(thumbStart.style.left) || 0) / 100 * (max - min) + min;
        const endValue = isVertical
            ? (parseFloat(thumbEnd.style.bottom) || 100) / 100 * (max - min) + min
            : (parseFloat(thumbEnd.style.left) || 100) / 100 * (max - min) + min;

        if (activeThumb === thumbStart) {
            value = Math.min(value, endValue - step);
        } else {
            value = Math.max(value, startValue + step);
        }

        updateRangeSliderPosition(slider, thumbStart, thumbEnd, fill, value, min, max, isVertical, activeThumb);

        const inputs = slider.querySelectorAll('.hony-input');
        if (inputs[0]) {
            const pos0 = isVertical ? (parseFloat(thumbStart.style.bottom) || 0) : (parseFloat(thumbStart.style.left) || 0);
            inputs[0].value = Math.round(pos0 / 100 * (max - min) + min);
        }
        if (inputs[1]) {
            const pos1 = isVertical ? (parseFloat(thumbEnd.style.bottom) || 100) : (parseFloat(thumbEnd.style.left) || 100);
            inputs[1].value = Math.round(pos1 / 100 * (max - min) + min);
        }
    }

    thumbStart.addEventListener('mousedown', (e) => handleStart(e, thumbStart));
    thumbStart.addEventListener('touchstart', (e) => handleStart(e, thumbStart), { passive: false });
    thumbEnd.addEventListener('mousedown', (e) => handleStart(e, thumbEnd));
    thumbEnd.addEventListener('touchstart', (e) => handleStart(e, thumbEnd), { passive: false });

    thumbStart.addEventListener('mouseenter', function() {
        if (!isDragging) thumbStart.classList.add('hony-active');
    });
    thumbStart.addEventListener('mouseleave', function() {
        if (!isDragging || activeThumb !== thumbStart) thumbStart.classList.remove('hony-active');
    });
    thumbEnd.addEventListener('mouseenter', function() {
        if (!isDragging) thumbEnd.classList.add('hony-active');
    });
    thumbEnd.addEventListener('mouseleave', function() {
        if (!isDragging || activeThumb !== thumbEnd) thumbEnd.classList.remove('hony-active');
    });

    track.addEventListener('click', function(e) {
        if (isDragging) return;
        const rect = track.getBoundingClientRect();
        let percentage;
        if (isVertical) {
            percentage = (rect.bottom - e.clientY) / rect.height;
        } else {
            percentage = (e.clientX - rect.left) / rect.width;
        }
        let value = percentage * (max - min) + min;
        value = Math.round(value / step) * step;

        const startPos = isVertical ? (parseFloat(thumbStart.style.bottom) || 0) : (parseFloat(thumbStart.style.left) || 0);
        const endPos = isVertical ? (parseFloat(thumbEnd.style.bottom) || 100) : (parseFloat(thumbEnd.style.left) || 100);
        const clickPos = value / (max - min) * 100;

        const distToStart = Math.abs(clickPos - startPos);
        const distToEnd = Math.abs(clickPos - endPos);

        const targetThumb = distToStart < distToEnd ? thumbStart : thumbEnd;
        updateRangeSliderPosition(slider, thumbStart, thumbEnd, fill, value, min, max, isVertical, targetThumb);

        const inputs = slider.querySelectorAll('.hony-input');
        if (inputs[0]) {
            const pos0 = isVertical ? (parseFloat(thumbStart.style.bottom) || 0) : (parseFloat(thumbStart.style.left) || 0);
            inputs[0].value = Math.round(pos0 / 100 * (max - min) + min);
        }
        if (inputs[1]) {
            const pos1 = isVertical ? (parseFloat(thumbEnd.style.bottom) || 100) : (parseFloat(thumbEnd.style.left) || 100);
            inputs[1].value = Math.round(pos1 / 100 * (max - min) + min);
        }
    });
}

function updateSliderPosition(slider, thumb, fill, value, min, max, isVertical) {
    const percentage = (value - min) / (max - min) * 100;

    if (isVertical) {
        fill.style.height = percentage + '%';
        thumb.style.bottom = percentage + '%';
    } else {
        fill.style.width = percentage + '%';
        thumb.style.left = percentage + '%';
    }

    const popup = thumb.querySelector('.hony-slider-popup');
    if (popup) {
        popup.textContent = value;
    }
}

function updateRangeSliderPosition(slider, thumbStart, thumbEnd, fill, value, min, max, isVertical, activeThumb) {
    const percentage = (value - min) / (max - min) * 100;

    if (activeThumb === thumbStart) {
        if (isVertical) {
            thumbStart.style.bottom = percentage + '%';
        } else {
            thumbStart.style.left = percentage + '%';
        }
    } else {
        if (isVertical) {
            thumbEnd.style.bottom = percentage + '%';
        } else {
            thumbEnd.style.left = percentage + '%';
        }
    }

    const startPos = isVertical ? (parseFloat(thumbStart.style.bottom) || 0) : (parseFloat(thumbStart.style.left) || 0);
    const endPos = isVertical ? (parseFloat(thumbEnd.style.bottom) || 100) : (parseFloat(thumbEnd.style.left) || 100);

    if (isVertical) {
        fill.style.bottom = startPos + '%';
        fill.style.height = (endPos - startPos) + '%';
    } else {
        fill.style.left = startPos + '%';
        fill.style.width = (endPos - startPos) + '%';
    }

    const popup = activeThumb.querySelector('.hony-slider-popup');
    if (popup) {
        popup.textContent = value;
    }
}

function initMarks(slider) {
    const marksData = slider.dataset.marks;
    if (!marksData) return;

    const marksContainer = slider.querySelector('.hony-slider-marks-container');
    if (!marksContainer) return;

    try {
        const marks = JSON.parse(marksData);
        const min = parseInt(slider.dataset.min) || 0;
        const max = parseInt(slider.dataset.max) || 100;

        marksContainer.innerHTML = '';

        for (const [key, label] of Object.entries(marks)) {
            const mark = document.createElement('div');
            mark.className = 'hony-mark-item';
            mark.textContent = label;

            const percentage = (parseInt(key) - min) / (max - min) * 100;
            const isVertical = slider.classList.contains('hony-slider-vertical');

            if (isVertical) {
                mark.style.bottom = percentage + '%';
            } else {
                mark.style.left = percentage + '%';
            }

            mark.addEventListener('click', function() {
                const value = parseInt(key);
                const thumb = slider.querySelector('.hony-slider-thumb');
                const fill = slider.querySelector('.hony-slider-fill');
                const input = slider.querySelector('.hony-input');

                updateSliderPosition(slider, thumb, fill, value, min, max, isVertical);

                if (input) {
                    input.value = value;
                }
            });

            marksContainer.appendChild(mark);
        }
    } catch (e) {
        console.warn('Invalid marks data:', marksData);
    }
}

function initStepMarks(slider) {
    const step = parseInt(slider.dataset.step) || 1;
    const min = parseInt(slider.dataset.min) || 0;
    const max = parseInt(slider.dataset.max) || 100;

    const stepMarksContainer = slider.querySelector('.hony-slider-step-marks');
    if (!stepMarksContainer) return;

    const numSteps = Math.floor((max - min) / step);
    const visibleSteps = Math.min(numSteps, 10);

    stepMarksContainer.innerHTML = '';

    for (let i = 0; i <= visibleSteps; i++) {
        const stepMark = document.createElement('div');
        stepMark.className = 'hony-step-mark';
        stepMarksContainer.appendChild(stepMark);
    }
}