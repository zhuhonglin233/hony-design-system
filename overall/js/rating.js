// 评分组件交互相关函数

// 存储当前评分状态
let currentRatings = {
    'stars': 0,
    'hearts': 0
};

/**
 * 处理星星/心形评分点击事件
 */
function handleStarClick(event, type) {
    const container = document.getElementById(`rating-${type}-demo`);
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    let itemWidth = rect.width / 5;
    const items = container.querySelectorAll(`.hony-${type.slice(0, -1)}-item`);
    if (items.length > 0) {
        const firstItem = items[0];
        const itemRect = firstItem.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        const gap = parseFloat(computedStyle.gap) || 0;
        itemWidth = itemRect.width + gap;
    }
    
    let clickValue = Math.ceil(mouseX / itemWidth);
    
    if (clickValue < 0) clickValue = 0;
    if (clickValue > 5) clickValue = 5;
    
    updateStarDisplay(type, clickValue, false);
}

/**
 * 处理星星/心形评分鼠标移动事件
 */
function handleStarMouseMove(event, type) {
    const container = document.getElementById(`rating-${type}-demo`);
    if (!container) return;
    
    const items = container.querySelectorAll(`.hony-${type.slice(0, -1)}-item`);
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    let itemWidth = rect.width / 5;
    if (items.length > 0) {
        const firstItem = items[0];
        const itemRect = firstItem.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        const gap = parseFloat(computedStyle.gap) || 0;
        itemWidth = itemRect.width + gap;
    }
    
    let hoverValue = Math.ceil(mouseX / itemWidth);
    
    if (hoverValue < 0) hoverValue = 0;
    if (hoverValue > 5) hoverValue = 5;
    
    updateStarDisplay(type, hoverValue, true);
}

/**
 * 更新星星/心形显示状态
 */
function updateStarDisplay(type, value, isHover = false) {
    const container = document.getElementById(`rating-${type}-demo`);
    if (!container) return;
    
    const valueDisplay = document.getElementById(`${type}-value`);
    const itemClass = type.slice(0, -1) + '-item';
    const items = container.querySelectorAll(`.hony-${itemClass}`);
    
    items.forEach((item, index) => {
        const itemValue = index + 1;
        item.classList.remove('hony-full', 'hony-half');
        
        if (itemValue <= Math.floor(value)) {
            item.classList.add('hony-full');
        } else if (itemValue <= value) {
            item.classList.add('hony-half');
        }
    });
    
    if (!isHover) {
        currentRatings[type] = value;
    }
    if (valueDisplay) {
        valueDisplay.textContent = value;
    }
}

/**
 * 重置星星悬停状态
 */
function resetStarHover(type) {
    updateStarDisplay(type, currentRatings[type]);
}

/**
 * 初始化评分组件交互
 */
function initRatingComponents() {
    // 星星/心形评分点击事件
    document.querySelectorAll('.hony-rating-stars, .hony-rating-hearts').forEach(container => {
        container.addEventListener('click', function(event) {
            const type = this.id.includes('stars') ? 'stars' : 'hearts';
            const rect = this.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const itemWidth = rect.width / 5;
            let clickValue = Math.ceil(mouseX / itemWidth);
            
            if (clickValue < 0) clickValue = 0;
            if (clickValue > 5) clickValue = 5;
            
            updateStarDisplay(type, clickValue, false);
        });
        
        // 鼠标移动事件
        container.addEventListener('mousemove', function(event) {
            const type = this.id.includes('stars') ? 'stars' : 'hearts';
            handleStarMouseMove(event, type);
        });
        
        // 鼠标离开事件
        container.addEventListener('mouseleave', function(event) {
            const type = this.id.includes('stars') ? 'stars' : 'hearts';
            resetStarHover(type);
        });
    });
    
    // 满意度评分交互
    const satisfactionContainers = document.querySelectorAll('.hony-rating-satisfaction:not(.hony-disabled)');
    
    satisfactionContainers.forEach(container => {
        const emojis = container.querySelectorAll('.hony-rating-emoji');
        const text = container.querySelector('.hony-rating-text');
        
        const satisfactionLabels = {
            1: '很不满意',
            2: '不满意',
            3: '一般',
            4: '满意',
            5: '非常满意'
        };
        
        emojis.forEach(emoji => {
            emoji.addEventListener('click', function() {
                emojis.forEach(e => e.classList.remove('hony-active'));
                this.classList.add('hony-active');
                const value = this.getAttribute('data-value');
                if (text) {
                    text.textContent = satisfactionLabels[value] || '请选择';
                }
            });
        });
    });
}

// 页面加载完成后初始化评分组件
document.addEventListener('DOMContentLoaded', function() {
    initRatingComponents();
});