// 页面加载完成后执行所有代码
document.addEventListener('DOMContentLoaded', function() {

    // 删除上传项
    window.deleteUploadItem = function(btn) {
        const item = btn.closest('.hony-upload-item');
        if (item) {
            item.remove();
        }
    };

    // 删除批量上传行
    window.deleteBatchRow = function(element) {
        const row = element.closest('.hony-upload-batch-table-row');
        if (row) {
            row.remove();
            // 检查是否还有行
            const remainingRows = batchBody.querySelectorAll('.hony-upload-batch-table-row');
            if (remainingRows.length === 0) {
                batchBody.innerHTML = '<span class="hony-upload-batch-empty" id="hony-upload-batch-empty">上传文件</span>';
                document.getElementById('hony-upload-batch-empty').addEventListener('click', openFileSelector);
            }
        }
    };

    // 基础上传
    const basicBtn = document.getElementById('hony-upload-basic-btn');
    const basicInput = document.getElementById('hony-upload-basic-input');
    const basicContainer = document.getElementById('hony-upload-basic-container');

    if (basicBtn && basicInput && basicContainer) {
        basicBtn.addEventListener('click', function() {
            basicInput.click();
        });

        basicInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                handleFiles(files, basicContainer);
            }
        });
    }

    // 批量上传
    const batchBtn = document.getElementById('hony-upload-batch-btn');
    const batchInput = document.getElementById('hony-upload-batch-input');
    const batchEmpty = document.getElementById('hony-upload-batch-empty');
    const batchBody = document.getElementById('hony-upload-batch-body');
    const batchCancel = document.getElementById('hony-upload-batch-cancel');
    const batchConfirm = document.getElementById('hony-upload-batch-confirm');

    // 点击按钮或空白区域打开文件选择
    const openFileSelector = function() {
        batchInput.click();
    };

    if (batchBtn) batchBtn.addEventListener('click', openFileSelector);
    if (batchEmpty) batchEmpty.addEventListener('click', openFileSelector);

    // 处理文件选择
    if (batchInput) {
        batchInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                handleBatchFiles(files);
            }
        });
    }

    // 取消上传
    if (batchCancel) {
        batchCancel.addEventListener('click', function() {
            batchBody.innerHTML = '<span class="upload-batch-empty" id="upload-batch-empty">上传文件</span>';
            document.getElementById('upload-batch-empty').addEventListener('click', openFileSelector);
        });
    }

    // 确定上传
    if (batchConfirm) {
        batchConfirm.addEventListener('click', function() {
            const rows = batchBody.querySelectorAll('.hony-upload-batch-table-row');
            rows.forEach(row => {
                const status = row.querySelector('.hony-upload-batch-status');
                if (status && status.classList.contains('hony-selected')) {
                    // 开始上传
                    row.classList.add('hony-selected');
                    startBatchUpload(row);
                }
            });
        });
    }

    // 处理批量上传文件
    function handleBatchFiles(files) {
        // 隐藏空状态
        if (batchEmpty) {
            batchEmpty.remove();
        }

        Array.from(files).forEach(file => {
            // 检查是否已存在相同文件名
            const existingRows = batchBody.querySelectorAll('.hony-upload-batch-table-row');
            const exists = Array.from(existingRows).some(row => 
                row.querySelector('.hony-upload-batch-col-name').textContent === file.name
            );
            
            if (!exists) {
                const row = createBatchUploadRow(file);
                batchBody.appendChild(row);
            }
        });
    }

    // 创建批量上传行
    function createBatchUploadRow(file) {
        const row = document.createElement('div');
        row.className = 'hony-upload-batch-table-row';
        row.innerHTML = `
            <div class="hony-upload-batch-col hony-upload-batch-col-name">${file.name}</div>
            <div class="hony-upload-batch-col hony-upload-batch-col-size">${formatFileSize(file.size)}</div>
            <div class="hony-upload-batch-col hony-upload-batch-col-status">
                <div class="hony-upload-batch-status hony-selected">
                    <div class="hony-upload-batch-status-icon">
                        <span class="iconfont icon-circle-dot"></span>
                    </div>
                    <span class="hony-upload-batch-status-text">待上传</span>
                </div>
            </div>
            <div class="hony-upload-batch-col hony-upload-batch-col-action">
                <span class="hony-upload-batch-delete" onclick="deleteBatchRow(this)">删除</span>
            </div>
        `;
        return row;
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + 'B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB';
        return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
    }

    // 开始批量上传
    function startBatchUpload(row) {
        const status = row.querySelector('.hony-upload-batch-status');
        status.className = 'hony-upload-batch-status';
        status.innerHTML = `
            <div class="hony-upload-batch-status-icon">
                <span class="iconfont icon-jiazai"></span>
            </div>
            <span class="hony-upload-batch-status-text">上传0%</span>
        `;

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // 模拟上传结果
                setTimeout(() => {
                    if (Math.random() > 0.3) {
                        status.className = 'hony-upload-batch-status';
                        status.innerHTML = `
                            <div class="hony-upload-batch-status-icon">
                                <span class="iconfont icon-zhengque"></span>
                            </div>
                            <span class="hony-upload-batch-status-text">上传完成</span>
                        `;
                    } else {
                        status.className = 'hony-upload-batch-status';
                        status.innerHTML = `
                            <div class="hony-upload-batch-status-icon">
                                <span class="iconfont icon-cuowu"></span>
                            </div>
                            <span class="hony-upload-batch-status-text">上传失败</span>
                        `;
                    }
                }, 300);
            }
            status.querySelector('.hony-upload-batch-status-text').textContent = `上传${Math.round(progress)}%`;
        }, 200);
    }

    // 拖拽上传
    const dragger = document.getElementById('hony-upload-dragger');
    const dragInput = document.getElementById('hony-upload-drag-input');

    if (dragger) {
        dragger.addEventListener('click', function() {
            dragInput.click();
        });

        dragger.addEventListener('dragover', function(e) {
            e.preventDefault();
            dragger.classList.add('hony-is-drag-over');
        });

        dragger.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dragger.classList.remove('hony-is-drag-over');
        });

        dragger.addEventListener('drop', function(e) {
            e.preventDefault();
            dragger.classList.remove('hony-is-drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files, dragger.parentElement);
            }
        });
    }

    if (dragInput) {
        dragInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                handleFiles(files, dragger.parentElement);
            }
        });
    }

    // 图片上传
    const imageItem = document.getElementById('hony-upload-image-item');
    const imageInput = document.getElementById('hony-upload-image-input');

    if (imageItem && imageInput) {
        imageItem.addEventListener('click', function() {
            imageInput.click();
        });

        imageInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                handleImageFiles(files);
            }
        });
    }

    // 为示例图片添加删除和查看功能
    function initImagePreviewDelete() {
        const previews = document.querySelectorAll('.hony-upload-image-preview');
        previews.forEach(preview => {
            const deleteBtn = preview.querySelector('.icon-lajitong');
            const viewBtn = preview.querySelector('.iconfont');
            const img = preview.querySelector('img');
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    preview.remove();
                });
            }
            
            if (viewBtn && img) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openImagePreview(img.src);
                });
            }
        });
    }

    // 打开图片预览弹出层
    function openImagePreview(src) {
        openImagePopup(src);
    }

    // 页面加载完成后初始化示例图片功能
    initImagePreviewDelete();

    // 处理文件上传
    function handleFiles(files, container) {
        let uploadList = container.querySelector('.hony-upload-list');
        if (!uploadList) {
            uploadList = document.createElement('div');
            uploadList.className = 'hony-upload-list';
            container.appendChild(uploadList);
        }

        Array.from(files).forEach(file => {
            const item = createUploadItem(file.name, 'loading');
            uploadList.appendChild(item);

            // 获取进度条元素
            const progressBar = item.querySelector('.hony-upload-item-progress-inner');
            const progressText = item.querySelector('.hony-upload-item-progress-text');
            
            // 模拟上传进度
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                }
                progressBar.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
            }, 200);

            setTimeout(() => {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                progressText.textContent = '100%';
                
                if (Math.random() > 0.3) {
                    item.querySelector('.hony-upload-item-loading')?.remove();
                    item.querySelector('.hony-upload-item-progress')?.remove();
                    const success = document.createElement('div');
                    success.className = 'hony-upload-item-success';
                    success.innerHTML = '<span class="iconfont icon-zhengque"></span>';
                    item.appendChild(success);
                    
                    const deleteBtn = document.createElement('div');
                    deleteBtn.className = 'hony-upload-item-delete';
                    deleteBtn.innerHTML = '<span class="iconfont icon-lajitong"></span>';
                    deleteBtn.onclick = function() { deleteUploadItem(this); };
                    item.appendChild(deleteBtn);
                } else {
                    item.querySelector('.hony-upload-item-loading')?.remove();
                    item.querySelector('.hony-upload-item-progress')?.remove();
                    item.querySelector('.hony-upload-item-name').classList.add('error');
                    const error = document.createElement('div');
                    error.className = 'hony-upload-item-error';
                    error.innerHTML = '<span class="iconfont icon-cuowu"></span>';
                    item.appendChild(error);
                    
                    const deleteBtn = document.createElement('div');
                    deleteBtn.className = 'hony-upload-item-delete';
                    deleteBtn.innerHTML = '<span class="iconfont icon-lajitong"></span>';
                    deleteBtn.onclick = function() { deleteUploadItem(this); };
                    item.appendChild(deleteBtn);
                }
            }, 2000);
        });
    }

    // 根据文件后缀获取图标路径
    function getFileIcon(fileName) {
        console.log('文件名:', fileName);
        // 处理文件名的边缘情况
        if (!fileName || typeof fileName !== 'string') {
            console.log('文件名无效');
            return '../../overall/icons/文件其他.svg';
        }
        
        // 获取文件后缀（处理没有扩展名或以点开头的文件）
        const parts = fileName.split('.');
        console.log('文件名拆分:', parts);
        
        // 如果文件名没有扩展名或只有一个部分（如 ".gitignore"）
        if (parts.length <= 1 || (parts.length === 2 && parts[0] === '')) {
            console.log('没有文件扩展名或扩展名无效');
            return '../../overall/icons/文件其他.svg';
        }
        
        const ext = parts.pop().toLowerCase();
        console.log('文件后缀:', ext);
        
        const iconMap = {
            'doc': '文件DOC.svg',
            'docx': '文件DOC.svg',
            'xls': '文件EXC.svg',
            'xlsx': '文件EXC.svg',
            'csv': '文件EXC.svg',
            'jpg': '文件IMG.svg',
            'jpeg': '文件IMG.svg',
            'png': '文件IMG.svg',
            'gif': '文件IMG.svg',
            'bmp': '文件IMG.svg',
            'svg': '文件IMG.svg',
            'pdf': '文件PDF.svg',
            'ppt': '文件PPT.svg',
            'pptx': '文件PPT.svg'
        };
        const iconName = iconMap[ext] || '文件其他.svg';
        console.log('图标名称:', iconName);
        const path = '../../overall/icons/' + iconName;
        console.log('图标路径:', path);
        return path;
    }

    // 创建上传项
    function createUploadItem(fileName, status) {
        const iconPath = getFileIcon(fileName);
        const item = document.createElement('div');
        item.className = 'hony-upload-item';
        item.innerHTML = `
            <div class="hony-upload-item-icon">
                <img src="${iconPath}" alt="文件图标" class="hony-file-icon">
            </div>
            <div class="hony-upload-item-file">
                <span class="hony-upload-item-name">${fileName}</span>
                <div class="hony-upload-item-progress">
                    <div class="hony-upload-item-progress-bar">
                        <div class="hony-upload-item-progress-inner" style="width: 0%"></div>
                    </div>
                    <span class="hony-upload-item-progress-text">0%</span>
                </div>
            </div>
            <div class="hony-upload-item-${status}">
                <span class="iconfont icon-jiazai"></span>
            </div>
        `;
        return item;
    }

    // 处理图片文件上传
    function handleImageFiles(files) {
        const container = document.getElementById('hony-upload-image-container');
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            // 创建预览元素（包含进度遮罩）
            const preview = document.createElement('div');
            preview.className = 'hony-upload-image-preview';
            
            // 创建进度遮罩
            const progressOverlay = document.createElement('div');
            progressOverlay.className = 'hony-upload-image-progress-overlay';
            progressOverlay.innerHTML = `
                <div class="hony-upload-image-progress-icon">
                    <span class="iconfont icon-jiazai"></span>
                </div>
                <span class="hony-upload-image-progress-text">0%</span>
            `;
            
            // 创建图片元素
            const img = document.createElement('img');
            img.onload = function() {
                // 图片加载完成后移除进度遮罩，显示操作遮罩
                progressOverlay.remove();
                const overlay = document.createElement('div');
                overlay.className = 'hony-upload-image-preview-overlay';
                overlay.innerHTML = `
                    <span class="iconfont">&#xf083;</span>
                    <span class="iconfont icon-lajitong hony-upload-image-preview-action"></span>
                `;
                preview.appendChild(overlay);
                
                // 添加查看功能
                overlay.querySelector('.iconfont').addEventListener('click', function(e) {
                    e.stopPropagation();
                    openImagePreview(img.src);
                });
                
                // 添加删除功能
                overlay.querySelector('.icon-lajitong').addEventListener('click', function() {
                    preview.remove();
                });
            };
            
            preview.appendChild(img);
            preview.appendChild(progressOverlay);
            // 将新上传的图片插入到上传按钮之后，确保上传按钮永远在第一位
            if (imageItem.nextSibling) {
                container.insertBefore(preview, imageItem.nextSibling);
            } else {
                container.appendChild(preview);
            }
            
            // 模拟上传进度
            let progress = 0;
            const progressText = progressOverlay.querySelector('.hony-upload-image-progress-text');
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                }
                progressText.textContent = Math.round(progress) + '%';
            }, 100);
            
            reader.onload = function(e) {
                clearInterval(progressInterval);
                progressText.textContent = '100%';
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        });
    }

});