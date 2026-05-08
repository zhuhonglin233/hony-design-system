// 选框组件相关函数

// 单选框切换
function toggleRadio(item) {
    // 如果点击的是radio-box本身，找到它的父元素
    let targetItem = item;
    if (item.classList.contains('hony-radio-box')) {
        targetItem = item.parentElement;
    }
    
    if (targetItem.classList.contains('disabled')) {
        return;
    }
    
    const group = targetItem.parentElement;
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
function toggleCheckbox(item) {
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

// 初始化选框组件
function initCheckboxComponent() {
    // 不需要额外的初始化，因为所有事件都是通过onclick直接绑定的
    console.log('选框组件已初始化');
}

// 等待common.js加载完成后再初始化
function waitForCommonJS() {
    if (typeof loadComponent === 'function') {
        initCheckboxComponent();
    } else {
        setTimeout(waitForCommonJS, 100);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查common.js是否已经加载
    if (typeof loadComponent === 'function') {
        initCheckboxComponent();
    } else {
        waitForCommonJS();
    }
});
