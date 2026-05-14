// 分页器组件 JavaScript

// 分页器数据配置
const paginationData = {
    total: 30, // 总数据条数
    pageSize: 10 // 每页显示条数
};

function switchPage(pageBtn) {
    const pagination = pageBtn.closest('.hony-pagination');
    const allPages = pagination.querySelectorAll('.hony-pagination-page');
    const currentPage = parseInt(pageBtn.textContent);

    allPages.forEach(page => page.classList.remove('active'));
    pageBtn.classList.add('active');

    updatePageInfo(pagination, currentPage);
    updatePrevNextState(pagination);
    
    // 更新关联的表格内容
    updateTableByPage(pagination, currentPage);
}

function updateTableByPage(pagination, currentPage) {
    console.log('=== updateTableByPage called, currentPage:', currentPage);
    
    // 找到关联的表格容器
    const paginationSection = pagination.closest('.hony-pagination-section');
    console.log('paginationSection:', paginationSection);
    if (!paginationSection) return;
    
    // 找到前面的表格容器
    const tableContainer = paginationSection.previousElementSibling;
    console.log('tableContainer:', tableContainer);
    if (!tableContainer || !tableContainer.classList.contains('hony-table-container')) return;
    
    const table = tableContainer.querySelector('table');
    console.log('table:', table);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    console.log('tbody:', tbody);
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    console.log('rows.length:', rows.length);
    if (rows.length === 0) return;
    
    const size = getPageSize(pagination);
    console.log('pageSize:', size);
    const startIndex = (currentPage - 1) * size;
    const endIndex = startIndex + size;
    console.log('Showing rows', startIndex, 'to', endIndex);
    
    rows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updatePageInfo(pagination, currentPage) {
    const infoElement = pagination.querySelector('.hony-pagination-info');
    if (infoElement) {
        const size = getPageSize(pagination);
        const start = (currentPage - 1) * size + 1;
        const end = Math.min(currentPage * size, paginationData.total);
        infoElement.textContent = `共${paginationData.total}条数据 第${start}-${end}条`;
    }
}

function getPageSize(pagination) {
    const selectorInput = pagination.querySelector('.hony-pagination-selector .hony-input-inner');
    if (selectorInput) {
        const value = selectorInput.value;
        return parseInt(value.replace('条/页', ''));
    }
    return paginationData.pageSize;
}

function generatePageButtons(pagination) {
    const size = getPageSize(pagination);
    const totalPages = Math.ceil(paginationData.total / size);
    const controls = pagination.querySelector('.hony-pagination-controls');
    const prevBtn = controls.querySelector('.hony-pagination-prev');
    const nextBtn = controls.querySelector('.hony-pagination-next');

    const existingPages = controls.querySelectorAll('.hony-pagination-page');
    existingPages.forEach(page => page.remove());

    // 根据表格实际行数计算总页数
    const paginationSection = pagination.closest('.hony-pagination-section');
    let actualTotal = paginationData.total;
    if (paginationSection) {
        const tableContainer = paginationSection.previousElementSibling;
        if (tableContainer && tableContainer.classList.contains('hony-table-container')) {
            const tbody = tableContainer.querySelector('tbody');
            if (tbody) {
                actualTotal = tbody.querySelectorAll('tr').length;
            }
        }
    }
    const newTotalPages = Math.ceil(actualTotal / size);
    paginationData.total = actualTotal;

    for (let i = 1; i <= newTotalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'hony-pagination-btn hony-pagination-page';
        pageBtn.textContent = i;
        if (i === 1) pageBtn.classList.add('active');
        pageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            switchPage(this);
        });
        controls.insertBefore(pageBtn, nextBtn);
    }

    updatePageInfo(pagination, 1);
    updatePrevNextState(pagination);
    
    // 初始化时隐藏超出第一页的行
    updateTableByPage(pagination, 1);
}

function updatePrevNextState(pagination) {
    const size = getPageSize(pagination);
    const totalPages = Math.ceil(paginationData.total / size);
    const activePage = pagination.querySelector('.hony-pagination-page.active');
    const currentPage = activePage ? parseInt(activePage.textContent) : 1;

    const prevBtn = pagination.querySelector('.hony-pagination-prev');
    const nextBtn = pagination.querySelector('.hony-pagination-next');

    if (prevBtn) {
        if (currentPage === 1 || totalPages <= 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
    }

    if (nextBtn) {
        if (currentPage === totalPages || totalPages <= 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
}

function prevPage(pagination) {
    const activePage = pagination.querySelector('.hony-pagination-page.active');
    if (!activePage) return;

    const prevBtn = activePage.previousElementSibling;
    if (prevBtn && prevBtn.classList.contains('hony-pagination-page')) {
        switchPage(prevBtn);
    }
}

function nextPage(pagination) {
    const activePage = pagination.querySelector('.hony-pagination-page.active');
    if (!activePage) return;

    const nextBtn = activePage.nextElementSibling;
    if (nextBtn && nextBtn.classList.contains('hony-pagination-page')) {
        switchPage(nextBtn);
    }
}

function handlePaginationClick(event) {
    const target = event.target;
    const pagination = target.closest('.hony-pagination');
    if (!pagination) return;

    // 检查是否是页码按钮
    if (target.classList && target.classList.contains('hony-pagination-page')) {
        switchPage(target);
        return;
    }
    
    // 检查是否是上一页按钮
    const prevBtn = pagination.querySelector('.hony-pagination-prev');
    if (prevBtn && (prevBtn.contains(target) || target === prevBtn)) {
        if (!prevBtn.classList.contains('disabled')) {
            prevPage(pagination);
        }
        return;
    }
    
    // 检查是否是下一页按钮
    const nextBtn = pagination.querySelector('.hony-pagination-next');
    if (nextBtn && (nextBtn.contains(target) || target === nextBtn)) {
        if (!nextBtn.classList.contains('disabled')) {
            nextPage(pagination);
        }
        return;
    }
}

function handlePageSizeChange(target) {
    let pagination;
    let option;
    
    if (target.classList && target.classList.contains('hony-selector-option')) {
        option = target;
        pagination = option.closest('.hony-pagination');
    } else {
        pagination = target;
        option = pagination.querySelector('.hony-selector-option.hony-selected');
        if (!option) {
            option = pagination.querySelector('.hony-selector-option');
        }
    }

    if (!pagination || !option) return;

    const selector = option.closest('.hony-selector');
    selector.querySelectorAll('.hony-selector-option').forEach(opt => opt.classList.remove('hony-selected'));
    option.classList.add('hony-selected');

    const inputInner = selector.querySelector('.hony-input-inner');
    inputInner.value = option.textContent;

    // 更新全局的pageSize
    paginationData.pageSize = parseInt(option.textContent.replace('条/页', ''));

    generatePageButtons(pagination);

    const firstPage = pagination.querySelector('.hony-pagination-page');
    if (firstPage) {
        pagination.querySelectorAll('.hony-pagination-page').forEach(p => p.classList.remove('active'));
        firstPage.classList.add('active');
    }
}

function initPagination() {
    const paginations = document.querySelectorAll('.hony-pagination');
    console.log('=== initPagination called, found paginations:', paginations.length);

    paginations.forEach(pagination => {
        pagination.addEventListener('click', handlePaginationClick);

        const selectorOptions = pagination.querySelectorAll('.hony-pagination-size .hony-selector-option');
        selectorOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                handlePageSizeChange(this);
            });
        });

        // 获取分页器关联的表格并初始化
        const paginationSection = pagination.closest('.hony-pagination-section');
        if (paginationSection) {
            const tableContainer = paginationSection.previousElementSibling;
            if (tableContainer && tableContainer.classList.contains('hony-table-container')) {
                console.log('Found table container for pagination');
                // 初始化时隐藏超出第一页的行
                updateTableByPage(pagination, 1);
            }
        }

        generatePageButtons(pagination);
    });
}

// 等待common.js加载完成后再初始化
function waitForCommonJS() {
    if (typeof loadComponent === 'function') {
        initPagination();
    } else {
        setTimeout(waitForCommonJS, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 检查common.js是否已经加载
    if (typeof loadComponent === 'function') {
        initPagination();
    } else {
        waitForCommonJS();
    }
});
