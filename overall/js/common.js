// ============================================================
// 此文件已被废弃，代码已分离到各个组件的独立 JS 文件中
// ============================================================
// 组件 JS 文件位置：
// - desktop/navigation/nav.js          - 导航栏组件
// - desktop/input/select.js            - 选择器组件
// - desktop/input/input.js             - 输入框组件
// - desktop/input/checkbox.js          - 选框组件
// - desktop/input/swich.js             - 开关组件
// - desktop/navigation/tabs.js         - 标签页组件
// - desktop/navigation/navigation-system.js - 侧边导航组件
// - desktop/navigation/steps.js        - 步骤条组件
// - desktop/system/image.js            - 图片组件
// ============================================================

// 导航栏组件相关函数

// 导航栏滚动效果 - 使用单个全局事件监听器
let navbarScrollInitialized = false;

function initNavbarScroll() {
    // 如果已经初始化过，就直接检查当前滚动位置
    if (navbarScrollInitialized) {
        checkNavbarScroll();
        return;
    }
    
    navbarScrollInitialized = true;
    
    // 只添加一次事件监听器
    window.addEventListener('scroll', checkNavbarScroll);
    
    // 立即检查一次
    checkNavbarScroll();
}

function checkNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// 侧边导航点击效果
function initSideNav() {
    const sideNavItems = document.querySelectorAll('.nav-menu-section .nav-item');
    sideNavItems.forEach(item => {
        if (item.getAttribute('onclick')) {
            item.addEventListener('click', function() {
                sideNavItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });
                this.classList.add('active');
            });
        }
    });
}

// 顶部导航点击效果
function initTopNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// 右侧锚点导航滚动监听效果
function initRightNavScroll() {
    const rightNavItems = document.querySelectorAll('.right-nav-item');
    if (rightNavItems.length === 0) return;

    const targets = [];
    rightNavItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick) {
            // 从 handleRightNavClick(this, 'targetId') 中提取目标ID
            const match = onclick.match(/handleRightNavClick\(this,\s*['"]([^'"]+)['"]\)/);
            if (match) {
                let targetId = match[1];
                let target = document.getElementById(targetId);
                // 如果找不到，尝试带 hony- 前缀的ID
                if (!target) {
                    target = document.getElementById('hony-' + targetId);
                }
                if (target) {
                    targets.push({
                        item: item,
                        target: target
                    });
                }
            }
        }
    });

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150;

        let currentTarget = null;
        for (let i = targets.length - 1; i >= 0; i--) {
            const { target } = targets[i];
            if (target.offsetTop <= scrollPosition) {
                currentTarget = targets[i];
                break;
            }
        }

        if (currentTarget) {
            rightNavItems.forEach(item => item.classList.remove('active'));
            currentTarget.item.classList.add('active');
        }
    });
}

// 下拉菜单切换函数
function toggleDropdown(btn) {
    // 关闭其他下拉菜单
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    
    // 找到当前下拉菜单（在dropdown-wrapper内查找）
    const wrapper = btn.closest('.dropdown-wrapper');
    if (wrapper) {
        const menu = wrapper.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }
}

// 点击页面其他地方关闭下拉菜单
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown-wrapper') && !event.target.closest('.dropdown-menu')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// ============================================================
// 导航跳转功能（动态计算路径）
// ============================================================

/**
 * 导航到指定页面
 * @param {string} targetPath - 目标路径（相对于网站根目录，如 'Specification/color.html'）
 */
function navigateTo(targetPath) {
    // 统一使用绝对路径，避免相对路径计算错误
    window.location.href = '/' + targetPath;
}

/**
 * 导航到桌面端组件页面（相对于 desktop 目录）
 * @param {string} targetPath - 目标路径（如 'A-system/button.html'）
 */
function navigateToDesktop(targetPath) {
    // 如果路径已经包含 desktop/，直接使用绝对路径
    if (targetPath.startsWith('desktop/')) {
        window.location.href = '/' + targetPath;
        return;
    }
    
    // 所有情况都使用绝对路径
    window.location.href = '/desktop/' + targetPath;
}

/**
 * 导航到设计规范页面（相对于 Specification 目录）
 * @param {string} targetPath - 目标路径（如 'color.html'）
 */
function navigateToSpecification(targetPath) {
    window.location.href = targetPath;  // 直接跳转，已经在 Specification 目录
}

// ============================================================
// 动态加载组件功能
// ============================================================

/**
 * 获取组件路径（相对于当前页面）
 * 根据当前页面位置调整路径到 overall/components/
 */
function getComponentPath(componentFile) {
    const currentPath = window.location.pathname;
    
    // 计算需要往回走几级
    let backPath = '';
    
    if (currentPath.includes('/Specification/')) {
        // Specification 目录下：../
        backPath = '../';
    } else if (currentPath.includes('/desktop/')) {
        if (currentPath.includes('/desktop/A-system/') || 
            currentPath.includes('/desktop/B-navigation/') ||
            currentPath.includes('/desktop/C-input/') ||
            currentPath.includes('/desktop/D-display/') ||
            currentPath.includes('/desktop/E-popup/')) {
            // desktop 子目录下：../../
            backPath = '../../';
        } else {
            // desktop 根目录下：../
            backPath = '../';
        }
    } else {
        backPath = '../';
    }
    
    return backPath + 'overall/components/' + componentFile;
}

/**
 * 动态调整组件中的资源路径（图片、链接等）
 * @param {HTMLElement} container - 组件容器
 */
function adjustComponentPaths(container) {
    const currentPath = window.location.pathname;
    
    // 计算需要往回走几级
    let backPath = '';
    
    if (currentPath.includes('/Specification/')) {
        // Specification 目录下：../
        backPath = '../';
    } else if (currentPath.includes('/desktop/')) {
        if (currentPath.includes('/desktop/A-system/') || 
            currentPath.includes('/desktop/B-navigation/') ||
            currentPath.includes('/desktop/C-input/') ||
            currentPath.includes('/desktop/D-display/') ||
            currentPath.includes('/desktop/E-popup/')) {
            // desktop 子目录下：../../
            backPath = '../../';
        } else {
            // desktop 根目录下：../
            backPath = '../';
        }
    } else {
        backPath = '../';
    }
    
    // 调整所有 img 标签的 src
    const imgs = container.querySelectorAll('img');
    imgs.forEach(img => {
        let src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            // 如果路径已经以 backPath 开头，就不再处理
            if (!src.startsWith(backPath) && !src.startsWith('../')) {
                img.setAttribute('src', backPath + src);
            }
        }
    });
    
    // 调整所有 a 标签的 href（如果需要）
    const links = container.querySelectorAll('a');
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('javascript:')) {
            // 如果路径已经以 backPath 开头，就不再处理
            if (!href.startsWith(backPath) && !href.startsWith('../')) {
                link.setAttribute('href', backPath + href);
            }
        }
    });
    
    // 调整所有 link 标签的 href（样式文件）
    const stylesheets = container.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            if (!href.startsWith(backPath) && !href.startsWith('../')) {
                link.setAttribute('href', backPath + href);
            }
        }
    });
    
    // 调整所有 script 标签的 src
    const scripts = container.querySelectorAll('script[src]');
    scripts.forEach(script => {
        let src = script.getAttribute('src');
        if (src && !src.startsWith('http')) {
            if (!src.startsWith(backPath) && !src.startsWith('../')) {
                script.setAttribute('src', backPath + src);
            }
        }
    });
}

/**
 * 动态加载 HTML 组件
 * @param {string} containerId - 容器 ID
 * @param {string} componentFile - 组件文件名（如：navbar.html）
 */
async function loadComponent(containerId, componentFile) {
    console.log('=== Loading component ===');
    console.log('Container ID:', containerId);
    console.log('Component File:', componentFile);
    
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container #${containerId} not found`);
            return false;
        }
        
        // 计算正确的路径
        const fullPath = getComponentPath(componentFile);
        
        console.log('Full path:', fullPath);
        console.log('Current path:', window.location.pathname);
        
        // 使用 XMLHttpRequest 来加载组件（兼容性更好）
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fullPath, true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Component loaded successfully');
                container.innerHTML = xhr.responseText;
                
                // 动态调整组件中的图片路径
                adjustComponentPaths(container);
                
                // 重新初始化导航效果
                initSideNav();
                initTopNav();
                initNavbarScroll(); // 重新初始化导航栏滚动效果
                
                // 初始化搜索框
                initSearchBox();
                
                // 根据当前页面设置 active 状态
                setActiveNavItem();
            } else {
                console.error('Failed to load component, status:', xhr.status);
            }
        };
        
        xhr.onerror = function() {
            console.error('Network error while loading component');
        };
        
        xhr.send();
        
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

/**
 * 根据当前 URL 自动设置导航的 active 状态
 */
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    
    // 设置侧边栏 active
    const sideNavItems = document.querySelectorAll('.nav-menu-section .nav-item');
    let activeItem = null;
    sideNavItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(currentFile)) {
            sideNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            activeItem = item;
        }
    });
    
    // 滚动到选中的菜单项
    if (activeItem) {
        // 找到侧边栏滚动容器
        const sideNav = document.querySelector('.nav-menu-section');
        if (sideNav) {
            // 使用 setTimeout 确保 DOM 完全渲染后再滚动
            setTimeout(() => {
                // 计算滚动位置，让菜单项居中显示
                const containerHeight = sideNav.clientHeight;
                const itemOffsetTop = activeItem.offsetTop;
                const itemHeight = activeItem.clientHeight;
                
                // 计算目标滚动位置
                const targetScrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);
                
                // 平滑滚动
                sideNav.scrollTo({
                    top: Math.max(0, targetScrollTop),
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // 设置顶部导航 active
    const topNavItems = document.querySelectorAll('.navbar .nav-item');
    topNavItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick) {
            if (currentPath.includes('/Specification/') && onclick.includes('Specification')) {
                topNavItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            } else if (currentPath.includes('/desktop/') && onclick.includes('desktop')) {
                topNavItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        }
    });
}

/**
 * 加载桌面端页面组件（顶部导航 + 侧边栏）
 */
async function loadDesktopComponents() {
    // 加载顶部导航
    await loadComponent('navbar-container', 'navbar.html');
    // 加载桌面端侧边栏
    await loadComponent('sidebar-container', 'sidebar-desktop.html');
}

/**
 * 加载设计规范页面组件
 */
async function loadSpecificationComponents() {
    // 加载顶部导航
    await loadComponent('navbar-container', 'navbar.html');
    // 加载设计规范侧边栏
    await loadComponent('sidebar-container', 'sidebar-specification.html');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Page Loaded ===');
    console.log('Current Path:', window.location.pathname);
    
    // 检查容器是否存在
    const hasNavbarContainer = document.getElementById('navbar-container');
    const hasSidebarContainer = document.getElementById('sidebar-container');
    console.log('Has Navbar Container:', hasNavbarContainer);
    console.log('Has Sidebar Container:', hasSidebarContainer);
    
    initNavbarScroll();
    initSideNav();
    initTopNav();
    initRightNavScroll();
    initSearchBox();
    
    // 检查页面是否需要加载组件
    if (hasNavbarContainer || hasSidebarContainer) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/desktop/')) {
            console.log('Loading Desktop Components...');
            loadDesktopComponents();
        } else if (currentPath.includes('/Specification/')) {
            console.log('Loading Specification Components...');
            loadSpecificationComponents();
        } else if (hasNavbarContainer) {
            // 首页也加载导航栏
            console.log('Loading Navbar for Home Page...');
            loadComponent('navbar-container', 'navbar.html');
        }
    }
});

// 右侧锚点导航点击处理
function handleRightNavClick(item, targetId) {
    // 移除所有active类
    const allItems = document.querySelectorAll('.right-nav-item');
    allItems.forEach(navItem => navItem.classList.remove('active'));
    
    // 添加当前点击项的active类
    item.classList.add('active');
    
    // 滚动到目标位置 - 先尝试直接查找ID，再尝试带hony-前缀的ID
    let target = document.getElementById(targetId);
    if (!target) {
        target = document.getElementById('hony-' + targetId);
    }
    
    // 如果找到了subsection，滚动到它的subsection-title
    if (target) {
        const titleElement = target.querySelector('.subsection-title');
        if (titleElement) {
            titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// 组件搜索数据
const componentSearchData = [
    { category: 'A-system', name: '按钮', path: 'desktop/A-system/button.html' },
    { category: 'A-system', name: '卡片', path: 'desktop/A-system/card.html' },
    { category: 'A-system', name: '图片', path: 'desktop/A-system/image.html' },
    { category: 'A-system', name: '标签', path: 'desktop/A-system/tab.html' },
    { category: 'B-navigation', name: '标签页', path: 'desktop/B-navigation/tabs.html' },
    { category: 'B-navigation', name: '导航菜单', path: 'desktop/B-navigation/navigation.html' },
    { category: 'B-navigation', name: '面包屑', path: 'desktop/B-navigation/breadcrumb.html' },
    { category: 'B-navigation', name: '分页', path: 'desktop/B-navigation/Pagination.html' },
    { category: 'B-navigation', name: '步骤条', path: 'desktop/B-navigation/steps.html' },
    { category: 'B-navigation', name: '锚点', path: 'desktop/B-navigation/title.html' },
    { category: 'B-navigation', name: '多选器', path: 'desktop/B-navigation/Multi.html' },
    { category: 'C-input', name: '输入框', path: 'desktop/C-input/input.html' },
    { category: 'C-input', name: '选择器', path: 'desktop/C-input/select.html' },
    { category: 'C-input', name: '复选框', path: 'desktop/C-input/checkbox.html' },
    { category: 'C-input', name: '开关', path: 'desktop/C-input/swich.html' },
    { category: 'C-input', name: '滑动输入', path: 'desktop/C-input/slider.html' },
    { category: 'C-input', name: '评分', path: 'desktop/C-input/score.html' },
    { category: 'C-input', name: '树状选择', path: 'desktop/C-input/tree.html' },
    { category: 'C-input', name: '穿梭框', path: 'desktop/C-input/transfer.html' },
    { category: 'C-input', name: '表单', path: 'desktop/C-input/form.html' },
    { category: 'C-input', name: '上传', path: 'desktop/C-input/upload.html' },
    { category: 'D-display', name: '表格', path: 'desktop/D-display/table.html' },
    { category: 'D-display', name: '列表', path: 'desktop/D-display/list.html' },
    { category: 'D-display', name: '日历', path: 'desktop/D-display/calendar.html' },
    { category: 'D-display', name: '时间轴', path: 'desktop/D-display/timeline.html' },
    { category: 'D-display', name: '徽章', path: 'desktop/D-display/badge.html' },
    { category: 'D-display', name: '头像', path: 'desktop/D-display/avatar.html' },
    { category: 'D-display', name: '描述', path: 'desktop/D-display/descriptions.html' },
    { category: 'D-display', name: '评论', path: 'desktop/D-display/comment.html' },
    { category: 'E-popup', name: '弹窗', path: 'desktop/E-popup/modal.html' },
    { category: 'E-popup', name: '下拉框', path: 'desktop/E-popup/dropdown.html' },
    { category: 'E-popup', name: '提示框', path: 'desktop/E-popup/alert.html' },
    { category: 'E-popup', name: '确认框', path: 'desktop/E-popup/popconfirm.html' },
];

// 搜索框相关函数
function clearSearch(clearBtn) {
    const searchBox = clearBtn.closest('.search-box');
    const searchInput = searchBox.querySelector('.search-input');
    const dropdown = searchBox.querySelector('.search-dropdown');
    searchInput.value = '';
    clearBtn.style.display = 'none';
    dropdown.style.display = 'none';
    searchInput.focus();
}

function performSearch(searchInput) {
    const searchBox = searchInput.closest('.search-box');
    const dropdown = searchBox.querySelector('.search-dropdown');
    const resultsList = searchBox.querySelector('#search-results');
    const clearBtn = searchBox.querySelector('.search-clear');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length === 0) {
        dropdown.style.display = 'none';
        clearBtn.style.display = 'none';
        return;
    }
    
    clearBtn.style.display = 'block';
    
    const results = componentSearchData.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        resultsList.innerHTML = '<div class="search-no-results">未找到匹配的组件</div>';
    } else {
        resultsList.innerHTML = results.map(item => `
            <div class="search-dropdown-item" onclick="navigateToDesktop('${item.path}')">
                <span class="category">${item.category}</span>
                <span class="separator">-</span>
                <span class="component-name">${item.name}</span>
            </div>
        `).join('');
    }
    
    dropdown.style.display = 'block';
}

function initSearchBox() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            performSearch(this);
        });
        
        input.addEventListener('focus', function() {
            performSearch(this);
        });
        
        input.addEventListener('blur', function() {
            const searchBox = this.closest('.search-box');
            const dropdown = searchBox.querySelector('.search-dropdown');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });
    });
}