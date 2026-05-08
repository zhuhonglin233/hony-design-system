// 时间选择器相关函数

// 切换时间选择器面板
function toggleTimePicker(timePickerInput) {
    const timePicker = timePickerInput.closest('.hony-time-picker');
    const panel = timePicker.querySelector('.hony-time-picker-panel');

    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        timePickerInput.classList.add('active');
        initTimePickerPanel(panel);
    } else {
        panel.style.display = 'none';
        timePickerInput.classList.remove('active');
    }
}

// 初始化时间选择器面板
function initTimePickerPanel(panel) {
    const columns = panel.querySelectorAll('.hony-time-picker-column');
    columns.forEach(column => {
        const type = column.dataset.type;
        const list = column.querySelector('.hony-time-picker-list');
        list.innerHTML = '';

        let maxValue = 60;
        if (type === 'hour') {
            maxValue = 24;
        }

        for (let i = 0; i < maxValue; i++) {
            const item = document.createElement('div');
            item.className = 'hony-time-picker-item';
            item.textContent = String(i).padStart(2, '0');
            item.dataset.value = i;

            const currentInput = panel.closest('.hony-time-picker').querySelector('.hony-time-input');
            const currentValue = currentInput.value;

            if (currentValue) {
                const timeParts = currentValue.split(':');
                let currentVal = type === 'hour' ? parseInt(timeParts[0]) : parseInt(timeParts[1]);
                if (type === 'second' && timeParts[2]) {
                    currentVal = parseInt(timeParts[2]);
                }
                if (i === currentVal) {
                    item.classList.add('hony-selected');
                }
            }

            item.addEventListener('click', function() {
                const allItems = list.querySelectorAll('.hony-time-picker-item');
                allItems.forEach(p => p.classList.remove('hony-selected'));
                item.classList.add('hony-selected');
            });

            list.appendChild(item);
        }

        // 滚动到选中项或顶部
        const selectedItem = list.querySelector('.hony-time-picker-item.hony-selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
            list.scrollTop = 0;
        }
    });
}

// 选择当前时间
function selectCurrentTime(button) {
    const panel = button.closest('.hony-time-picker-panel');
    const columns = panel.querySelectorAll('.hony-time-picker-column');
    const timePicker = panel.closest('.hony-time-picker');
    const input = timePicker.querySelector('.hony-time-input');

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const timeParts = [hours, minutes, seconds];

    columns.forEach((column, index) => {
        const list = column.querySelector('.hony-time-picker-list');
        const allItems = list.querySelectorAll('.hony-time-picker-item');
        allItems.forEach(item => {
            item.classList.remove('hony-selected');
            if (parseInt(item.dataset.value) === timeParts[index]) {
                item.classList.add('hony-selected');
            }
        });
    });

    input.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 确认时间选择
function confirmTime(button) {
    const panel = button.closest('.hony-time-picker-panel');
    const timePicker = panel.closest('.hony-time-picker');
    const input = timePicker.querySelector('.hony-time-input');
    const columns = panel.querySelectorAll('.hony-time-picker-column');

    const selectedValues = [];
    columns.forEach(column => {
        const list = column.querySelector('.hony-time-picker-list');
        const selectedItem = list.querySelector('.hony-time-picker-item.hony-selected');
        if (selectedItem) {
            selectedValues.push(String(selectedItem.dataset.value).padStart(2, '0'));
        } else {
            selectedValues.push('00');
        }
    });

    input.value = selectedValues.join(':');
    panel.style.display = 'none';
    timePicker.querySelector('.hony-time-picker-input').classList.remove('active');
}

// 点击其他地方关闭面板
document.addEventListener('click', function(event) {
    if (!event.target.closest('.hony-time-picker') && !event.target.closest('.hony-time-picker-panel')) {
        const panels = document.querySelectorAll('.hony-time-picker-panel');
        panels.forEach(panel => {
            panel.style.display = 'none';
        });
        const inputs = document.querySelectorAll('.hony-time-picker-input.active');
        inputs.forEach(input => {
            input.classList.remove('active');
        });
    }
});