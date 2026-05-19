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
    
    // 获取所有完全选中的节点（只转移checked的，不转移indeterminate的）
    const checkboxes = rightTree.querySelectorAll('.hony-checkbox-box.checked');
    const selectedNodes = Array.from(checkboxes).map(cb => cb.closest('.hony-tree-node')).filter(Boolean);
    
    selectedNodes.forEach(node => {
        node.classList.remove('hony-selected');
        const checkbox = node.querySelector('.hony-checkbox-box');
        if (checkbox) {
            checkbox.classList.remove('checked', 'indeterminate');
        }
        
        // 移动节点到左侧
        leftTree.appendChild(node);
        
        // 检查是否有子节点容器需要一起移动
        const childrenContainer = node.nextElementSibling;
        if (childrenContainer && childrenContainer.classList.contains('hony-tree-children')) {
            leftTree.appendChild(childrenContainer);
        }
    });
    
    // 更新右侧剩余节点的复选框状态
    updateAllParentCheckboxes(rightTree);
}

function transferTreeRight(el) {
    const transferEl = getTransferContainer(el);
    const leftPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(1)');
    const rightPanel = transferEl.querySelector('.hony-transfer-panel:nth-child(3)');
    const leftTree = leftPanel.querySelector('.hony-tree');
    const rightTree = rightPanel.querySelector('.hony-tree');
    
    // 获取所有完全选中的节点（只转移checked的，不转移indeterminate的）
    const checkboxes = leftTree.querySelectorAll('.hony-checkbox-box.checked');
    const selectedNodes = Array.from(checkboxes).map(cb => cb.closest('.hony-tree-node')).filter(Boolean);
    
    selectedNodes.forEach(node => {
        node.classList.remove('hony-selected');
        const checkbox = node.querySelector('.hony-checkbox-box');
        if (checkbox) {
            checkbox.classList.remove('checked', 'indeterminate');
        }
        
        // 获取节点的层级路径（从根到当前节点）
        const path = getNodePath(node);
        
        // 在右侧树中找到或创建对应的父容器
        let parentContainer = rightTree;
        for (let i = 0; i < path.length - 1; i++) {
            const ancestorNode = path[i];
            parentContainer = findOrCreateParentNode(parentContainer, ancestorNode);
        }
        
        // 将节点移动到正确的位置
        parentContainer.appendChild(node);
        
        // 检查是否有子节点容器需要一起移动
        const childrenContainer = node.nextElementSibling;
        if (childrenContainer && childrenContainer.classList.contains('hony-tree-children')) {
            parentContainer.appendChild(childrenContainer);
        }
    });
    
    // 更新左侧剩余节点的复选框状态
    updateAllParentCheckboxes(leftTree);
}

// 获取节点从根到自身的路径
function getNodePath(node) {
    const path = [];
    let current = node;
    
    // 向上遍历直到树的根节点
    while (current && current.classList.contains('hony-tree-node')) {
        path.unshift(current);
        // 找到父节点（通过查找父级的hony-tree-children）
        let parent = current.parentElement;
        while (parent && !parent.classList.contains('hony-tree') && !parent.classList.contains('hony-tree-children')) {
            parent = parent.parentElement;
        }
        if (parent && parent.classList.contains('hony-tree-children')) {
            current = parent.previousElementSibling;
        } else {
            current = null;
        }
    }
    
    return path;
}

// 在目标容器中查找或创建父节点
function findOrCreateParentNode(container, templateNode) {
    const nodeText = templateNode.querySelector('.hony-tree-title')?.textContent.trim() || '';
    
    // 检查容器中是否已有同名节点（手动遍历查找）
    const allNodes = container.querySelectorAll('.hony-tree-node');
    let existingNode = null;
    for (let i = 0; i < allNodes.length; i++) {
        const title = allNodes[i].querySelector('.hony-tree-title')?.textContent.trim() || '';
        if (title === nodeText) {
            existingNode = allNodes[i];
            break;
        }
    }
    
    if (existingNode) {
        // 检查是否已有子节点容器
        let childrenContainer = existingNode.nextElementSibling;
        if (!childrenContainer || !childrenContainer.classList.contains('hony-tree-children')) {
            // 创建子节点容器
            childrenContainer = document.createElement('div');
            childrenContainer.className = 'hony-tree-children';
            existingNode.parentElement.insertBefore(childrenContainer, existingNode.nextSibling);
        }
        return childrenContainer;
    }
    
    // 创建新的父节点
    const newNode = templateNode.cloneNode(true);
    // 移除选中状态
    newNode.classList.remove('hony-selected');
    const newCheckbox = newNode.querySelector('.hony-checkbox-box');
    if (newCheckbox) {
        newCheckbox.classList.remove('checked', 'indeterminate');
    }
    
    // 创建子节点容器
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'hony-tree-children';
    
    // 添加到容器
    container.appendChild(newNode);
    container.appendChild(childrenContainer);
    
    return childrenContainer;
}

// 递归更新所有父节点的复选框状态
function updateAllParentCheckboxes(tree) {
    const nodes = tree.querySelectorAll('.hony-tree-node');
    nodes.forEach(node => {
        const checkbox = node.querySelector('.hony-checkbox-box');
        if (checkbox) {
            const childrenContainer = node.nextElementSibling;
            if (childrenContainer && childrenContainer.classList.contains('hony-tree-children')) {
                const children = childrenContainer.querySelectorAll('.hony-tree-node');
                const checkedCount = Array.from(children).filter(child => 
                    child.querySelector('.hony-checkbox-box').classList.contains('checked')
                ).length;
                
                if (checkedCount === 0) {
                    checkbox.classList.remove('checked', 'indeterminate');
                    node.classList.remove('hony-selected');
                } else if (checkedCount === children.length) {
                    checkbox.classList.add('checked');
                    checkbox.classList.remove('indeterminate');
                    node.classList.add('hony-selected');
                } else {
                    checkbox.classList.remove('checked');
                    checkbox.classList.add('indeterminate');
                    node.classList.add('hony-selected');
                }
            }
        }
    });
}