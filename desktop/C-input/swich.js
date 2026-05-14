// 开关组件相关函数

// 初始化开关组件
function initSwitchComponent() {
    const switches = document.querySelectorAll('.hony-switch:not(.hony-switch-disabled)');
    switches.forEach(switchEl => {
        // 防止重复初始化
        if (switchEl.dataset.switchInitialized === 'true') {
            return;
        }
        switchEl.dataset.switchInitialized = 'true';
        
        switchEl.addEventListener('click', function() {
            if (this.classList.contains('hony-switch-loading')) {
                return;
            }
            
            const textEl = this.querySelector('.hony-switch-text');
            const hasVisibleText = textEl && textEl.textContent && textEl.textContent.trim() !== '';
            
            // 只有当存在可见文字时才更新文字
            if (!hasVisibleText) {
                // 没有文字或只有空格，只切换状态
                if (this.classList.contains('hony-switch-on')) {
                    this.classList.remove('hony-switch-on');
                    this.classList.add('hony-switch-off');
                } else {
                    this.classList.remove('hony-switch-off');
                    this.classList.add('hony-switch-on');
                }
                return;
            }
            
            if (this.classList.contains('hony-switch-on')) {
                this.classList.remove('hony-switch-on');
                this.classList.add('hony-switch-off');
                // 更新文字为关闭状态
                textEl.textContent = '关闭 ';
            } else {
                this.classList.remove('hony-switch-off');
                this.classList.add('hony-switch-on');
                // 更新文字为开启状态
                textEl.textContent = ' 开启';
            }
        });
    });
}

// 初始化开关组件
function initSwitch() {
    initSwitchComponent();
}

// 如果是首次加载页面，执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitch);
} else {
    // DOM 已经加载完成，直接初始化
    initSwitch();
}
