// 评论组件交互脚本

// 字数统计
function initWordCount() {
    const textareas = document.querySelectorAll('.hony-comment-textarea');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 200;
        const wrapper = textarea.closest('.hony-comment-input-area');
        const wordCountEl = wrapper.querySelector('.hony-comment-word-count');
        
        const updateCount = () => {
            const count = textarea.value.length;
            if (wordCountEl) {
                wordCountEl.textContent = `${count}/${maxLength}`;
            }
        };
        
        // 初始化
        updateCount();
        
        // 监听输入
        textarea.addEventListener('input', updateCount);
    });
}

// 点赞功能
function initLikeAction() {
    const likeActions = document.querySelectorAll('.article-action, .comment-action, .reply-action');
    
    likeActions.forEach(action => {
        action.addEventListener('click', function(e) {
            // 只处理点赞按钮
            if (this.textContent.includes('👍')) {
                e.stopPropagation();
                
                // 切换点赞状态
                this.classList.toggle('liked');
                
                // 更新点赞数
                const likeText = this.querySelector('.article-action-text') || 
                                this.querySelector('span:last-child');
                
                if (likeText) {
                    let count = parseInt(likeText.textContent) || 0;
                    if (this.classList.contains('liked')) {
                        count++;
                    } else {
                        count--;
                    }
                    likeText.textContent = count.toString();
                }
            }
        });
    });
}

// 回复功能
function initReplyAction() {
    const replyActions = document.querySelectorAll('.comment-action, .reply-action');
    
    replyActions.forEach(action => {
        action.addEventListener('click', function(e) {
            if (this.textContent.includes('回复')) {
                e.stopPropagation();
                
                // 找到最近的评论卡片
                const card = this.closest('.comment-card, .reply-card');
                const inputWrapper = card.querySelector('.hony-comment-input-wrapper');
                
                if (!inputWrapper) {
                    // 创建回复输入框
                    const replyInput = createReplyInput();
                    const contentArea = card.querySelector('.comment-content, .reply-content');
                    contentArea.appendChild(replyInput);
                }
            }
        });
    });
}

// 创建回复输入框
function createReplyInput() {
    const wrapper = document.createElement('div');
    wrapper.className = 'comment-input-wrapper';
    wrapper.innerHTML = `
        <div class="comment-input-area reply-input">
            <textarea 
                class="comment-textarea" 
                placeholder="写下你的回复..."
                maxlength="200"
            ></textarea>
            <div class="comment-input-footer">
                <span class="comment-word-count">0/200</span>
                <div class="comment-input-actions">
                    <button class="btn btn-outline-grey btn-sm" onclick="cancelReply(this)">取消</button>
                    <button class="btn btn-primary btn-sm" onclick="submitReply(this)">回复</button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化字数统计
    const textarea = wrapper.querySelector('.hony-comment-textarea');
    const wordCountEl = wrapper.querySelector('.hony-comment-word-count');
    const maxLength = 200;
    
    textarea.addEventListener('input', () => {
        wordCountEl.textContent = `${textarea.value.length}/${maxLength}`;
    });
    
    return wrapper;
}

// 取消回复
function cancelReply(btn) {
    const inputWrapper = btn.closest('.hony-comment-input-wrapper');
    if (inputWrapper) {
        inputWrapper.remove();
    }
}

// 提交回复
function submitReply(btn) {
    const inputWrapper = btn.closest('.hony-comment-input-wrapper');
    const textarea = inputWrapper.querySelector('.hony-comment-textarea');
    const content = textarea.value.trim();
    
    if (content) {
        // 模拟提交
        alert(`回复内容：${content}`);
        cancelReply(btn);
    }
}

// 发布评论
function initSubmitComment() {
    const submitButtons = document.querySelectorAll('.comment-input-actions .btn-primary');
    
    submitButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = this.closest('.hony-comment-input-wrapper');
            const textarea = wrapper.querySelector('.hony-comment-textarea');
            const content = textarea.value.trim();
            
            if (content) {
                // 模拟发布
                alert(`发布评论：${content}`);
                textarea.value = '';
                
                // 更新字数统计
                const wordCountEl = wrapper.querySelector('.hony-comment-word-count');
                if (wordCountEl) {
                    wordCountEl.textContent = '0/200';
                }
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initWordCount();
    initLikeAction();
    initReplyAction();
    initSubmitComment();
});
