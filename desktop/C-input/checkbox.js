// 选框组件相关函数

// 单选框切换
function toggleCheckboxRadio(item) {
    // 如果点击的是radio-box本身，找到它的父元素
    let targetItem = item;
    if (item.classList.contains('hony-radio-box')) {
        targetItem = item.parentElement;
    }
    
    if (targetItem.classList.contains('disabled')) {
        return;
    }
    
    const group = targetItem.parentElement;
    // 使用更通用的选择器来匹配所有单选框项
    const radioItems = group.querySelectorAll('.hony-checkbox-item, .hony-checkbox-item-bordered');
    radioItems.forEach(radioItem => {
        const radioBox = radioItem.querySelector('.hony-radio-box');
        if (radioBox) {
            radioBox.classList.remove('checked');
        }
        radioItem.classList.remove('hony-checkboxed');
    });
    
    const radioBox = targetItem.querySelector('.hony-radio-box');
    if (radioBox) {
        radioBox.classList.add('checked');
    }
    targetItem.classList.add('hony-checkboxed');
}

// 复选框切换
function toggleCheckboxBox(item) {
    // 如果点击的是checkbox-box本身，找到它的父元素
    let targetItem = item;
    if (item.classList.contains('hony-checkbox-box')) {
        targetItem = item.parentElement;
    }
    
    if (targetItem.classList.contains('disabled')) {
        return;
    }
    
    const checkboxBox = targetItem.querySelector('.hony-checkbox-box');
    if (checkboxBox.classList.contains('checked')) {
        checkboxBox.classList.remove('checked');
        targetItem.classList.remove('hony-checkboxed');
    } else if (checkboxBox.classList.contains('indeterminate')) {
        checkboxBox.classList.remove('indeterminate');
        checkboxBox.classList.add('checked');
        targetItem.classList.add('hony-checkboxed');
    } else {
        checkboxBox.classList.add('checked');
        targetItem.classList.add('hony-checkboxed');
    }
}

// 勾选样式切换
function toggleCheckmark(item) {
    // 如果点击的是checkmark-box本身，找到它的父元素
    let targetItem = item;
    if (item.classList.contains('hony-checkmark-box')) {
        targetItem = item.parentElement;
    }
    
    if (targetItem.classList.contains('disabled')) {
        return;
    }
    
    const checkmarkBox = targetItem.querySelector('.hony-checkmark-box');
    checkmarkBox.classList.toggle('checked');
}

// 徽章类型选框切换
function toggleCheckboxBadge(item) {
    // 如果点击的是badge本身，找到它的父元素
    let targetItem = item;
    if (item.classList.contains('hony-checkbox-badge')) {
        targetItem = item.parentElement;
    }
    
    if (targetItem.classList.contains('disabled')) {
        return;
    }
    
    const group = targetItem.parentElement;
    // 检查是否是单选模式（通过父容器判断）
    const isRadio = group.classList.contains('hony-radio-group') || 
                    group.classList.contains('hony-checkbox-group-bordered');
    
    if (isRadio) {
        // 单选模式：取消其他选中项
        const badgeItems = group.querySelectorAll('.hony-checkbox-item-bordered');
        badgeItems.forEach(badgeItem => {
            badgeItem.classList.remove('hony-checkboxed');
        });
    }
    
    // 切换当前项的选中状态
    targetItem.classList.toggle('hony-checkboxed');
}

// 初始化选框组件
function initCheckboxComponent() {
    // 获取所有选框项（包括基础样式和扩展样式）
    const allItems = document.querySelectorAll('.hony-checkbox-group .hony-checkbox-item:not(.disabled), .hony-checkbox-group-bordered .hony-checkbox-item-bordered:not(.disabled)');
    let radioCount = 0;
    let checkboxCount = 0;
    let badgeCount = 0;
    
    allItems.forEach(item => {
        // 防止重复绑定
        if (item.dataset.checkboxInitialized === 'true') {
            return;
        }
        item.dataset.checkboxInitialized = 'true';
        
        // 移除内联的 onclick 属性，避免与 tree.js 的函数冲突
        item.removeAttribute('onclick');
        
        // 判断是单选框、复选框还是徽章类型
        if (item.querySelector('.hony-radio-box')) {
            // 单选框
            item.addEventListener('click', function() {
                toggleCheckboxRadio(this);
            });
            radioCount++;
        } else if (item.querySelector('.hony-checkbox-box')) {
            // 复选框
            item.addEventListener('click', function() {
                toggleCheckboxBox(this);
            });
            checkboxCount++;
        } else if (item.classList.contains('hony-checkbox-item-badge')) {
            // 徽章类型选框
            item.addEventListener('click', function() {
                toggleCheckboxBadge(this);
            });
            badgeCount++;
        }
    });
    
    console.log('选框组件已初始化，单选框:', radioCount, '个，复选框:', checkboxCount, '个，徽章:', badgeCount, '个');
}

// 初始化选框组件
function initCheckbox() {
    initCheckboxComponent();
}

// 如果是首次加载页面，执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckbox);
} else {
    // DOM 已经加载完成，直接初始化
    initCheckbox();
}
