// 开关组件相关函数

// 初始化开关组件
function initSwitchComponent() {
    const switches = document.querySelectorAll('.hony-switch:not(.hony-switch-disabled)');
    switches.forEach(switchEl => {
        switchEl.addEventListener('click', function() {
            if (this.classList.contains('hony-switch-loading')) {
                return;
            }
            
            if (this.classList.contains('hony-switch-on')) {
                this.classList.remove('hony-switch-on');
                this.classList.add('hony-switch-off');
            } else {
                this.classList.remove('hony-switch-off');
                this.classList.add('hony-switch-on');
            }
        });
    });
}

// 等待common.js加载完成后再初始化
function waitForCommonJS() {
    if (typeof loadComponent === 'function') {
        initSwitchComponent();
    } else {
        setTimeout(waitForCommonJS, 100);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查common.js是否已经加载
    if (typeof loadComponent === 'function') {
        initSwitchComponent();
    } else {
        waitForCommonJS();
    }
});
