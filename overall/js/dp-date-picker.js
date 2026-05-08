// TDesign 日期选择器相关函数

// 切换日期选择器面板
function toggleDatePicker(datePickerInput, type) {
    const datePicker = datePickerInput.closest('.hony-dp-date-picker');
    const panel = datePicker.querySelector('.hony-dp-date-picker-panel');

    if (panel.style.display === 'block') {
        // 关闭日期选择器
        closeDatePicker(panel);
    } else {
        // 保存原始位置信息和引用
        panel._originalParent = panel.parentElement;
        panel._originalNextSibling = panel.nextElementSibling;
        panel._selectorInput = datePickerInput;
        panel._type = type;

        // 移动到body末尾
        document.body.appendChild(panel);

        // 定位面板
        updateDatePickerPosition(panel, datePickerInput);

        // 添加滚动事件监听
        panel._scrollListener = function() {
            updateDatePickerPosition(panel, datePickerInput);
        };
        window.addEventListener('scroll', panel._scrollListener);

        // 初始化日期选项
        initDatePickerPanel(panel, type);

        // 打开日期选择器
        panel.style.display = 'block';
        datePickerInput.classList.add('active');
    }
}

// 关闭日期选择器面板
function closeDatePicker(panel) {
    const datePickerInput = panel._selectorInput;

    // 关闭日期选择器
    panel.style.display = 'none';
    if (datePickerInput) {
        datePickerInput.classList.remove('active');
    }

    // 移除滚动事件监听
    if (panel._scrollListener) {
        window.removeEventListener('scroll', panel._scrollListener);
        delete panel._scrollListener;
    }

    // 恢复到原始位置
    if (panel._originalParent) {
        panel._originalParent.insertBefore(panel, panel._originalNextSibling);
        delete panel._originalParent;
        delete panel._originalNextSibling;
        delete panel._selectorInput;
        delete panel._type;
    }
}

// 更新日期选择器位置
function updateDatePickerPosition(panel, datePickerInput) {
    const rect = datePickerInput.getBoundingClientRect();
    panel.style.position = 'fixed';
    panel.style.top = `${rect.bottom + 4}px`;
    panel.style.left = `${rect.left}px`;
}

// 初始化日期选择器面板
function initDatePickerPanel(panel, type) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 更新标题
    const title = panel.querySelector('.hony-dp-date-title');
    if (title) {
        title.textContent = `${year}年${month + 1}月`;
    }

    // 生成日期
    if (type === 'date' || type === 'week' || type === 'datetime') {
        const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
        if (weeksContainer) {
            generateDateDays(weeksContainer, year, month);
        }
    }

    // 生成时间
    if (type === 'datetime') {
        const hoursContainer = panel.querySelector('#hony-dp-time-hours');
        const minutesContainer = panel.querySelector('#hony-dp-time-minutes');
        if (hoursContainer) {
            generateTdTimeItems(hoursContainer, 23);
        }
        if (minutesContainer) {
            generateTdTimeItems(minutesContainer, 59);
        }
    }

    // 生成日期范围
    if (type === 'daterange') {
        const startWeeks = panel.querySelector('#hony-dp-range-start-weeks');
        const endWeeks = panel.querySelector('#hony-dp-range-end-weeks');
        if (startWeeks) {
            generateDateDays(startWeeks, year, month);
        }
        if (endWeeks) {
            generateDateDays(endWeeks, year, month);
        }
    }
}

// 生成日期天数
function generateDateDays(container, year, month) {
    container.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'hony-dp-date-day';
        
        if (currentDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        const today = new Date();
        if (currentDate.getDate() === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        dayElement.textContent = currentDate.getDate();
        dayElement.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
        dayElement.onclick = function() {
            selectDate(this);
        };
        
        container.appendChild(dayElement);
    }
}

// 生成时间选项
function generateTdTimeItems(container, max) {
    container.innerHTML = '';
    
    for (let i = 0; i <= max; i++) {
        const timeElement = document.createElement('div');
        timeElement.className = 'hony-dp-time-item';
        timeElement.textContent = i.toString().padStart(2, '0');
        timeElement.setAttribute('data-value', i);
        timeElement.onclick = function() {
            selectTime(this);
        };
        
        container.appendChild(timeElement);
    }
}

// 选择日期
function selectDate(dayElement) {
    const days = dayElement.parentElement.querySelectorAll('.hony-dp-date-day');
    days.forEach(day => day.classList.remove('hony-selected'));
    dayElement.classList.add('hony-selected');
}

// 选择时间
function selectTime(timeElement) {
    const times = timeElement.parentElement.querySelectorAll('.hony-dp-time-item');
    times.forEach(time => time.classList.remove('hony-selected'));
    timeElement.classList.add('hony-selected');
}

// 上一年
function prevYear(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const title = panel.querySelector('.hony-dp-date-title');
    if (title) {
        const currentText = title.textContent;
        const match = currentText.match(/(\d+)年(\d+)月/);
        if (match) {
            let year = parseInt(match[1]);
            const month = parseInt(match[2]);
            year--;
            title.textContent = `${year}年${month}月`;
            
            const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
            if (weeksContainer) {
                generateDateDays(weeksContainer, year, month - 1);
            }
        }
    }
}

// 上一月
function prevMonth(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const title = panel.querySelector('.hony-dp-date-title');
    if (title) {
        const currentText = title.textContent;
        const match = currentText.match(/(\d+)年(\d+)月/);
        if (match) {
            let year = parseInt(match[1]);
            let month = parseInt(match[2]);
            month--;
            if (month < 1) {
                month = 12;
                year--;
            }
            title.textContent = `${year}年${month}月`;
            
            const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
            if (weeksContainer) {
                generateDateDays(weeksContainer, year, month - 1);
            }
        }
    }
}

// 下一月
function nextMonth(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const title = panel.querySelector('.hony-dp-date-title');
    if (title) {
        const currentText = title.textContent;
        const match = currentText.match(/(\d+)年(\d+)月/);
        if (match) {
            let year = parseInt(match[1]);
            let month = parseInt(match[2]);
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
            title.textContent = `${year}年${month}月`;
            
            const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
            if (weeksContainer) {
                generateDateDays(weeksContainer, year, month - 1);
            }
        }
    }
}

// 下一年
function nextYear(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const title = panel.querySelector('.hony-dp-date-title');
    if (title) {
        const currentText = title.textContent;
        const match = currentText.match(/(\d+)年(\d+)月/);
        if (match) {
            let year = parseInt(match[1]);
            const month = parseInt(match[2]);
            year++;
            title.textContent = `${year}年${month}月`;
            
            const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
            if (weeksContainer) {
                generateDateDays(weeksContainer, year, month - 1);
            }
        }
    }
}

// 选择今天
function selectToday(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
    if (weeksContainer) {
        const today = new Date();
        const todayElement = weeksContainer.querySelector(`[data-date="${today.toISOString().split('T')[0]}"]`);
        if (todayElement) {
            selectDate(todayElement);
        }
    }
}

// 选择本周
function selectThisWeek(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
    if (weeksContainer) {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);
            const dayElement = weeksContainer.querySelector(`[data-date="${currentDate.toISOString().split('T')[0]}"]`);
            if (dayElement) {
                dayElement.classList.add('selected');
            }
        }
    }
}

// 选择此刻
function selectNow(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const weeksContainer = panel.querySelector('.hony-dp-date-weeks');
    const hoursContainer = panel.querySelector('#hony-dp-time-hours');
    const minutesContainer = panel.querySelector('#hony-dp-time-minutes');
    
    if (weeksContainer) {
        const today = new Date();
        const todayElement = weeksContainer.querySelector(`[data-date="${today.toISOString().split('T')[0]}"]`);
        if (todayElement) {
            selectDate(todayElement);
        }
    }
    
    if (hoursContainer) {
        const now = new Date();
        const hourElement = hoursContainer.querySelector(`[data-value="${now.getHours()}"]`);
        if (hourElement) {
            selectTime(hourElement);
        }
    }
    
    if (minutesContainer) {
        const now = new Date();
        const minuteElement = minutesContainer.querySelector(`[data-value="${now.getMinutes()}"]`);
        if (minuteElement) {
            selectTime(minuteElement);
        }
    }
}

// 选择近几天
function selectRecentDays(button, days) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const startWeeks = panel.querySelector('#hony-dp-range-start-weeks');
    const endWeeks = panel.querySelector('#hony-dp-range-end-weeks');
    
    if (startWeeks && endWeeks) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days + 1);
        
        // 选择开始日期
        const startElement = startWeeks.querySelector(`[data-date="${startDate.toISOString().split('T')[0]}"]`);
        if (startElement) {
            selectDate(startElement);
        }
        
        // 选择结束日期
        const endElement = endWeeks.querySelector(`[data-date="${today.toISOString().split('T')[0]}"]`);
        if (endElement) {
            selectDate(endElement);
        }
    }
}

// 选择近几个月
function selectRecentMonths(button, months) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const startWeeks = panel.querySelector('#hony-dp-range-start-weeks');
    const endWeeks = panel.querySelector('#hony-dp-range-end-weeks');
    
    if (startWeeks && endWeeks) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - months + 1);
        startDate.setDate(1);
        
        // 选择开始日期
        const startElement = startWeeks.querySelector(`[data-date="${startDate.toISOString().split('T')[0]}"]`);
        if (startElement) {
            selectDate(startElement);
        }
        
        // 选择结束日期
        const endElement = endWeeks.querySelector(`[data-date="${today.toISOString().split('T')[0]}"]`);
        if (endElement) {
            selectDate(endElement);
        }
    }
}

// 确认日期选择
function confirmDate(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const datePickerInput = panel._selectorInput;
    const type = panel._type;
    
    if (type === 'date' || type === 'week') {
        const selectedDay = panel.querySelector('.hony-dp-date-day.hony-selected');
        if (selectedDay) {
            const date = selectedDay.getAttribute('data-date');
            const input = datePickerInput.querySelector('.hony-dp-date-input');
            input.value = date;
            input.classList.add('has-value');
        }
    } else if (type === 'datetime') {
        const selectedDay = panel.querySelector('.hony-dp-date-day.hony-selected');
        const selectedHour = panel.querySelector('#hony-dp-time-hours .hony-dp-time-item.hony-selected');
        const selectedMinute = panel.querySelector('#hony-dp-time-minutes .hony-dp-time-item.hony-selected');
        
        if (selectedDay && selectedHour && selectedMinute) {
            const date = selectedDay.getAttribute('data-date');
            const hour = selectedHour.getAttribute('data-value').toString().padStart(2, '0');
            const minute = selectedMinute.getAttribute('data-value').toString().padStart(2, '0');
            const input = datePickerInput.querySelector('.hony-dp-date-input');
            input.value = `${date} ${hour}:${minute}`;
            input.classList.add('has-value');
        }
    }
    
    closeDatePicker(panel);
}

// 确认日期范围选择
function confirmDateRange(button) {
    const panel = button.closest('.hony-dp-date-picker-panel');
    const datePickerInput = panel._selectorInput;
    
    const startDay = panel.querySelector('#hony-dp-range-start-weeks .hony-dp-date-day.hony-selected');
    const endDay = panel.querySelector('#hony-dp-range-end-weeks .hony-dp-date-day.hony-selected');
    
    if (startDay && endDay) {
        const startDate = startDay.getAttribute('data-date');
        const endDate = endDay.getAttribute('data-date');
        const inputs = datePickerInput.querySelectorAll('.hony-dp-date-input');
        if (inputs[0]) {
            inputs[0].value = startDate;
            inputs[0].classList.add('has-value');
        }
        if (inputs[1]) {
            inputs[1].value = endDate;
            inputs[1].classList.add('has-value');
        }
    }
    
    closeDatePicker(panel);
}

// 点击外部关闭日期选择器
function initDatePickerClickOutside() {
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.hony-dp-date-picker') && !event.target.closest('.hony-dp-date-picker-panel')) {
            const panels = document.querySelectorAll('.hony-dp-date-picker-panel');
            panels.forEach(panel => {
                if (panel.style.display === 'block') {
                    closeDatePicker(panel);
                }
            });
        }
    });
}

// 页面加载完成后初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initDatePickerClickOutside();
    });
}