// 表格分页由 Pagination.js 统一处理

// 选框表格联动函数
function tableCheckboxToggle(checkboxItem, tableId) {
    if (checkboxItem.classList.contains('disabled')) {
        return;
    }

    const table = checkboxItem.closest('table');
    const headerCheckbox = table.querySelector('thead .hony-checkbox-item');
    const dataCheckboxes = table.querySelectorAll('tbody .hony-checkbox-item');

    const checkboxBox = checkboxItem.querySelector('.hony-checkbox-box');

    // 判断是表头复选框还是数据行复选框
    if (checkboxItem === headerCheckbox) {
        // 点击表头复选框：全选或取消全选
        const isChecked = checkboxBox.classList.contains('checked');

        if (isChecked) {
            // 取消全选
            checkboxBox.classList.remove('checked');
            checkboxBox.classList.remove('indeterminate');
            headerCheckbox.classList.remove('hony-checkboxed');

            dataCheckboxes.forEach(item => {
                const box = item.querySelector('.hony-checkbox-box');
                box.classList.remove('checked');
                box.classList.remove('indeterminate');
                item.classList.remove('hony-checkboxed');
            });
        } else {
            // 全选
            checkboxBox.classList.remove('indeterminate');
            checkboxBox.classList.add('checked');
            headerCheckbox.classList.add('hony-checkboxed');

            dataCheckboxes.forEach(item => {
                const box = item.querySelector('.hony-checkbox-box');
                box.classList.remove('indeterminate');
                box.classList.add('checked');
                item.classList.add('hony-checkboxed');
            });
        }
    } else {
        // 点击数据行复选框：先切换当前复选框状态
        if (checkboxBox.classList.contains('checked')) {
            checkboxBox.classList.remove('checked');
            checkboxItem.classList.remove('hony-checkboxed');
        } else if (checkboxBox.classList.contains('indeterminate')) {
            checkboxBox.classList.remove('indeterminate');
            checkboxBox.classList.add('checked');
            checkboxItem.classList.add('hony-checkboxed');
        } else {
            checkboxBox.classList.add('checked');
            checkboxItem.classList.add('hony-checkboxed');
        }

        // 然后更新表头状态
        const checkedCount = Array.from(dataCheckboxes).filter(item => {
            const box = item.querySelector('.hony-checkbox-box');
            return box.classList.contains('checked');
        }).length;

        const totalCount = dataCheckboxes.length;

        if (checkedCount === 0) {
            // 没有任何选中
            headerCheckbox.querySelector('.hony-checkbox-box').classList.remove('checked');
            headerCheckbox.querySelector('.hony-checkbox-box').classList.remove('indeterminate');
            headerCheckbox.classList.remove('hony-checkboxed');
        } else if (checkedCount === totalCount) {
            // 全部选中
            headerCheckbox.querySelector('.hony-checkbox-box').classList.add('checked');
            headerCheckbox.querySelector('.hony-checkbox-box').classList.remove('indeterminate');
            headerCheckbox.classList.add('hony-checkboxed');
        } else {
            // 部分选中（半选状态）
            headerCheckbox.querySelector('.hony-checkbox-box').classList.remove('checked');
            headerCheckbox.querySelector('.hony-checkbox-box').classList.add('indeterminate');
            headerCheckbox.classList.add('hony-checkboxed');
        }
    }
}

// 树形表格展开/收起函数
function toggleTreeNode(iconElement) {
    const row = iconElement.closest('tr');
    const childrenClass = row.getAttribute('data-children');
    
    if (!childrenClass) return;
    
    const childrenRows = document.querySelectorAll('.hony-' + childrenClass);
    
    if (iconElement.classList.contains('hony-collapsed')) {
        // 展开
        iconElement.classList.remove('hony-collapsed');
        iconElement.src = '../../overall/icons/收起.svg';
        childrenRows.forEach(childRow => {
            childRow.classList.add('hony-expanded');
        });
    } else {
        // 收起
        iconElement.classList.add('hony-collapsed');
        iconElement.src = '../../overall/icons/展开.svg';
        childrenRows.forEach(childRow => {
            childRow.classList.remove('hony-expanded');
            // 递归收起子节点
            const subChildrenClass = childRow.getAttribute('data-children');
            if (subChildrenClass) {
                const subChildrenRows = document.querySelectorAll('.hony-' + subChildrenClass);
                subChildrenRows.forEach(subChild => {
                    subChild.classList.remove('hony-expanded');
                    const subIcon = subChild.querySelector('.hony-table-tree-icon');
                    if (subIcon) {
                        subIcon.classList.add('hony-collapsed');
                        subIcon.src = '../../overall/icons/展开.svg';
                    }
                });
            }
        });
    }
}