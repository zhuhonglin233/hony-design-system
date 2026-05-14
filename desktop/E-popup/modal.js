// 弹窗组件相关函数

function openModal(modalId) {
    let modalMask = document.getElementById(modalId);
    if (!modalMask) {
        modalMask = document.getElementById('hony-' + modalId);
    }
    if (modalMask) {
        modalMask.classList.add('hony-visible');
        document.body.style.overflow = 'hidden';
        
        // 添加滚动检测
        const modal = modalMask.querySelector('.hony-modal');
        if (modal) {
            const body = modal.querySelector('.hony-modal-body');
            const header = modal.querySelector('.hony-modal-header');
            const footer = modal.querySelector('.hony-modal-footer');
            
            if (body && header && footer) {
                // 初始检查是否需要显示分割线
                updateScrollDividers(body, header, footer);
                
                // 添加滚动事件监听器
                body.addEventListener('scroll', function() {
                    updateScrollDividers(body, header, footer);
                });
            }
        }
    }
}

function updateScrollDividers(body, header, footer) {
    if (body.scrollTop > 0) {
        header.classList.add('has-scroll');
    } else {
        header.classList.remove('has-scroll');
    }
    
    if (body.scrollHeight - body.scrollTop > body.clientHeight + 1) {
        footer.classList.add('has-scroll');
    } else {
        footer.classList.remove('has-scroll');
    }
}

function closeModal(modalId) {
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.getElementById('hony-' + modalId);
    }
    if (modal) {
        modal.classList.remove('hony-visible');
        document.body.style.overflow = '';
    }
}

// ESC键关闭弹窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.hony-modal-mask');
        openModals.forEach(modal => {
            modal.classList.remove('hony-visible');
        });
        document.body.style.overflow = '';
    }
});

// 初始化弹窗组件
function initModal() {
    // 点击遮罩层关闭弹窗
    document.querySelectorAll('.hony-modal-mask').forEach(mask => {
        // 防止重复绑定
        if (mask.dataset.modalInitialized === 'true') return;
        mask.dataset.modalInitialized = 'true';
        
        mask.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('hony-visible');
                document.body.style.overflow = '';
            }
        });
    });
    
    // 点击遮罩层关闭抽屉
    document.querySelectorAll('.hony-drawer-mask').forEach(mask => {
        // 防止重复绑定
        if (mask.dataset.drawerInitialized === 'true') return;
        mask.dataset.drawerInitialized = 'true';
        
        mask.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('hony-visible');
                document.body.style.overflow = '';
            }
        });
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initModal();
});

// 打开抽屉
function openDrawer(id) {
    const drawer = document.getElementById(id);
    drawer.classList.add('hony-visible');
    document.body.style.overflow = 'hidden';
}

// 关闭抽屉
function closeDrawer(id) {
    const drawer = document.getElementById(id);
    drawer.classList.remove('hony-visible');
    document.body.style.overflow = '';
}

// 滚动到指定章节
function scrollToSection(title) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.querySelector('h2')?.textContent === title) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});