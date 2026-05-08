// 输入框组件相关函数

// 初始化输入框组件
function initInputComponent() {
    // 拓展输入框点击区域聚焦功能
    const inputExpands = document.querySelectorAll('.hony-input-expand');
    inputExpands.forEach(expand => {
        expand.addEventListener('click', function(e) {
            e.stopPropagation();
            const inputInner = this.querySelector('.hony-input-inner');
            if (inputInner) {
                inputInner.focus();
            }
        });
    });

    // 密码可见性切换
    const passwordToggles = document.querySelectorAll('.hony-password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? '\uf082' : '\uf083';
        });
    });

    // 数字输入框增减功能
    const numberInputs = document.querySelectorAll('.hony-input-number');
    numberInputs.forEach(container => {
        const input = container.querySelector('input');
        const upButton = container.querySelector('.hony-input-number-up');
        const downButton = container.querySelector('.hony-input-number-down');

        if (upButton) {
            upButton.addEventListener('click', function() {
                input.value = parseInt(input.value) + 1;
            });
        }

        if (downButton) {
            downButton.addEventListener('click', function() {
                if (parseInt(input.value) > 0) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        }
    });

    // 标签输入框功能
    const tagInputs = document.querySelectorAll('.hony-input-tag input');
    tagInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                const tagText = this.value.trim();
                const tagElement = document.createElement('span');
                tagElement.className = 'hony-input-tag-item';
                
                const tagTextNode = document.createTextNode(tagText);
                tagElement.appendChild(tagTextNode);
                
                const deleteButton = document.createElement('span');
                deleteButton.className = 'hony-tab-close';
                deleteButton.innerHTML = '&#xf062;';
                deleteButton.addEventListener('click', function() {
                    tagElement.remove();
                });
                
                tagElement.appendChild(deleteButton);
                this.parentElement.insertBefore(tagElement, this);
                this.value = '';
            }
        });
    });
    
    // 分割式验证码输入框自动跳转
    const verificationInputs = document.querySelectorAll('.hony-verification-input');
    const verificationBoxes = document.querySelectorAll('.hony-verification-box');
    
    verificationInputs.forEach((input, index) => {
        input.addEventListener('focus', function() {
            verificationBoxes.forEach(box => box.classList.remove('selected'));
            this.parentElement.classList.add('selected');
        });
        
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 1 && index < verificationInputs.length - 1) {
                verificationInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                verificationInputs[index - 1].focus();
            }
        });
    });

    // 移除标签函数
    window.removeTag = function(button) {
        const tagElement = button.parentElement;
        tagElement.remove();
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initInputComponent();
});
