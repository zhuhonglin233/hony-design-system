// 步骤条组件相关函数

// 初始化步骤条组件
function initStepsComponent() {
    const allSteps = document.querySelectorAll('.hony-steps');
    
    allSteps.forEach(steps => {
        const stepItems = steps.querySelectorAll('.hony-step-item');
        
        stepItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                stepItems.forEach((step, i) => {
                    if (i < index) {
                        // 之前的步骤设为已完成
                        step.className = 'hony-step-item hony-step-item-finish';
                        const iconElement = step.querySelector('.iconfont');
                        if (iconElement) {
                            iconElement.className = 'iconfont icon-zhengque-filled';
                        }
                    } else if (i === index) {
                        // 当前步骤设为进行中
                        step.className = 'hony-step-item hony-step-item-process';
                        const iconElement = step.querySelector('.iconfont');
                        if (iconElement) {
                            iconElement.className = 'iconfont icon-dengdai-filled';
                        }
                    } else {
                        // 之后的步骤设为未开始
                        step.className = 'hony-step-item hony-step-item-default';
                        const iconElement = step.querySelector('.iconfont');
                        if (iconElement) {
                            iconElement.className = 'iconfont icon-dengdai-filled';
                        }
                    }
                });
            });
        });
    });
}

// 初始化右侧锚点导航滚动高亮
function initAnchorNav() {
    // 所有锚点目标元素
    const sections = [
        { id: 'hony-steps-centered-basic', navItem: null },
        { id: 'hony-steps-centered-number', navItem: null },
        { id: 'hony-steps-centered-icon', navItem: null },
        { id: 'hony-steps-left-basic', navItem: null },
        { id: 'hony-steps-left-number', navItem: null },
        { id: 'hony-steps-left-icon', navItem: null },
        { id: 'hony-steps-vertical-basic', navItem: null },
        { id: 'hony-steps-vertical-number', navItem: null },
        { id: 'hony-steps-vertical-icon', navItem: null }
    ];

    // 获取所有导航项
    const navItems = document.querySelectorAll('.right-nav-item');
    
    // 为导航项添加点击事件
    navItems.forEach((navItem, index) => {
        navItem.addEventListener('click', function() {
            // 移除所有导航项的 active 类
            navItems.forEach(item => item.classList.remove('active'));
            // 为当前点击的导航项添加 active 类
            navItem.classList.add('active');
        });
    });

    // 滚动监听函数
    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        // 遍历所有区域，找到当前可见的区域
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // 更新导航高亮
                    navItems.forEach((item, idx) => {
                        item.classList.remove('active');
                        if (idx === i) {
                            item.classList.add('active');
                        }
                    });
                    break;
                }
            }
        }
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始化时执行一次，设置初始高亮
    handleScroll();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initStepsComponent();
    initAnchorNav();
});