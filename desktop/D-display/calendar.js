// 日历日期选择函数
function selectDate(dateItem) {
    // 移除所有日期的选中状态
    const allDates = dateItem.closest('.hony-date-container').querySelectorAll('.hony-date-dates-item');
    allDates.forEach(item => {
        item.classList.remove('hony-active');
    });
    
    // 添加当前日期的选中状态
    dateItem.classList.add('hony-active');
}

// 日历视图切换函数
function switchCalendarTab(tab) {
    var tabs = document.querySelectorAll('.hony-tab-nav-segment .hony-tab-item');
    tabs.forEach(function(t) {
        t.classList.remove('active');
    });
    tab.classList.add('active');
    
    var views = document.querySelectorAll('.hony-calendar-view');
    views.forEach(function(v) {
        v.classList.remove('active');
    });
    var tabId = tab.getAttribute('data-tab');
    var activeView = document.getElementById(tabId);
    if (activeView) {
        activeView.classList.add('active');
    }
}