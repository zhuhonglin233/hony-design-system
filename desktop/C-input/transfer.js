// 穿梭框 JavaScript
// 包含列表穿梭框和树状穿梭框的操作函数

// 获取元素所在的穿梭框容器
function getTransferContainer(el) {
    return el.closest('.hony-transfer');
}

// 列表穿梭框操作
function toggleItem(el) {
    el.classList.toggle('checked');
    const item = el.closest('.hony-transfer-item');
    item.classList.toggle('hony-selected');
    
    const transferEl = getTransferContainer(el);
    updateCount(transferEl);
    
    // 更新全选复选框状态
    const panel = el.closest('.hony-left-panel') ? 'left' : 'right';
    updateHeaderCheckbox(el, panel);
}

function toggleItemByCard(card) {
    const checkbox = card.querySelector(".hony-checkbox-box");
    checkbox.classList.toggle("checked");
    card.classList.toggle("hony-selected");
    
    const transferEl = getTransferContainer(card);
    updateCount(transferEl);
    
    // 更新全选复选框状态
    const panel = card.closest('.hony-left-panel') ? 'left' : 'right';
    updateHeaderCheckbox(card, panel);
}

function toggleAllCheckbox(el, panel) {
    const transferEl = getTransferContainer(el);
    const panelEl = transferEl.querySelector(`.hony-transfer-panel.hony-${panel}-panel`);
    const checkboxes = panelEl.querySelectorAll('.hony-checkbox-box');
    const headerCheckbox = checkboxes[0];
    
    // 获取所有子复选框（排除header checkbox）
    const childCheckboxes = Array.from(checkboxes).slice(1);
    const checkedCount = childCheckboxes.filter(cb => cb.classList.contains('checked')).length;
    
    // 判断当前状态：全选、半选、全不选
    if (checkedCount === 0) {
        // 当前全不选，点击后全选
        childCheckboxes.forEach(cb => {
            cb.classList.add('checked');
            cb.classList.remove('indeterminate');
            cb.closest('.hony-transfer-item').classList.add('hony-selected');
        });
        headerCheckbox.classList.add('checked');
        headerCheckbox.classList.remove('indeterminate');
    } else if (checkedCount === childCheckboxes.length) {
        // 当前全选，点击后全不选
        childCheckboxes.forEach(cb => {
            cb.classList.remove('checked', 'indeterminate');
            cb.closest('.hony-transfer-item').classList.remove('hony-selected');
        });
        headerCheckbox.classList.remove('checked', 'indeterminate');
    } else {
        // 当前半选，点击后全选
        childCheckboxes.forEach(cb => {
            cb.classList.add('checked');
            cb.classList.remove('indeterminate');
            cb.closest('.hony-transfer-item').classList.add('hony-selected');
        });
        headerCheckbox.classList.add('checked');
        headerCheckbox.classList.remove('indeterminate');
    }
    
    updateCount(transferEl);
}

// 更新全选复选框的状态（根据子复选框的状态）
function updateHeaderCheckbox(el, panel) {
    const transferEl = getTransferContainer(el);
    const panelEl = transferEl.querySelector(`.hony-transfer-panel.hony-${panel}-panel`);
    const checkboxes = panelEl.querySelectorAll('.hony-checkbox-box');
    const headerCheckbox = checkboxes[0];
    
    // 获取所有子复选框（排除header checkbox）
    const childCheckboxes = Array.from(checkboxes).slice(1);
    const checkedCount = childCheckboxes.filter(cb => cb.classList.contains('checked')).length;
    
    if (checkedCount === 0) {
        headerCheckbox.classList.remove('checked', 'indeterminate');
    } else if (checkedCount === childCheckboxes.length) {
        headerCheckbox.classList.add('checked');
        headerCheckbox.classList.remove('indeterminate');
    } else {
        headerCheckbox.classList.remove('checked');
        headerCheckbox.classList.add('indeterminate');
    }
}

function deleteItem(el) {
    const transferEl = getTransferContainer(el);
    const item = el.closest('.hony-transfer-item');
    
    // 将删除的项移回左边面板
    const leftPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-left-panel');
    const rightPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-right-panel');
    
    // 只有在右边面板的项才能被"删除"（移回左边）
    if (item.closest('.hony-transfer-panel.hony-right-panel')) {
        item.classList.remove('hony-selected');
        const checkbox = item.querySelector('.hony-checkbox-box');
        if (checkbox) {
            checkbox.classList.remove('checked');
        }
        leftPanel.querySelector('.hony-transfer-list').appendChild(item);
        updateCount(transferEl);
    }
}

function updateCount(transferEl) {
    const leftPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-left-panel');
    const rightPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-right-panel');
    const leftCount = leftPanel.querySelectorAll('.hony-transfer-item.hony-selected').length;
    const rightCount = rightPanel.querySelectorAll('.hony-transfer-item.hony-selected').length;
    
    const leftCountEl = leftPanel.querySelector('.hony-transfer-count span');
    const rightCountEl = rightPanel.querySelector('.hony-transfer-count span');
    if (leftCountEl) leftCountEl.textContent = leftCount;
    if (rightCountEl) rightCountEl.textContent = rightCount;
}

function transferLeft(el) {
    const transferEl = getTransferContainer(el);
    const rightPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-right-panel');
    const leftPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-left-panel');
    const selectedItems = rightPanel.querySelectorAll('.hony-transfer-item.hony-selected');
    
    selectedItems.forEach(item => {
        item.classList.remove('hony-selected');
        item.querySelector('.hony-checkbox-box').classList.remove('checked');
        leftPanel.querySelector('.hony-transfer-list').appendChild(item);
    });
    
    updateCount(transferEl);
}

function transferRight(el) {
    const transferEl = getTransferContainer(el);
    const leftPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-left-panel');
    const rightPanel = transferEl.querySelector('.hony-transfer-panel.hony-transfer-panel.hony-right-panel');
    const selectedItems = leftPanel.querySelectorAll('.hony-transfer-item.hony-selected');
    
    selectedItems.forEach(item => {
        item.classList.remove('hony-selected');
        item.querySelector('.hony-checkbox-box').classList.remove('checked');
        rightPanel.querySelector('.hony-transfer-list').appendChild(item);
    });
    
    updateCount(transferEl);
}

// 树状穿梭框操作
function toggleExpand(event) {
    event.stopPropagation();
    const icon = event.currentTarget;
    const node = icon.closest('.hony-tree-node');
    const children = node.nextElementSibling;
    
    if (children && children.classList.contains('hony-tree-children')) {
        children.classList.toggle('expanded');
        children.classList.toggle('collapsed');
        icon.classList.toggle('expanded');
    }
}

function toggleCheckbox(event) {
    event.stopPropagation();
    let checkbox = event.target;
    
    // 如果点击的不是checkbox，查找最近的checkbox
    if (!checkbox.classList.contains('hony-checkbox-box')) {
        checkbox = event.target.closest('.hony-tree-node').querySelector('.hony-checkbox-box');
    }
    
    if (!checkbox) return;
    
    const node = checkbox.closest('.hony-tree-node');
    const isChecked = checkbox.classList.toggle('checked');
    checkbox.classList.remove('indeterminate');
    
    node.classList.toggle('hony-selected', isChecked);
    
    updateParentCheckbox(node);
    updateChildCheckboxes(node, isChecked);
}

function updateParentCheckbox(node) {
    const parentChildren = node.parentElement;
    if (!parentChildren || !parentChildren.classList.contains('hony-tree-children')) return;
    
    const parentNode = parentChildren.previousElementSibling;
    if (!parentNode || !parentNode.classList.contains('hony-tree-node')) return;
    
    const parentCheckbox = parentNode.querySelector('.hony-checkbox-box');
    const children = parentChildren.querySelectorAll('.hony-tree-node');
    const checkedCount = Array.from(children).filter(child => 
        child.querySelector('.hony-checkbox-box').classList.contains('checked')
    ).length;
    
    if (checkedCount === 0) {
        parentCheckbox.classList.remove('checked', 'indeterminate');
        parentNode.classList.remove('hony-selected');
    } else if (checkedCount === children.length) {
        parentCheckbox.classList.add('checked');
        parentCheckbox.classList.remove('indeterminate');
        parentNode.classList.add('hony-selected');
    } else {
        parentCheckbox.classList.remove('checked');
        parentCheckbox.classList.add('indeterminate');
        parentNode.classList.add('hony-selected');
    }
    
    updateParentCheckbox(parentNode);
}

function updateChildCheckboxes(node, isChecked) {
    const childrenContainer = node.nextElementSibling;
    if (!childrenContainer || !childrenContainer.classList.contains('hony-tree-children')) return;
    
    const childNodes = childrenContainer.querySelectorAll('.hony-tree-node');
    childNodes.forEach(child => {
        const checkbox = child.querySelector('.hony-checkbox-box');
        checkbox.classList.toggle('checked', isChecked);
        checkbox.classList.remove('indeterminate');
        child.classList.toggle('hony-selected', isChecked);
        updateChildCheckboxes(child, isChecked);
    });
}

function toggleSelect(event) {
    event.stopPropagation();
    const node = event.target.closest('.hony-tree-node');
    if (!node) return;
    
    const checkbox = node.querySelector('.hony-checkbox-box');
    checkbox.click();
}

function toggleTreeAllCheckbox(el) {
    const tree = el.closest('.hony-transfer-panel').querySelector('.hony-tree');
    const checkboxes = tree.querySelectorAll('.hony-checkbox-box');
    const headerCheckbox = el;
    const firstChecked = checkboxes[0] && checkboxes[0].classList.contains('checked');
    
    checkboxes.forEach(cb => {
        if (firstChecked) {
            cb.classList.remove('checked', 'indeterminate');
            cb.closest('.hony-tree-node').classList.remove('hony-selected');
        } else {
            cb.classList.add('checked');
            cb.classList.remove('indeterminate');
            cb.closest('.hony-tree-node').classList.add('hony-selected');
        }
    });
    
    headerCheckbox.classList.toggle('checked', !firstChecked);
}

function transferTreeLeft(el) {
    const transferEl = getTransferContainer(el);
    const rightPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(3)');
    const leftPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(1)');
    const rightTree = rightPanel.querySelector('.hony-tree');
    const leftTree = leftPanel.querySelector('.hony-tree');
    
    const selectedNodes = rightTree.querySelectorAll('.hony-tree-node.hony-selected');
    
    selectedNodes.forEach(node => {
        node.classList.remove('hony-selected');
        const checkbox = node.querySelector('.hony-checkbox-box');
        if (checkbox) {
            checkbox.classList.remove('checked', 'indeterminate');
        }
        leftTree.appendChild(node);
    });
}

function transferTreeRight(el) {
    const transferEl = getTransferContainer(el);
    const leftPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(1)');
    const rightPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(3)');
    const leftTree = leftPanel.querySelector('.hony-tree');
    const rightTree = rightPanel.querySelector('.hony-tree');
    
    const selectedNodes = leftTree.querySelectorAll('.hony-tree-node.hony-selected');
    
    selectedNodes.forEach(node => {
        node.classList.remove('hony-selected');
        const checkbox = node.querySelector('.hony-checkbox-box');
        if (checkbox) {
            checkbox.classList.remove('checked', 'indeterminate');
        }
        rightTree.appendChild(node);
    });
}