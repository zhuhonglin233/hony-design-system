// 标签页 JavaScript
// 包含标签页切换、添加、关闭等功能

// 切换标签页
function switchTab(tabItem) {
    // 获取标签页容器
    const container = tabItem.closest('.hony-tab-nav, .hony-tab-nav-underline, .hony-tab-nav-tab, .hony-tab-nav-card, .hony-tab-nav-bubble, .hony-tab-nav-segment');

    // 获取标签页内容容器
    const contentContainer = container.nextElementSibling;

    // 获取目标标签
    const targetTab = tabItem.getAttribute('data-tab');

    // 移除所有标签项的激活状态
    container.querySelectorAll('.hony-tab-item').forEach(item => {
        item.classList.remove('active');
    });

    // 添加当前标签项的激活状态
    tabItem.classList.add('active');

    // 更新滑动线条位置（仅基础标签页）
    if (container.classList.contains('hony-tab-nav')) {
        updateSlidingLine(container);
    }

    // 隐藏所有标签内容
    contentContainer.querySelectorAll('.hony-tab-content-item').forEach(content => {
        content.classList.remove('active');
    });

    // 显示目标标签内容
    const targetContent = contentContainer.querySelector(`#hony-${targetTab}`);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // 触发图表resize，确保隐藏的图表在显示后能正确获取容器宽度
        setTimeout(function() {
            targetContent.querySelectorAll('.main-chart').forEach(chartContainer => {
                const chartInstance = window.echarts?.getInstanceByDom(chartContainer);
                if (chartInstance) {
                    chartInstance.resize();
                }
            });
        }, 50);
    }
}

// 更新滑动线条位置
function updateSlidingLine(tabNav) {
    const activeTab = tabNav.querySelector('.hony-tab-item.active');
    if (activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const navRect = tabNav.getBoundingClientRect();

        const left = rect.left - navRect.left;
        const width = rect.width;

        // 更新滑动线条样式
        tabNav.style.setProperty('--line-left', left + 'px');
        tabNav.style.setProperty('--line-width', width + 'px');
    }
}

// 关闭标签页
function closeTab(closeButton, tabId, event) {
    // 阻止事件冒泡，避免触发标签切换
    if (event) {
        event.stopPropagation();
    }

    // 获取标签项和内容
    const tabItem = closeButton.closest('.hony-tab-item');
    const tabNav = tabItem.closest('.hony-tab-nav, .hony-tab-nav-underline, .hony-tab-nav-tab, .hony-tab-nav-card, .hony-tab-nav-bubble, .hony-tab-nav-segment');
    const tabContent = tabNav.nextElementSibling;
    const contentItem = tabContent.querySelector(`#hony-${tabId}`);

    // 检查是否是最后一个标签
    const tabItems = tabNav.querySelectorAll('.hony-tab-item:not(.add-tab-icon)');
    if (tabItems.length <= 1) {
        return; // 至少保留一个标签
    }

    // 检查是否是激活的标签
    const isActive = tabItem.classList.contains('active');

    // 移除标签项和内容
    tabItem.remove();
    contentItem.remove();

    // 如果关闭的是激活的标签，激活第一个标签
    if (isActive) {
        const firstTabItem = tabNav.querySelector('.hony-tab-item:not(.add-tab-icon)');
        if (firstTabItem) {
            switchTab(firstTabItem);
        }
    }
}

// 添加标签页
function addTab(addButton) {
    // 获取标签页容器和内容容器
    const tabNav = addButton.closest('.hony-tab-nav');
    const tabContent = tabNav.nextElementSibling;

    // 生成新标签的ID和文本
    const tabCount = tabNav.querySelectorAll('.hony-tab-item').length + 1;
    const newTabId = `tab-extension-${tabCount}`;
    const newTabText = `标签${tabCount}`;

    // 随机图标
    const icons = ['&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    // 创建新标签项
    const newTabItem = document.createElement('div');
    newTabItem.className = 'hony-tab-item';
    newTabItem.setAttribute('data-tab', newTabId);
    newTabItem.setAttribute('onclick', 'switchTab(this)');
    newTabItem.innerHTML = `
        <span class="hony-tab-icon iconfont">${randomIcon}</span>
        <span class="hony-tab-text">${newTabText}</span>
        <span class="hony-tab-close iconfont" onclick="closeTab(this, '${newTabId}')">&#xf062;</span>
    `;

    // 插入新标签项（在添加按钮前）
    tabNav.insertBefore(newTabItem, addButton);

    // 创建新内容项
    const newContentItem = document.createElement('div');
    newContentItem.id = `hony-${newTabId}`;
    newContentItem.className = 'hony-tab-content-item';
    newContentItem.textContent = `${newTabText}内容`;

    // 添加新内容项
    tabContent.appendChild(newContentItem);

    // 切换到新标签
    switchTab(newTabItem);
}

// 添加基础上划线标签页
function addUnderlineTab(addButton) {
    // 获取标签页容器和内容容器
    const tabNav = addButton.closest('.hony-tab-nav-underline');
    const tabContent = tabNav.nextElementSibling;

    // 生成新标签的ID和文本
    const tabCount = tabNav.querySelectorAll('.hony-tab-item:not(.add-tab-icon)').length + 1;
    const newTabId = `tab-underline-${tabCount}`;
    const newTabText = `标签${tabCount}`;

    // 随机图标
    const icons = ['&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    // 创建新标签项
    const newTabItem = document.createElement('div');
    newTabItem.className = 'hony-tab-item';
    newTabItem.setAttribute('data-tab', newTabId);
    newTabItem.setAttribute('onclick', 'switchTab(this)');
    newTabItem.innerHTML = `
        <span class="hony-tab-icon iconfont">${randomIcon}</span>
        <span class="hony-tab-text">${newTabText}</span>
        <span class="hony-tab-close iconfont" onclick="closeTab(this, '${newTabId}', event)">
            &#xf062;
        </span>
    `;

    // 插入新标签项（在添加按钮前）
    tabNav.insertBefore(newTabItem, addButton);

    // 创建新内容项
    const newContentItem = document.createElement('div');
    newContentItem.id = `hony-${newTabId}`;
    newContentItem.className = 'hony-tab-content-item';
    newContentItem.textContent = `${newTabText}内容`;

    // 添加新内容项
    tabContent.appendChild(newContentItem);

    // 切换到新标签
    switchTab(newTabItem);
}

// 添加卡片选项卡
function addCardTab(addButton) {
    // 获取标签页容器和内容容器
    const tabNav = addButton.closest('.hony-tab-nav-card');
    const tabContent = tabNav.nextElementSibling;

    // 生成新标签的ID和文本
    const tabCount = tabNav.querySelectorAll('.hony-tab-item:not(.add-tab-icon)').length + 1;
    const newTabId = `tab-card-${tabCount}`;
    const newTabText = `标签${tabCount}`;

    // 随机图标
    const icons = ['&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    // 创建新标签项
    const newTabItem = document.createElement('div');
    newTabItem.className = 'hony-tab-item';
    newTabItem.setAttribute('data-tab', newTabId);
    newTabItem.setAttribute('onclick', 'switchTab(this)');
    newTabItem.innerHTML = `
        <span class="hony-tab-icon iconfont" style="font-size: 14px;">${randomIcon}</span>
        <span class="hony-tab-text">${newTabText}</span>
        <span class="hony-tab-close iconfont" style="font-size: 12px;" onclick="closeTab(this, '${newTabId}', event)">
            &#xf062;
        </span>
    `;

    // 插入新标签项（在添加按钮前）
    tabNav.insertBefore(newTabItem, addButton);

    // 创建新内容项
    const newContentItem = document.createElement('div');
    newContentItem.id = `hony-${newTabId}`;
    newContentItem.className = 'hony-tab-content-item';
    newContentItem.textContent = `${newTabText}内容`;

    // 添加新内容项
    tabContent.appendChild(newContentItem);

    // 切换到新标签
    switchTab(newTabItem);
}

// 添加选项卡标签页
function addTabTab(addButton) {
    // 获取标签页容器和内容容器
    const tabNav = addButton.closest('.hony-tab-nav-tab');
    const tabContent = tabNav.nextElementSibling;

    // 生成新标签的ID和文本
    const tabCount = tabNav.querySelectorAll('.hony-tab-item:not(.add-tab-icon)').length + 1;
    const newTabId = `tab-tab-${tabCount}`;
    const newTabText = `标签${tabCount}`;

    // 随机图标
    const icons = ['&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;', '&#xea59;'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    // 创建新标签项
    const newTabItem = document.createElement('div');
    newTabItem.className = 'hony-tab-item';
    newTabItem.setAttribute('data-tab', newTabId);
    newTabItem.setAttribute('onclick', 'switchTab(this)');
    newTabItem.innerHTML = `
        <span class="hony-tab-icon iconfont" style="font-size: 14px;">${randomIcon}</span>
        <span class="hony-tab-text">${newTabText}</span>
        <span class="hony-tab-close iconfont" style="font-size: 12px;" onclick="closeTab(this, '${newTabId}', event)">
            &#xf062;
        </span>
    `;

    // 插入新标签项（在添加按钮前）
    tabNav.insertBefore(newTabItem, addButton);

    // 创建新内容项
    const newContentItem = document.createElement('div');
    newContentItem.id = `hony-${newTabId}`;
    newContentItem.className = 'hony-tab-content-item';
    newContentItem.textContent = `${newTabText}内容`;

    // 添加新内容项
    tabContent.appendChild(newContentItem);

    // 切换到新标签
    switchTab(newTabItem);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有基础标签页的滑动线条
    document.querySelectorAll('.hony-tab-nav').forEach(tabNav => {
        updateSlidingLine(tabNav);
    });
});

// 侧边标签页切换函数
function switchSideTab(tab) {
    // 获取当前标签组（支持 .tab-group 和 .side-tabs 两种容器）
    const tabGroup = tab.closest('.hony-tab-group, .side-tabs');

    // 移除所有标签的active类
    const tabItems = tabGroup.querySelectorAll('.hony-tab-item');
    tabItems.forEach(item => {
        item.classList.remove('active');
    });

    // 添加当前标签的active类
    tab.classList.add('active');

    // 获取标签对应的内容ID
    const tabId = tab.getAttribute('data-tab');

    // 隐藏所有内容
    const contentItems = tabGroup.querySelectorAll('.hony-tab-content-item');
    contentItems.forEach(item => {
        item.classList.remove('active');
    });

    // 显示当前标签对应的内容
    const currentContent = document.getElementById(tabId);
    if (currentContent) {
        currentContent.classList.add('active');
    }
}

// 侧边标签页折叠/展开函数
function toggleSideTab(btn) {
    // 获取当前点击的侧边标签页容器
    const sideTabs = btn.closest('.side-tabs');
    
    // 判断当前状态
    const isCurrentlyCollapsed = sideTabs.classList.contains('collapsed');
    
    // 如果当前是展开状态，只收起当前点击的侧边标签页
    if (!isCurrentlyCollapsed) {
        // 收起当前侧边标签页
        sideTabs.classList.add('collapsed');
        btn.classList.add('collapsed');
    } else {
        // 如果当前是收起状态，只展开当前点击的侧边标签页
        sideTabs.classList.remove('collapsed');
        btn.classList.remove('collapsed');
    }
}

// 侧边标签页拖动调整宽度
function startResize(event, handle) {
    // 获取侧边标签页容器
    const sideTabs = handle.closest('.side-tabs');
    const tabNav = sideTabs.querySelector('.hony-tab-nav-side');

    // 添加激活状态
    handle.classList.add('active');

    // 记录初始位置
    const startX = event.clientX;
    const startWidth = sideTabs.offsetWidth;

    // 添加鼠标移动和释放事件
    function onMouseMove(e) {
        // 计算新宽度
        const deltaX = e.clientX - startX;
        let newWidth = startWidth + deltaX;

        // 限制宽度范围
        const minWidth = 60;
        const maxWidth = 400;
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        // 更新宽度
        sideTabs.style.width = newWidth + 'px';
        tabNav.style.width = newWidth + 'px';

        // 确保不处于折叠状态
        sideTabs.classList.remove('collapsed');
        handle.previousElementSibling?.classList.remove('collapsed');
    }

    function onMouseUp() {
        // 移除激活状态和事件监听
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // 添加事件监听
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}