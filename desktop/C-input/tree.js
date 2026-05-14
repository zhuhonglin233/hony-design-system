// 树状表 JavaScript
// 包含展开/折叠、选中、单选、多选等功能

// 展开/折叠切换
function toggleExpand(event) {
    event.stopPropagation();
    const el = event.currentTarget;
    el.classList.toggle('expanded');
    const parentNode = el.parentElement;
    const nextSibling = parentNode.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('hony-tree-children')) {
        nextSibling.classList.toggle('expanded');
        nextSibling.classList.toggle('collapsed');
    }
}

// 选中切换（单选模式）
function toggleSelect(event) {
    event.stopPropagation();
    const el = event.currentTarget;
    const tree = el.closest('.hony-tree');
    const allNodes = tree.querySelectorAll('.hony-tree-node');
    allNodes.forEach(node => node.classList.remove('hony-selected'));
    el.classList.add('hony-selected');
}

// 单选切换
function toggleRadio(event) {
    event.stopPropagation();
    const node = event.currentTarget;
    const tree = node.closest('.hony-tree');
    const radios = tree.querySelectorAll('.hony-radio-box');
    radios.forEach(r => r.classList.remove('checked'));
    const radio = node.querySelector('.hony-radio-box');
    if (radio) {
        radio.classList.add('checked');
    }
    tree.querySelectorAll('.hony-tree-node').forEach(n => n.classList.remove('hony-selected'));
    node.classList.add('hony-selected');
}

// 多选切换
function toggleCheckbox(event) {
    event.stopPropagation();
    const node = event.currentTarget;
    const checkbox = node.querySelector('.hony-checkbox-box');
    if (checkbox) {
        checkbox.classList.toggle('checked');
        checkbox.classList.remove('indeterminate');
    }

    const isChecked = checkbox && checkbox.classList.contains('checked');
    
    if (isChecked) {
        node.classList.add('hony-selected');
    } else {
        node.classList.remove('hony-selected');
    }

    // 级联更新所有子节点
    updateChildCheckboxes(node, isChecked);
    
    // 更新父节点
    updateParentCheckbox(node);
}

// 级联更新子节点复选框状态
function updateChildCheckboxes(parentNode, isChecked) {
    const childrenContainer = parentNode.nextElementSibling;
    if (!childrenContainer || !childrenContainer.classList.contains('hony-tree-children')) {
        return;
    }

    const childNodes = childrenContainer.querySelectorAll('.hony-tree-node');
    childNodes.forEach(childNode => {
        const checkbox = childNode.querySelector('.hony-checkbox-box');
        if (checkbox) {
            if (isChecked) {
                checkbox.classList.add('checked');
                checkbox.classList.remove('indeterminate');
                childNode.classList.add('hony-selected');
            } else {
                checkbox.classList.remove('checked', 'indeterminate');
                childNode.classList.remove('hony-selected');
            }
        }
        
        // 递归更新更深层的子节点
        updateChildCheckboxes(childNode, isChecked);
    });
}

// 更新父节点复选框状态
function updateParentCheckbox(node) {
    const parentNode = node.closest('.hony-tree-node');
    const treeChildren = parentNode ? parentNode.closest('.hony-tree-children') : null;
    if (!treeChildren) return;

    const parentNodeElement = treeChildren.previousElementSibling;
    if (!parentNodeElement) return;

    const parentCheckbox = parentNodeElement.querySelector('.hony-checkbox-box');
    if (!parentCheckbox) return;

    const children = treeChildren.querySelectorAll('.hony-checkbox-box');
    const checkedCount = Array.from(children).filter(c => c.classList.contains('checked')).length;

    if (checkedCount === 0) {
        parentCheckbox.classList.remove('checked', 'indeterminate');
        parentNodeElement.classList.remove('hony-selected');
    } else if (checkedCount === children.length) {
        parentCheckbox.classList.add('checked');
        parentCheckbox.classList.remove('indeterminate');
        parentNodeElement.classList.add('hony-selected');
    } else {
        parentCheckbox.classList.add('indeterminate');
        parentCheckbox.classList.remove('checked');
        parentNodeElement.classList.add('hony-selected');
    }

    updateParentCheckbox(parentNodeElement);
}