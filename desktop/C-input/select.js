// 选择器组件相关函数

// 更新下拉框位置
function updateDropdownPosition(dropdown, selectorInput) {
    const rect = selectorInput.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
}

// 切换选择器下拉框
function toggleSelector(selectorInput) {
    const dropdown = selectorInput.nextElementSibling;
    if (dropdown && dropdown.classList.contains('hony-selector-dropdown')) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            selectorInput.classList.remove('active');
            window.removeEventListener('scroll', dropdown._scrollListener);
            if (dropdown._originalParent) {
                dropdown._originalParent.insertBefore(dropdown, dropdown._originalNextSibling);
                delete dropdown._originalParent;
                delete dropdown._originalNextSibling;
                delete dropdown._selectorInput;
                delete dropdown._scrollListener;
            }
        } else {
            dropdown._originalParent = dropdown.parentElement;
            dropdown._originalNextSibling = dropdown.nextElementSibling;
            dropdown._selectorInput = selectorInput;

            document.body.appendChild(dropdown);
            updateDropdownPosition(dropdown, selectorInput);

            dropdown._scrollListener = function() {
                updateDropdownPosition(dropdown, selectorInput);
            };
            window.addEventListener('scroll', dropdown._scrollListener);

            dropdown.style.display = 'block';
            selectorInput.classList.add('active');
        }
    }
}

// 选择选项
function selectOption(option) {
    const dropdown = option.parentElement;
    const selectorInput = dropdown._selectorInput;
    
    // 先保存pagination引用，避免后续操作丢失
    const pagination = selectorInput.closest('.hony-pagination');
    
    const selectorText = selectorInput.querySelector('.hony-selector-text');
    const inputInner = selectorInput.querySelector('.hony-input-inner');

    if (selectorText) {
        selectorText.textContent = option.textContent;
        selectorText.classList.add('hony-selected');
    }

    if (inputInner) {
        inputInner.value = option.textContent;
    }

    const options = dropdown.querySelectorAll('.hony-selector-option');
    options.forEach(opt => opt.classList.remove('hony-selected'));

    option.classList.add('hony-selected');

    dropdown.style.display = 'none';
    selectorInput.classList.remove('active');

    window.removeEventListener('scroll', dropdown._scrollListener);

    if (dropdown._originalParent) {
        dropdown._originalParent.insertBefore(dropdown, dropdown._originalNextSibling);
        delete dropdown._originalParent;
        delete dropdown._originalNextSibling;
        delete dropdown._selectorInput;
        delete dropdown._scrollListener;
    }

    // 如果是分页器中的选择器，触发分页更新
    if (pagination) {
        handlePageSizeChange(option);
    }
}

// 切换复选选择器下拉框
function toggleCheckboxSelector(selectorInput, event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = selectorInput.nextElementSibling;
    if (dropdown && dropdown.classList.contains('hony-checkbox-selector-dropdown')) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            selectorInput.classList.remove('active');
            window.removeEventListener('scroll', dropdown._scrollListener);
            if (dropdown._originalParent) {
                dropdown._originalParent.insertBefore(dropdown, dropdown._originalNextSibling);
                delete dropdown._originalParent;
                delete dropdown._originalNextSibling;
                delete dropdown._selectorInput;
                delete dropdown._scrollListener;
            }
        } else {
            dropdown._originalParent = dropdown.parentElement;
            dropdown._originalNextSibling = dropdown.nextElementSibling;
            dropdown._selectorInput = selectorInput;

            document.body.appendChild(dropdown);
            updateDropdownPosition(dropdown, selectorInput);

            dropdown._scrollListener = function() {
                updateDropdownPosition(dropdown, selectorInput);
            };
            window.addEventListener('scroll', dropdown._scrollListener);

            dropdown.style.display = 'block';
            selectorInput.classList.add('active');
        }
    }
}

// 切换复选选项
function toggleCheckboxOption(option) {
    const checkboxBox = option.querySelector('.hony-checkbox-option-box');
    const wrapper = option.closest('.hony-checkbox-selector').querySelector('.hony-checkbox-tags-wrapper');
    const placeholder = wrapper.querySelector('.hony-selector-placeholder');

    checkboxBox.classList.toggle('hony-checked');
    option.classList.toggle('hony-selected');

    const selectedOptions = option.closest('.hony-checkbox-options-list').querySelectorAll('.hony-checkbox-option.hony-selected');
    const selectedTexts = [];

    wrapper.querySelectorAll('.hony-tab').forEach(tab => tab.remove());

    selectedOptions.forEach((opt, index) => {
        const text = opt.querySelector('.hony-checkbox-option-text').textContent;
        selectedTexts.push(text);

        if (index < 1) {
            const tab = document.createElement('div');
            tab.className = 'hony-tab hony-tab-secondary-light';
            tab.innerHTML = `
                <span class="hony-tab-text">${text}</span>
                <span class="hony-tab-close iconfont" style="cursor: pointer;" onclick="removeCheckboxTag(this, event)">&#xf062;</span>
            `;
            wrapper.insertBefore(tab, placeholder);
        }
    });

    if (selectedOptions.length > 1) {
        const moreTab = document.createElement('div');
        moreTab.className = 'hony-tab hony-tab-secondary-light';
        moreTab.innerHTML = `<span class="hony-tab-text">+${selectedOptions.length - 1}</span>`;
        wrapper.insertBefore(moreTab, placeholder);
    }

    if (selectedTexts.length > 0) {
        placeholder.style.display = 'none';
    } else {
        placeholder.style.display = 'block';
    }
}

// 移除复选选择器标签
function removeCheckboxTag(tagClose, event) {
    event.stopPropagation();
    const tab = tagClose.parentElement;
    const optionText = tab.querySelector('.hony-tab-text').textContent;
    tab.remove();

    const dropdown = document.querySelector('.hony-checkbox-selector-dropdown');
    const option = dropdown.querySelector(`.hony-checkbox-option[data-value="${optionText}"]`);
    if (option) {
        option.querySelector('.hony-checkbox-option-box').classList.remove('hony-checked');
        option.classList.remove('hony-selected');
    }

    const wrapper = document.querySelector('.hony-checkbox-tags-wrapper');
    const placeholder = wrapper.querySelector('.hony-selector-placeholder');
    const remainingTabs = wrapper.querySelectorAll('.hony-tab');

    if (remainingTabs.length === 0) {
        placeholder.style.display = 'block';
    }
}

// 移除标签
function removeTag(tagClose, event) {
    event.stopPropagation();
    const tag = tagClose.parentElement;
    tag.remove();
}

// 切换日期选择器（兼容基础选择器）
function toggleBasicDatePicker(selectorInput) {
    const datePicker = selectorInput.nextElementSibling;
    if (datePicker && datePicker.classList.contains('hony-date-picker')) {
        if (datePicker.style.display === 'block') {
            datePicker.style.display = 'none';
            selectorInput.classList.remove('active');
            window.removeEventListener('scroll', datePicker._scrollListener);
            if (datePicker._originalParent) {
                datePicker._originalParent.insertBefore(datePicker, datePicker._originalNextSibling);
                delete datePicker._originalParent;
                delete datePicker._originalNextSibling;
                delete datePicker._selectorInput;
                delete datePicker._scrollListener;
            }
        } else {
            datePicker._originalParent = datePicker.parentElement;
            datePicker._originalNextSibling = datePicker.nextElementSibling;
            datePicker._selectorInput = selectorInput;

            document.body.appendChild(datePicker);
            updateDropdownPosition(datePicker, selectorInput);

            datePicker._scrollListener = function() {
                updateDropdownPosition(datePicker, selectorInput);
            };
            window.addEventListener('scroll', datePicker._scrollListener);

            datePicker.style.display = 'block';
            selectorInput.classList.add('active');
        }
    }
}

// 选择日期（基础选择器）
function selectBasicDate(dateElement) {
    const allDates = dateElement.closest('.hony-date-picker').querySelectorAll('.hony-date-day');
    allDates.forEach(date => {
        date.classList.remove('hony-selected');
    });

    dateElement.classList.add('hony-selected');
}

// 确认日期选择
function confirmDateSelection(button) {
    const datePicker = button.closest('.hony-date-picker');
    const selectorInput = datePicker._selectorInput || datePicker.previousElementSibling;
    const selectedDate = datePicker.querySelector('.hony-date-day.hony-selected');
    const selectorText = selectorInput.querySelector('.hony-selector-text');

    if (selectedDate) {
        const date = selectedDate.textContent;
        const monthYear = datePicker.querySelector('.hony-date-picker-title').textContent;

        const [month, year] = monthYear.split(' ');
        const months = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };

        const formattedDate = `${year}.${months[month]}.${date.padStart(2, '0')}`;
        selectorText.textContent = formattedDate;
        selectorText.classList.add('hony-selected');
    }

    datePicker.style.display = 'none';
    selectorInput.classList.remove('active');

    if (datePicker._scrollListener) {
        window.removeEventListener('scroll', datePicker._scrollListener);
        delete datePicker._scrollListener;
    }

    if (datePicker._originalParent) {
        datePicker._originalParent.insertBefore(datePicker, datePicker._originalNextSibling);
        delete datePicker._originalParent;
        delete datePicker._originalNextSibling;
        delete datePicker._selectorInput;
    }
}

// 选择近N个月的日期范围
function selectRecentMonth(button, months) {
    const datePicker = button.closest('.hony-date-picker');
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - months);

    const title = datePicker.querySelector('.hony-date-picker-title').textContent;
    const [monthName, year] = title.split(' ');
    const monthsMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    const currentMonth = monthsMap[monthName];
    const currentYear = parseInt(year);

    const startMonth = new Date(currentYear, currentMonth - months + 1, 1);
    const endMonth = new Date(currentYear, currentMonth + 1, 0);

    const dateDays = datePicker.querySelectorAll('.hony-date-day:not(.hony-other-month)');
    dateDays.forEach(day => {
        day.classList.remove('hony-selected');
        const dayNum = parseInt(day.textContent);

        const dayDate = new Date(currentYear, currentMonth, dayNum);
        if (dayDate >= startMonth && dayDate <= endMonth) {
            day.classList.add('hony-selected');
        }
    });
}

// 切换日期范围选择器
function toggleDateRangePicker(selectorInput) {
    const datePicker = selectorInput.nextElementSibling;
    if (datePicker && datePicker.classList.contains('hony-date-picker')) {
        if (datePicker.style.display === 'block') {
            datePicker.style.display = 'none';
            selectorInput.classList.remove('active');
            window.removeEventListener('scroll', datePicker._scrollListener);
            if (datePicker._originalParent) {
                datePicker._originalParent.insertBefore(datePicker, datePicker._originalNextSibling);
                delete datePicker._originalParent;
                delete datePicker._originalNextSibling;
                delete datePicker._selectorInput;
                delete datePicker._scrollListener;
            }
        } else {
            datePicker._originalParent = datePicker.parentElement;
            datePicker._originalNextSibling = datePicker.nextElementSibling;
            datePicker._selectorInput = selectorInput;

            document.body.appendChild(datePicker);
            updateDropdownPosition(datePicker, selectorInput);

            datePicker._scrollListener = function() {
                updateDropdownPosition(datePicker, selectorInput);
            };
            window.addEventListener('scroll', datePicker._scrollListener);

            datePicker.style.display = 'block';
            selectorInput.classList.add('active');
        }
    }
}

// 选择日期范围
function selectDateRange(dateElement) {
    const datePicker = dateElement.closest('.hony-date-picker');
    const selectedDates = datePicker.querySelectorAll('.hony-date-day.hony-selected');

    if (selectedDates.length === 0) {
        dateElement.classList.add('hony-selected');
    } else if (selectedDates.length === 1) {
        dateElement.classList.add('hony-selected');
    } else {
        selectedDates.forEach(date => {
            date.classList.remove('hony-selected');
        });
        dateElement.classList.add('hony-selected');
    }
}

// 确认日期范围选择
function confirmDateRangeSelection(button) {
    const datePicker = button.closest('.hony-date-picker');
    const selectorInput = datePicker._selectorInput || datePicker.previousElementSibling;
    const selectedDates = datePicker.querySelectorAll('.hony-date-day.hony-selected');
    const selectorText = selectorInput.querySelector('.hony-selector-text');

    if (selectedDates.length === 2) {
        const date1 = selectedDates[0].textContent;
        const date2 = selectedDates[1].textContent;
        const monthYear = datePicker.querySelector('.hony-date-picker-title').textContent;

        const [month, year] = monthYear.split(' ');
        const months = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };

        const formattedDate1 = `${year}.${months[month]}.${date1.padStart(2, '0')}`;
        const formattedDate2 = `${year}.${months[month]}.${date2.padStart(2, '0')}`;
        selectorText.textContent = `${formattedDate1} → ${formattedDate2}`;
    }

    datePicker.style.display = 'none';
    selectorInput.classList.remove('active');

    if (datePicker._scrollListener) {
        window.removeEventListener('scroll', datePicker._scrollListener);
        delete datePicker._scrollListener;
    }

    if (datePicker._originalParent) {
        datePicker._originalParent.insertBefore(datePicker, datePicker._originalNextSibling);
        delete datePicker._originalParent;
        delete datePicker._originalNextSibling;
        delete datePicker._selectorInput;
    }
}

// 切换颜色选择器（基础选择器）
function toggleBasicColorPicker(selectorInput) {
    const colorPicker = selectorInput.nextElementSibling;
    if (colorPicker && colorPicker.classList.contains('hony-color-picker')) {
        if (colorPicker.style.display === 'block') {
            colorPicker.style.display = 'none';
            selectorInput.classList.remove('active');
            window.removeEventListener('scroll', colorPicker._scrollListener);
            if (colorPicker._originalParent) {
                colorPicker._originalParent.insertBefore(colorPicker, colorPicker._originalNextSibling);
                delete colorPicker._originalParent;
                delete colorPicker._originalNextSibling;
                delete colorPicker._selectorInput;
                delete colorPicker._scrollListener;
            }
        } else {
            colorPicker._originalParent = colorPicker.parentElement;
            colorPicker._originalNextSibling = colorPicker.nextElementSibling;
            colorPicker._selectorInput = selectorInput;

            document.body.appendChild(colorPicker);
            updateDropdownPosition(colorPicker, selectorInput);

            colorPicker._scrollListener = function() {
                updateDropdownPosition(colorPicker, selectorInput);
            };
            window.addEventListener('scroll', colorPicker._scrollListener);

            colorPicker.style.display = 'block';
            selectorInput.classList.add('active');
        }
    }
}

// 初始化选择器组件
function initSelectorComponent() {
    document.addEventListener('click', function(event) {
        const selectors = document.querySelectorAll('.hony-selector');
        selectors.forEach(selector => {
            const input = selector.querySelector('.hony-selector-input');
            const dropdown = selector.querySelector('.hony-selector-dropdown, .hony-date-picker, .hony-color-picker, .hony-checkbox-selector-dropdown');

            if (input && !selector.contains(event.target)) {
                const bodyDropdowns = document.body.querySelectorAll('.hony-selector-dropdown, .hony-date-picker, .hony-color-picker, .hony-checkbox-selector-dropdown');
                bodyDropdowns.forEach(bodyDropdown => {
                    if (bodyDropdown._selectorInput === input || bodyDropdown._originalParent === selector) {
                        bodyDropdown.style.display = 'none';
                        input.classList.remove('active');
                        if (bodyDropdown._scrollListener) {
                            window.removeEventListener('scroll', bodyDropdown._scrollListener);
                            delete bodyDropdown._scrollListener;
                        }
                        if (bodyDropdown._originalParent) {
                            bodyDropdown._originalParent.insertBefore(bodyDropdown, bodyDropdown._originalNextSibling);
                            delete bodyDropdown._originalParent;
                            delete bodyDropdown._originalNextSibling;
                            delete bodyDropdown._selectorInput;
                        }
                    }
                });

                if (dropdown) {
                    dropdown.style.display = 'none';
                    input.classList.remove('active');
                }
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hony-date-day') && !event.target.classList.contains('hony-other-month') && !event.target.closest('.hony-dp-date-picker')) {
            selectBasicDate(event.target);
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hony-date-picker-btn') && event.target.classList.contains('hony-primary')) {
            confirmDateSelection(event.target);
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hony-date-day') && !event.target.classList.contains('hony-other-month') && event.target.closest('.hony-date-range-picker')) {
            selectDateRange(event.target);
        }
    });

    document.addEventListener('click', function(event) {
        const checkboxOption = event.target.closest('.hony-checkbox-option');
        if (checkboxOption) {
            toggleCheckboxOption(checkboxOption);
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hony-date-picker-btn') && event.target.classList.contains('hony-primary') && event.target.closest('.hony-date-range-picker')) {
            confirmDateRangeSelection(event.target);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initSelectorComponent();
});

// 级联选择器相关函数

// 切换级联选择器下拉框
function toggleCascadeSelector(selectorInput) {
    const cascadeSelector = selectorInput.closest('.hony-cascade-selector');
    if (cascadeSelector.classList.contains('disabled')) {
        return;
    }

    const dropdown = cascadeSelector.querySelector('.hony-cascade-selector-dropdown');
    if (!dropdown) return;

    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';
        cascadeSelector.classList.add('active');
        selectorInput.classList.add('active');

        // 显示第一列，隐藏其他列
        const allOptions = dropdown.querySelectorAll('.hony-cascade-options');
        allOptions.forEach((opt, index) => {
            opt.style.display = index === 0 ? 'block' : 'none';
        });
    } else {
        dropdown.style.display = 'none';
        cascadeSelector.classList.remove('active');
        selectorInput.classList.remove('active');
    }
}

// 选择级联选项
function selectCascadeOption(optionElement, level) {
    const dropdown = optionElement.closest('.hony-cascade-selector-dropdown');
    const cascadeSelector = dropdown.closest('.hony-cascade-selector');
    const selectorInput = cascadeSelector.querySelector('.hony-cascade-selector-input');
    const inputInner = selectorInput.querySelector('.hony-input-inner');

    // 获取所有列
    const allOptions = dropdown.querySelectorAll('.hony-cascade-options');
    const currentLevelIndex = level - 1;

    // 移除同级及后面列的选中状态
    for (let i = currentLevelIndex; i < allOptions.length; i++) {
        const items = allOptions[i].querySelectorAll('.hony-cascade-option');
        items.forEach(item => item.classList.remove('hony-cascade-option-selected'));
    }

    // 添加当前选中状态
    optionElement.classList.add('hony-cascade-option-selected');

    // 收集选中的值
    const selectedValues = [];
    allOptions.forEach((optCol, index) => {
        const selected = optCol.querySelector('.hony-cascade-option-selected');
        if (selected) {
            selectedValues.push(selected.textContent);
        }
    });

    // 更新输入框
    if (selectedValues.length > 0) {
        inputInner.value = selectedValues.join(' / ');
        inputInner.classList.add('hony-selected');
    }

    // 如果有下一级，显示下一级选项
    if (level < allOptions.length) {
        // 隐藏当前级别之后的所有列
        for (let i = currentLevelIndex + 1; i < allOptions.length; i++) {
            allOptions[i].style.display = 'none';
        }
        // 显示下一列
        allOptions[currentLevelIndex + 1].style.display = 'block';
    }

    // 如果选中的是最后一级，关闭下拉框
    if (level === allOptions.length) {
        dropdown.style.display = 'none';
        cascadeSelector.classList.remove('active');
        selectorInput.classList.remove('active');
    }
}

// 点击外部关闭级联选择器
document.addEventListener('click', function(event) {
    if (!event.target.closest('.hony-cascade-selector')) {
        document.querySelectorAll('.hony-cascade-selector-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        document.querySelectorAll('.hony-cascade-selector.active').forEach(selector => {
            selector.classList.remove('active');
        });
        document.querySelectorAll('.hony-cascade-selector-input.active').forEach(input => {
            input.classList.remove('active');
        });
    }
});