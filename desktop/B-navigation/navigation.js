// 侧边导航组件相关函数

// 初始化侧边栏导航
function initSidebarNav(navId) {
    const sidebarNav = document.getElementById(navId);
    if (!sidebarNav) {
        console.error('未找到' + navId + '元素');
        return;
    }
    
    const menuItems = sidebarNav.querySelectorAll('.hony-nav-menu-item');
    console.log(navId + '找到菜单项数量:', menuItems.length);
    
    menuItems.forEach(function(menuItem, index) {
        const header = menuItem.querySelector('.hony-nav-menu-item-header');
        const content = menuItem.querySelector('.hony-nav-menu-item-content');
        const subItems = menuItem.querySelectorAll('.hony-nav-menu-subitem');
        
        if (header && content) {
            console.log(navId + '菜单项', index, '有二级导航，添加点击事件');
            
            const hasActiveSubItem = Array.from(subItems).some(subItem => subItem.classList.contains('active'));
            if (hasActiveSubItem) {
                menuItem.classList.add('active');
            }
            
            header.addEventListener('click', function(e) {
                console.log('点击了' + navId + '菜单项', index);
                e.preventDefault();
                e.stopPropagation();
                
                const isCollapsed = sidebarNav.classList.contains('collapsed');
                
                if (isCollapsed) {
                    return;
                }
                
                const isExpanded = content.style.display === 'flex';
                if (isExpanded) {
                    content.style.display = 'none';
                    header.classList.remove('expanded');
                } else {
                    content.style.display = 'flex';
                    header.classList.add('expanded');
                }
                
                const hasActiveSubItem = Array.from(subItems).some(subItem => subItem.classList.contains('active'));
                if (hasActiveSubItem) {
                    menuItem.classList.add('active');
                }
            });
            
            subItems.forEach(function(subItem) {
                subItem.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    sidebarNav.querySelectorAll('.hony-nav-menu-subitem').forEach(function(otherSubItem) {
                        otherSubItem.classList.remove('active');
                    });
                    
                    menuItems.forEach(function(otherMenuItem) {
                        otherMenuItem.classList.remove('active');
                    });
                    
                    sidebarNav.querySelectorAll('.hony-nav-menu-item-header').forEach(function(otherHeader) {
                        otherHeader.classList.remove('expanded');
                        const otherContent = otherHeader.nextElementSibling;
                        if (otherContent && otherContent.classList.contains('hony-nav-menu-item-content')) {
                            otherContent.style.display = 'none';
                        }
                    });
                    
                    subItem.classList.add('active');
                    
                    menuItem.classList.add('active');
                    
                    const isCollapsed = sidebarNav.classList.contains('collapsed');
                    if (!isCollapsed) {
                        content.style.display = 'flex';
                        header.classList.add('expanded');
                    } else {
                        content.style.display = '';
                        header.classList.remove('expanded');
                    }
                    
                    // 检查是否有 data-page 属性，如果有则跳转到对应页面
                    const pageFile = subItem.getAttribute('data-page');
                    if (pageFile) {
                        console.log('导航到页面:', pageFile);
                        
                        // 直接实现导航逻辑
                        const container = document.getElementById('system-page-main');
                        if (!container) {
                            console.error('主内容容器 #system-page-main 未找到');
                            return;
                        }
                        
                        // 显示加载状态
                        container.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #999;">加载中...</div>';
                        
                        // 使用 XMLHttpRequest 加载页面内容
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', pageFile, true);
                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                // 创建临时容器解析HTML
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = xhr.responseText;
                                
                                // 查找 main 元素或 system-page-main 元素
                                let mainContent = tempDiv.querySelector('.system-page-main');
                                if (mainContent) {
                                    container.innerHTML = mainContent.innerHTML;
                                } else {
                                    // 如果没有找到，尝试获取 body 的内容
                                    const bodyContent = tempDiv.querySelector('body');
                                    if (bodyContent) {
                                        container.innerHTML = bodyContent.innerHTML;
                                    } else {
                                        container.innerHTML = '<div style="padding: 20px; color: #f56c6c;">加载失败，未找到主内容</div>';
                                    }
                                }
                                // 更新浏览器URL
                                window.history.pushState({}, '', pageFile);
                            } else {
                                container.innerHTML = '<div style="padding: 20px; color: #f56c6c;">加载失败，状态码: ' + xhr.status + '</div>';
                            }
                        };
                        xhr.onerror = function() {
                            container.innerHTML = '<div style="padding: 20px; color: #f56c6c;">网络错误，无法加载页面</div>';
                        };
                        xhr.send();
                    }
                });
            });
        } else if (header) {
            console.log(navId + '菜单项', index, '没有二级导航');
            
            header.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                sidebarNav.querySelectorAll('.hony-nav-menu-subitem').forEach(function(subItem) {
                    subItem.classList.remove('active');
                });
                
                menuItems.forEach(function(otherMenuItem) {
                    otherMenuItem.classList.remove('active');
                });
                
                menuItem.classList.add('active');
            });
        }
    });
}

// 初始化抽屉导航
function initDrawerNav(navId) {
    const sidebarNav = document.getElementById(navId);
    if (!sidebarNav) {
        console.error('未找到' + navId + '元素');
        return;
    }
    
    const drawerNavItems = sidebarNav.querySelectorAll('.hony-drawer-nav-item');
    const drawerNavRightItems = sidebarNav.querySelectorAll('.hony-drawer-nav-right-item');
    
    drawerNavRightItems.forEach(function(rightItem) {
        if (rightItem.classList.contains('active')) {
            const drawerNavRight = rightItem.closest('.hony-drawer-nav-right');
            const drawerNavItem = drawerNavRight.previousElementSibling;
            if (drawerNavItem && drawerNavItem.classList.contains('hony-drawer-nav-item')) {
                drawerNavItem.classList.add('active');
            }
        }
    });
    
    drawerNavItems.forEach(function(item) {
        const hasSubmenu = item.classList.contains('no-submenu');
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (hasSubmenu) {
                drawerNavItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                });
                
                item.classList.add('active');
                
                const drawerNavRights = sidebarNav.querySelectorAll('.hony-drawer-nav-right');
                drawerNavRights.forEach(right => {
                    right.style.display = 'none';
                });
            }
            
            return false;
        });
        
        item.addEventListener('mouseenter', function(e) {
            e.stopPropagation();
            
            if (!hasSubmenu) {
                const drawerNavRights = sidebarNav.querySelectorAll('.hony-drawer-nav-right');
                drawerNavRights.forEach(right => {
                    right.style.display = 'none';
                });
                
                const nextSibling = item.nextElementSibling;
                if (nextSibling && nextSibling.classList.contains('hony-drawer-nav-right')) {
                    nextSibling.style.display = 'block';
                }
            }
        });
        
        item.addEventListener('mouseleave', function(e) {
            e.stopPropagation();
            
            if (!hasSubmenu) {
                const nextSibling = item.nextElementSibling;
                if (nextSibling && nextSibling.classList.contains('hony-drawer-nav-right')) {
                    setTimeout(() => {
                        const isHovering = nextSibling.matches(':hover');
                        if (!isHovering) {
                            nextSibling.style.display = 'none';
                        }
                    }, 100);
                }
            }
        });
    });
    
    drawerNavRightItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            drawerNavRightItems.forEach(function(otherItem) {
                otherItem.classList.remove('active');
            });
            
            item.classList.add('active');
            
            const drawerNavRight = item.closest('.hony-drawer-nav-right');
            const drawerNavItem = drawerNavRight.previousElementSibling;
            if (drawerNavItem && drawerNavItem.classList.contains('hony-drawer-nav-item')) {
                drawerNavItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                });
                drawerNavItem.classList.add('active');
            }
            
            return false;
        });
    });
    
    const drawerNavRights = sidebarNav.querySelectorAll('.hony-drawer-nav-right');
    drawerNavRights.forEach(function(right) {
        right.addEventListener('mouseenter', function(e) {
            e.stopPropagation();
            this.style.display = 'block';
        });
        
        right.addEventListener('mouseleave', function(e) {
            e.stopPropagation();
            this.style.display = 'none';
        });
    });
}

// 初始化收起菜单
function initCollapseMenu() {
    for (let i = 1; i <= 6; i++) {
        const navId = 'hony-sidebar-nav-' + i;
        
        if (i === 6) {
            const collapseMenu = document.querySelector('#' + navId + ' .hony-drawer-nav-collapse');
            if (!collapseMenu) {
                console.error('未找到 ' + navId + ' 的 hony-drawer-nav-collapse 元素');
                continue;
            }
            
            const sidebarNav = document.getElementById(navId);
            
            collapseMenu.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                sidebarNav.classList.toggle('collapsed');
                
                const mainContent = document.querySelector('.system-page-main');
                if (mainContent) {
                    mainContent.classList.toggle('collapsed');
                }
                
                const drawerNavRights = document.querySelectorAll('#' + navId + ' .hony-drawer-nav-right');
                drawerNavRights.forEach(right => {
                    right.style.display = 'none';
                });
                
                if (sidebarNav.classList.contains('collapsed')) {
                    sidebarNav.style.width = '56px';
                } else {
                    sidebarNav.style.width = '180px';
                    
                    const activeItem = document.querySelector('#' + navId + ' .hony-drawer-nav-item.active');
                    if (activeItem) {
                        const nextSibling = activeItem.nextElementSibling;
                        if (nextSibling && nextSibling.classList.contains('hony-drawer-nav-right')) {
                            nextSibling.style.display = 'block';
                        }
                    }
                }
            });
            
            initDrawerNav('hony-sidebar-nav-6');
            
            continue;
        }
        
        const collapseMenu = document.querySelector('#' + navId + ' .hony-collapse-menu');
        if (!collapseMenu) {
            console.error('未找到 ' + navId + ' 的 hony-collapse-menu 元素');
            continue;
        }
        
        const sidebarNav = document.getElementById(navId);
        
        function syncMenuTitles() {
            const menuItems = document.querySelectorAll('#' + navId + ' .hony-nav-menu-item');
            menuItems.forEach(item => {
                const headerTitle = item.querySelector('.hony-menu-title');
                const contentTitle = item.querySelector('.hony-nav-menu-title');
                if (headerTitle && contentTitle) {
                    contentTitle.textContent = headerTitle.textContent;
                }
            });
        }
        
        syncMenuTitles();
        
        collapseMenu.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const navMenuContents = document.querySelectorAll('#' + navId + ' .hony-nav-menu-item-content');
                navMenuContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                const navMenuHeaders = document.querySelectorAll('#' + navId + ' .hony-nav-menu-item-header');
                navMenuHeaders.forEach(header => {
                    header.classList.remove('expanded');
                });
                
                sidebarNav.classList.toggle('collapsed');
                
                const mainContent = document.querySelector('.system-page-main');
                if (mainContent) {
                    mainContent.classList.toggle('collapsed');
                }
                
                const icon = collapseMenu.querySelector('.hony-nav-icon');
                const text = collapseMenu.querySelector('span:not(.hony-nav-icon)');
                
                if (sidebarNav.classList.contains('collapsed')) {
                    text.textContent = ' ';
                } else {
                    text.textContent = ' ';
                }
            });
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'characterData' && mutation.target.parentNode.classList.contains('hony-menu-title')) {
                    syncMenuTitles();
                }
            });
        });
        
        const menuTitles = document.querySelectorAll('#' + navId + ' .hony-menu-title');
        menuTitles.forEach(title => {
            observer.observe(title, { characterData: true, subtree: true });
        });
        
        const noSubmenuItems = document.querySelectorAll('#' + navId + ' .hony-nav-menu-item.no-submenu');
        noSubmenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const allMenuItems = document.querySelectorAll('#' + navId + ' .hony-nav-menu-item');
                allMenuItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                });
                
                item.classList.add('active');
            });
        });
    }
}

// 为样式4的二级导航项添加竖线
function addSubitemLines() {
    const nav4Subitems = document.querySelectorAll('#hony-sidebar-nav-4 .hony-nav-menu-subitem');
    nav4Subitems.forEach(subitem => {
        if (!subitem.querySelector('.hony-nav-subitem-line')) {
            const line = document.createElement('div');
            line.className = 'hony-nav-subitem-line';
            
            const text = document.createElement('span');
            text.textContent = subitem.textContent;
            
            subitem.innerHTML = '';
            subitem.appendChild(line);
            subitem.appendChild(text);
        }
    });
}

// 初始化顶部导航
function initTopNav(navId) {
    const topNav = document.getElementById(navId);
    if (!topNav) {
        console.error('未找到' + navId + '元素');
        return;
    }
    
    const topNavItems = topNav.querySelectorAll('.hony-top-nav-item');
    const topNavSubmenuItems = topNav.querySelectorAll('.hony-top-nav-submenu-item');
    
    topNavSubmenuItems.forEach(function(subItem) {
        if (subItem.classList.contains('active')) {
            const topNavSubmenu = subItem.closest('.hony-top-nav-submenu');
            const topNavItem = topNavSubmenu.parentElement;
            if (topNavItem && topNavItem.classList.contains('hony-top-nav-item')) {
                topNavItem.classList.add('active');
            }
        }
    });
    
    topNavItems.forEach(function(item) {
        const hasSubmenu = !item.classList.contains('no-submenu');
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!hasSubmenu) {
                topNavItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active', 'selected');
                });
                
                item.classList.add('selected');
            }
            
            return false;
        });
    });
    
    topNavSubmenuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            topNavSubmenuItems.forEach(function(otherItem) {
                otherItem.classList.remove('active');
            });
            
            item.classList.add('active');
            
            const topNavSubmenu = item.closest('.hony-top-nav-submenu');
            const topNavItem = topNavSubmenu.parentElement;
            if (topNavItem && topNavItem.classList.contains('hony-top-nav-item')) {
                topNavItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active', 'selected');
                });
                topNavItem.classList.add('active');
            }
            
            return false;
        });
    });
}

// 初始化右侧锚点导航滚动高亮
function initAnchorNav() {
    // 所有锚点目标元素
    const sections = [
        { id: 'nav-top-card', navItem: null },
        { id: 'nav-top-theme', navItem: null },
        { id: 'nav-top-light', navItem: null },
        { id: 'nav-top-line', navItem: null },
        { id: 'nav-top-bg', navItem: null },
        { id: 'nav-sidebar-card', navItem: null },
        { id: 'nav-sidebar-theme', navItem: null },
        { id: 'nav-sidebar-light', navItem: null },
        { id: 'nav-sidebar-line', navItem: null },
        { id: 'nav-sidebar-full', navItem: null },
        { id: 'nav-sidebar-drawer', navItem: null }
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

// 初始化导航组件
function initNavigation() {
    for (let i = 1; i <= 7; i++) {
        initSidebarNav('hony-sidebar-nav-' + i);
    }
    
    initCollapseMenu();
    
    addSubitemLines();
    
    initTopNav('hony-top-nav-1');
    initTopNav('hony-top-nav-2');
    initTopNav('hony-top-nav-3');
    initTopNav('hony-top-nav-4');
    initTopNav('hony-top-nav-5');
    
    initAnchorNav();
}

// 如果是首次加载页面，执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    // DOM 已经加载完成，直接初始化
    initNavigation();
}
