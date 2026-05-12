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
    // 旧版侧边栏
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
    
    // 新版侧边栏（system-table-separation.html）
    const newSideNavItems = document.querySelectorAll('.hony-nav-menu-item');
    newSideNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果点击的是有子菜单的父菜单，不进行页面跳转
            if (this.classList.contains('has-submenu')) {
                return;
            }
            
            // 移除所有active状态
            newSideNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            // 添加当前项的active状态
            this.classList.add('active');
            
            // 获取页面的onclick属性
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('navigateToPage')) {
                // 已经是navigateToPage调用，不需要处理
                return;
            }
            
            // 检查是否有data-page属性指定要跳转的页面
            const pageFile = this.getAttribute('data-page');
            if (pageFile) {
                e.preventDefault();
                e.stopPropagation();
                navigateToPage(pageFile);
            }
        });
        
        // 二级菜单项点击事件
        const submenuItems = item.querySelectorAll('.hony-nav-menu-subitem');
        submenuItems.forEach(subitem => {
            subitem.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('=== 二级菜单点击 ===');
                console.log('点击的菜单项:', this.textContent);
                
                // 移除所有二级菜单的active状态
                submenuItems.forEach(sub => sub.classList.remove('active'));
                // 添加当前项的active状态
                this.classList.add('active');
                
                // 获取页面文件
                const pageFile = this.getAttribute('data-page');
                console.log('data-page属性值:', pageFile);
                
                if (pageFile) {
                    console.log('调用 navigateToPage:', pageFile);
                    navigateToPage(pageFile);
                } else {
                    console.log('data-page 属性为空');
                }
            });
        });
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
 * 获取项目根路径（处理 GitHub Pages 子目录部署）
 */
function getRootPath() {
    // 始终返回根路径（支持 GitHub Pages、Netlify 等各种托管平台）
    return '/';
}

/**
 * 导航到指定页面
 * @param {string} targetPath - 目标路径（相对于网站根目录，如 'Specification/color.html'）
 */
function navigateTo(targetPath) {
    const rootPath = getRootPath();
    // 如果路径已经以 / 开头，直接使用
    if (targetPath.startsWith('/')) {
        window.location.href = rootPath + targetPath.substring(1);
    } else {
        window.location.href = rootPath + targetPath;
    }
}

/**
 * 导航到桌面端组件页面（相对于 desktop 目录）
 * @param {string} targetPath - 目标路径（如 'A-system/button.html'）
 */
function navigateToDesktop(targetPath) {
    const rootPath = getRootPath();
    // 如果路径已经包含 desktop/，直接使用
    if (targetPath.startsWith('desktop/')) {
        window.location.href = rootPath + targetPath;
        return;
    }
    
    window.location.href = rootPath + 'desktop/' + targetPath;
}

/**
 * 导航到设计规范页面（相对于 Specification 目录）
 * @param {string} targetPath - 目标路径（如 'color.html'）
 */
function navigateToSpecification(targetPath) {
    const rootPath = getRootPath();
    // 如果路径已经包含 Specification/，直接使用
    if (targetPath.startsWith('Specification/')) {
        window.location.href = rootPath + targetPath;
    } else {
        window.location.href = rootPath + 'Specification/' + targetPath;
    }
}

/**
 * 带根路径的 window.open
 * @param {string} targetPath - 目标路径
 * @param {string} target - 打开方式（如 '_blank'）
 */
function openWindow(targetPath, target = '_blank') {
    const rootPath = getRootPath();
    let url = targetPath;
    // 如果是相对路径（不以 http:// 或 https:// 开头），添加根路径
    if (!targetPath.startsWith('http://') && !targetPath.startsWith('https://')) {
        if (targetPath.startsWith('/')) {
            url = rootPath + targetPath.substring(1);
        } else {
            url = rootPath + targetPath;
        }
    }
    window.open(url, target);
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
 * 加载页面内容到主内容容器
 * @param {string} pageFile - 页面文件名（如：system-home.html）
 * @returns {Promise<string>} - 返回页面的HTML内容
 */
async function loadPageContent(pageFile) {
    console.log('=== Loading page content ===');
    console.log('Page file:', pageFile);
    
    try {
        // 计算正确的路径（页面文件在同一目录下）
        const fullPath = pageFile;
        
        console.log('Full path:', fullPath);
        
        // 使用 XMLHttpRequest 获取页面内容
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fullPath, true);
        
        return new Promise((resolve, reject) => {
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('Page content loaded successfully');
                    
                    // 创建临时容器解析HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = xhr.responseText;
                    
                    // 查找 main 元素或 system-page-main 元素
                    let mainContent = tempDiv.querySelector('.system-page-main');
                    if (mainContent) {
                        resolve(mainContent.innerHTML);
                    } else {
                        // 如果没有找到，尝试获取 body 的内容
                        const bodyContent = tempDiv.querySelector('body');
                        if (bodyContent) {
                            resolve(bodyContent.innerHTML);
                        } else {
                            reject(new Error('No main content found in page'));
                        }
                    }
                } else {
                    console.error('Failed to load page content, status:', xhr.status);
                    reject(new Error('Failed to load page content, status: ' + xhr.status));
                }
            };
            
            xhr.onerror = function() {
                console.error('Network error while loading page content');
                reject(new Error('Network error'));
            };
            
            xhr.send();
        });
    } catch (error) {
        console.error('Error loading page content:', error);
        throw error;
    }
}

/**
 * 导航到新页面（更新主内容区域）
 * @param {string} pageFile - 页面文件名
 * @param {string} containerId - 主内容容器ID，默认 'system-page-main'
 */
window.navigateToPage = async function(pageFile, containerId = 'system-page-main') {
    console.log('=== Navigating to page ===');
    console.log('Page:', pageFile);
    console.log('Container:', containerId);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        alert('错误：主内容容器未找到！');
        return;
    }
    console.log('容器找到:', container);
    
    try {
        // 显示加载状态
        console.log('显示加载状态...');
        container.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #999;">加载中...</div>';
        
        // 加载新内容
        console.log('开始加载页面内容...');
        const content = await loadPageContent(pageFile);
        console.log('页面内容加载完成，内容长度:', content.length);
        
        // 更新容器内容
        console.log('更新容器内容...');
        container.innerHTML = content;
        console.log('容器内容更新完成');
        
        // 更新浏览器URL（不刷新页面）
        window.history.pushState({}, '', pageFile);
        
        console.log('Navigation completed');
    } catch (error) {
        console.error('Navigation failed:', error);
        container.innerHTML = '<div style="padding: 20px; color: #f56c6c;">加载失败，请稍后重试</div>';
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
            } else if (currentPath.includes('/desktop/A-system') && onclick.includes('desktop/A-system')) {
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

// ============================================================
// 主题切换功能
// ============================================================

/**
 * 切换主题
 * @param {string} theme - 'light' 或 'dark'
 */
window.switchTheme = function(theme) {
    var root = document.documentElement;
    var tabs = document.querySelectorAll('.hony-tab-item');
    
    if (theme === 'dark') {
        root.classList.add('Dark');
    } else {
        root.classList.remove('Dark');
    }
    
    // 更新标签状态
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
        if ((theme === 'dark' && tab.dataset.tab === 'tab-segment-2') ||
            (theme === 'light' && tab.dataset.tab === 'tab-segment-1')) {
            tab.classList.add('active');
        }
    });
    
    // 保存主题到本地存储
    localStorage.setItem('theme', theme);
}

/**
 * 初始化主题（默认浅色模式）
 */
function initTheme() {
    // 默认使用浅色模式
    document.documentElement.classList.remove('Dark');
    
    // 更新标签状态，确保浅色模式标签为激活状态
    var tabs = document.querySelectorAll('.hony-tab-item');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.tab === 'tab-segment-1') {
            tab.classList.add('active');
        }
    });
    
    // 清除之前保存的主题设置，确保每次进入都是浅色模式
    localStorage.removeItem('theme');
}

// ============================================================
// 打字效果功能（打字-删除-循环）
// ============================================================

const typingLines = [
    '您好！很高兴与你相遇在这里',
    '这是我精心搭建的个人 UI 组件库',
    '记录设计与开发的沉淀',
    '遵循统一设计规范'
];

let currentTypingIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let isDeleting = false;
let typingInterval = null;

function initTypingEffect() {
    const typingLine = document.getElementById('typing-line');
    if (!typingLine) {
        return;
    }
    
    typingLine.textContent = '';
    currentTypingIndex = 0;
    currentCharIndex = 0;
    isTyping = true;
    isDeleting = false;
    
    startTypingCycle();
}

function startTypingCycle() {
    const typingLine = document.getElementById('typing-line');
    if (!typingLine) return;
    
    const currentLine = typingLines[currentTypingIndex];
    
    clearInterval(typingInterval);
    
    if (isDeleting) {
        // 删除模式：一个字一个字删除
        typingInterval = setInterval(() => {
            if (currentCharIndex > 0) {
                currentCharIndex--;
                typingLine.textContent = currentLine.substring(0, currentCharIndex);
            } else {
                clearInterval(typingInterval);
                isDeleting = false;
                // 切换到下一行
                currentTypingIndex = (currentTypingIndex + 1) % typingLines.length;
                // 短暂停顿后开始打字
                setTimeout(startTypingCycle, 300);
            }
        }, 50);
    } else {
        // 打字模式：一个字一个字输入
        typingInterval = setInterval(() => {
            if (currentCharIndex < currentLine.length) {
                typingLine.textContent = currentLine.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            } else {
                clearInterval(typingInterval);
                // 打字完成，等待一段时间后开始删除
                setTimeout(() => {
                    isDeleting = true;
                    startTypingCycle();
                }, 2000);
            }
        }, 80);
    }
}

// ============================================================
// 页面加载完成后初始化
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Page Loaded ===');
    console.log('Current Path:', window.location.pathname);
    
    // 初始化主题
    initTheme();
    
    // 初始化打字效果（仅在首页）
    const typingLine = document.getElementById('typing-line');
    if (typingLine) {
        initTypingEffect();
    }
    
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
            // 初始化单个图片上传组件
            initSingleImageUpload();
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

// 单个图片上传组件初始化
function initSingleImageUpload() {
    // 使用更精确的选择器，确保获取正确的元素
    const innerContainer = document.getElementById('hony-upload-single-image-container');
    if (!innerContainer) {
        console.log('单个图片上传容器未找到');
        return;
    }
    
    const outerContainer = innerContainer.closest('.hony-upload-single-image-container');
    if (!outerContainer) {
        console.log('外部容器未找到');
        return;
    }
    
    const input = innerContainer.querySelector('.hony-upload-input');
    const uploadItem = innerContainer.querySelector('.hony-upload-single-image-item');
    const preview = innerContainer.querySelector('.hony-upload-single-image-preview');
    const previewImg = preview ? preview.querySelector('img') : null;
    const filenameSpan = outerContainer.querySelector('.hony-upload-single-image-filename');
    const statusIcon = outerContainer.querySelector('.hony-upload-status-icon');
    const iconElement = statusIcon ? statusIcon.querySelector('.iconfont') : null;
    const uploadBtn = outerContainer.querySelector('.hony-upload-single-image-operation .hony-btn');
    
    console.log('单个图片上传组件初始化成功', {
        outerContainer,
        innerContainer,
        input,
        uploadItem,
        preview,
        filenameSpan,
        statusIcon,
        uploadBtn
    });
    
    // 点击整个容器触发文件选择
    outerContainer.addEventListener('click', function(e) {
        // 如果点击的是删除按钮或预览覆盖层，不触发上传
        if (e.target.classList.contains('icon-lajitong') || 
            e.target.closest('.icon-lajitong') ||
            e.target.closest('.hony-upload-single-image-preview-overlay')) {
            return;
        }
        // 如果已经有图片，不触发上传
        if (innerContainer.classList.contains('has-image')) {
            return;
        }
        input.click();
    });
    
    // 点击上传按钮触发文件选择
    if (uploadItem) {
        uploadItem.addEventListener('click', function(e) {
            e.stopPropagation();
            input.click();
        });
    }
    
    // 点击文字按钮触发文件选择
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            input.click();
        });
    }
    
    // 文件选择变化处理
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // 显示加载状态
            showUploadStatus('loading', file.name);
            
            // 模拟上传过程
            setTimeout(() => {
                // 创建预览URL
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImg.src = event.target.result;
                    preview.style.display = 'block';
                    // 添加has-image类，隐藏上传按钮
                    innerContainer.classList.add('has-image');
                    
                    // 模拟上传成功（90%概率成功，10%概率失败）
                    const isSuccess = Math.random() > 0.1;
                    if (isSuccess) {
                        showUploadStatus('success', file.name);
                    } else {
                        showUploadStatus('error', file.name);
                    }
                };
                reader.readAsDataURL(file);
            }, 1500); // 模拟1.5秒上传时间
        }
    });
    
    // 删除图片 - 添加事件委托到预览容器
    if (preview) {
        preview.addEventListener('click', function(e) {
            const deleteBtn = e.target.closest('.icon-lajitong');
            if (deleteBtn) {
                e.stopPropagation();
                preview.style.display = 'none';
                if (previewImg) {
                    previewImg.src = '';
                }
                input.value = '';
                innerContainer.classList.remove('has-image');
                // 恢复初始状态
                showUploadStatus('idle', '上传图片');
            }
        });
    }
    
    // 显示上传状态
    function showUploadStatus(status, filename) {
        if (filenameSpan) {
            filenameSpan.textContent = filename;
        }
        // 修改按钮文字
        if (uploadBtn) {
            if (status === 'idle') {
                uploadBtn.textContent = '点击上传';
            } else {
                uploadBtn.textContent = '重新上传';
            }
        }
        if (statusIcon) {
            if (status === 'idle') {
                statusIcon.style.display = 'none';
                statusIcon.classList.remove('hony-upload-status-loading', 'hony-upload-status-success', 'hony-upload-status-error');
            } else {
                statusIcon.style.display = 'flex';
                statusIcon.classList.remove('hony-upload-status-loading', 'hony-upload-status-success', 'hony-upload-status-error');
                
                if (iconElement) {
                    if (status === 'loading') {
                        // 加载图标
                        iconElement.innerHTML = '&#xe63d;';
                        statusIcon.classList.add('hony-upload-status-loading');
                    } else if (status === 'success') {
                        // 成功图标
                        iconElement.innerHTML = '&#xf07e;';
                        statusIcon.classList.add('hony-upload-status-success');
                    } else if (status === 'error') {
                        // 失败图标
                        iconElement.innerHTML = '&#xf07b;';
                        statusIcon.classList.add('hony-upload-status-error');
                    }
                }
            }
        }
    }
}