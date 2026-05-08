// 图片数据
const imageData = {
    '常规': [
        '../../overall/images/展示图.png'
    ],
    '视频': [
        '../../overall/images/默认视频.mp4'
    ],
    '多图': [
        '../../overall/images/展示图.png',
        '../../overall/images/展示图2.png',
        '../../overall/images/展示图3.png',
        '../../overall/images/展示图4.png',
        '../../overall/images/展示图5.png'
    ],
    '错误': [
        '../../overall/images/缺省页-暂无图片.png'
    ],
    '缩略': [
        '../../overall/images/默认图.png'
    ],
    '提示': [
        '../../overall/images/默认图.png'
    ]
};

let currentImages = [];
let currentIndex = 0;
let currentType = '常规';

// 打开图片弹出层
function openImagePopup(src, type) {
    if (!src) return;
    
    // 确定当前图片所属的类型
    if (!type) {
        for (const [key, value] of Object.entries(imageData)) {
            if (value.includes(src)) {
                type = key;
                break;
            }
        }
    }
    
    currentType = type;
    currentImages = imageData[type] || [src];
    currentIndex = currentImages.indexOf(src);
    if (currentIndex === -1) currentIndex = 0;
    
    // 如果已经有弹出层，先移除
    const existingPopup = document.getElementById('simple-image-popup');
    if (existingPopup) {
        document.body.removeChild(existingPopup);
    }
    
    // 创建一个简单的弹出层
    const popup = document.createElement('div');
    popup.id = 'simple-image-popup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // 创建关闭按钮
    const closeButton = document.createElement('div');
    closeButton.className = 'iconfont';
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        z-index: 10001;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
    `;
    closeButton.innerHTML = '&#xf062;'; // 关闭图标
    closeButton.onclick = function() {
        document.body.removeChild(popup);
    };
    
    // 创建媒体容器
    const mediaContainer = document.createElement('div');
    mediaContainer.id = 'popup-media-container';
    mediaContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 90%;
        max-height: 90%;
    `;
    
    // 添加导航按钮（如果是多图）
    if (currentImages.length > 1) {
        const prevButton = document.createElement('div');
        prevButton.className = 'iconfont';
        prevButton.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        `;
        prevButton.innerHTML = '&#xf06b;'; // 左箭头
        prevButton.onclick = function() {
            prevImage();
        };
        
        const nextButton = document.createElement('div');
        nextButton.className = 'iconfont';
        nextButton.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        `;
        nextButton.innerHTML = '&#xf064;'; // 右箭头
        nextButton.onclick = function() {
            nextImage();
        };
        
        popup.appendChild(prevButton);
        popup.appendChild(nextButton);
    }
    

    
    // 添加页码指示器（如果是多图）
    if (currentImages.length > 1) {
        const indicator = document.createElement('div');
        indicator.id = 'popup-indicator';
        indicator.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            font-size: 16px;
            z-index: 10001;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px 15px;
            border-radius: 15px;
        `;
        indicator.innerHTML = `${currentIndex + 1} / ${currentImages.length}`;
        popup.appendChild(indicator);
    }
    
    // 添加操作控件
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--grey-bg-0);
        border-radius: 8px;
        padding: 4px;
        width: 200px;
        height: 40px;
        z-index: 10001;
    `;
    
    // 根据是否存在多图预览调整操作控件的位置
    if (currentImages.length > 1) {
        controls.style.bottom = '130px';
    } else {
        controls.style.bottom = '20px';
    }
    
    // 缩小按钮
    const zoomOutBtn = document.createElement('div');
    zoomOutBtn.className = 'iconfont';
    zoomOutBtn.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: var(--grey-bg-0);
        font-size: 16px;
        cursor: pointer;
    `;
    zoomOutBtn.innerHTML = '&#xe969;'; // 缩小图标
    zoomOutBtn.title = '缩小';
    zoomOutBtn.onclick = function() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            const currentScale = parseFloat(media.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
            const newScale = Math.max(0.5, currentScale - 0.1);
            
            // 保留当前的translate值
            const transform = media.style.transform || '';
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let translate = '';
            if (match) {
                translate = `translate(${match[1]}, ${match[2]}) `;
            }
            
            media.style.transform = `${translate}scale(${newScale})`;
            setTimeout(updateRatio, 50);
        }
    };
    controls.appendChild(zoomOutBtn);
    
    // 向左旋转按钮
    const rotateLeftBtn = document.createElement('div');
    rotateLeftBtn.className = 'iconfont';
    rotateLeftBtn.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: var(--grey-bg-0);
        font-size: 16px;
        cursor: pointer;
        transform: scaleX(-1);
    `;
    rotateLeftBtn.innerHTML = '&#xeac7;'; // 向左旋转图标
    rotateLeftBtn.title = '向左旋转';
    rotateLeftBtn.onclick = function() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            const currentRotation = parseFloat(media.dataset.rotation || '0');
            const newRotation = (currentRotation - 90 + 360) % 360;
            media.dataset.rotation = newRotation;
            const currentScale = parseFloat(media.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
            
            // 保留当前的translate值
            const transform = media.style.transform || '';
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let translate = '';
            if (match) {
                translate = `translate(${match[1]}, ${match[2]}) `;
            }
            
            media.style.transform = `${translate}scale(${currentScale}) rotate(${newRotation}deg)`;
        }
    };
    controls.appendChild(rotateLeftBtn);
    
    // 向右旋转按钮
    const rotateRightBtn = document.createElement('div');
    rotateRightBtn.className = 'iconfont';
    rotateRightBtn.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: var(--grey-bg-0);
        font-size: 16px;
        cursor: pointer;
    `;
    rotateRightBtn.innerHTML = '&#xeac7;'; // 向右旋转图标
    rotateRightBtn.title = '向右旋转';
    rotateRightBtn.onclick = function() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            const currentRotation = parseFloat(media.dataset.rotation || '0');
            const newRotation = (currentRotation + 90) % 360;
            media.dataset.rotation = newRotation;
            const currentScale = parseFloat(media.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
            
            // 保留当前的translate值
            const transform = media.style.transform || '';
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let translate = '';
            if (match) {
                translate = `translate(${match[1]}, ${match[2]}) `;
            }
            
            media.style.transform = `${translate}scale(${currentScale}) rotate(${newRotation}deg)`;
        }
    };
    controls.appendChild(rotateRightBtn);
    
    // 放大按钮
    const zoomInBtn = document.createElement('div');
    zoomInBtn.className = 'iconfont';
    zoomInBtn.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: var(--grey-bg-0);
        font-size: 16px;
        cursor: pointer;
    `;
    zoomInBtn.innerHTML = '&#xe967;'; // 放大图标
    zoomInBtn.title = '放大';
    zoomInBtn.onclick = function() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            const currentScale = parseFloat(media.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
            const newScale = Math.min(3, currentScale + 0.1);
            
            // 保留当前的translate值
            const transform = media.style.transform || '';
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let translate = '';
            if (match) {
                translate = `translate(${match[1]}, ${match[2]}) `;
            }
            
            media.style.transform = `${translate}scale(${newScale})`;
            setTimeout(updateRatio, 50);
        }
    };
    controls.appendChild(zoomInBtn);
    
    // 添加比例显示
    const ratio = document.createElement('div');
    ratio.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        box-shadow: 0px 2px 2px rgba(135, 141, 170, 0.1);
        font-size: 12px;
        font-weight: 500;
        color: #101319;
    `;
    ratio.textContent = '1:1';
    ratio.title = '重置缩放';
    ratio.onclick = function() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            media.style.transform = 'scale(1)';
            ratio.textContent = '1:1';
        }
    };
    controls.appendChild(ratio);
    
    // 添加缩放事件监听
    const media = mediaContainer.querySelector('img, video');
    if (media) {
        // 监听变换结束事件
        media.addEventListener('transitionend', function() {
            updateRatio();
        });
        
        // 手动触发一次更新
        setTimeout(updateRatio, 100);
    }
    
    // 更新比例显示的函数
    function updateRatio() {
        const media = mediaContainer.querySelector('img, video');
        if (media) {
            const currentScale = parseFloat(media.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
            const scalePercent = Math.round(currentScale * 100);
            ratio.textContent = `${scalePercent}%`;
        }
    }
    
    // 添加元素到弹出层
    popup.appendChild(closeButton);
    popup.appendChild(mediaContainer);
    popup.appendChild(controls);
    
    // 添加多图预览区域（如果是多图）
    if (currentImages.length > 1) {
        const previewContainer = document.createElement('div');
        previewContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 24px;
            background: var(--grey-bg-0);
            overflow-x: auto;
            z-index: 10001;
        `;
        
        // 添加左右渐变遮罩
        const leftMask = document.createElement('div');
        leftMask.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 56px;
            height: 100%;
            background-image: linear-gradient(90deg, white 0.2%, rgba(255, 255, 255, 0) 100.2%);
            z-index: 1;
        `;
        previewContainer.appendChild(leftMask);
        
        const rightMask = document.createElement('div');
        rightMask.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 56px;
            height: 100%;
            background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0.2%, white 100.2%);
            z-index: 1;
        `;
        previewContainer.appendChild(rightMask);
        
        // 添加缩略图容器
        const thumbnailsContainer = document.createElement('div');
        thumbnailsContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 0;
            position: relative;
            justify-content: center;
            min-width: 100%;
        `;
        
        // 添加缩略图
        currentImages.forEach((src, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = src;
            thumbnail.style.cssText = `
                width: 64px;
                height: 64px;
                object-fit: cover;
                border-radius: 8px;
                cursor: pointer;
                border: ${index === currentIndex ? '2px solid #007bff' : 'none'};
                transition: all 0.3s ease;
            `;
            thumbnail.title = `图片 ${index + 1}`;
            thumbnail.onclick = function() {
                currentIndex = index;
                const container = document.getElementById('popup-media-container');
                updateMediaContent(container);
                
                // 更新缩略图样式
                const thumbnails = thumbnailsContainer.querySelectorAll('img');
                thumbnails.forEach((thumb, i) => {
                    thumb.style.width = '64px';
                    thumb.style.height = '64px';
                    thumb.style.border = i === currentIndex ? '2px solid #007bff' : 'none';
                });
                
                // 滚动到选中的图片
                thumbnailsContainer.scrollLeft = thumbnail.offsetLeft - (thumbnailsContainer.clientWidth / 2) + (thumbnail.clientWidth / 2);
                
                // 更新页码指示器
                if (document.getElementById('popup-indicator')) {
                    document.getElementById('popup-indicator').innerHTML = `${currentIndex + 1} / ${currentImages.length}`;
                }
            };
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        // 初始滚动到选中的图片
        setTimeout(() => {
            const selectedThumbnail = thumbnailsContainer.querySelector('img[style*="border: 2px solid #007bff"]');
            if (selectedThumbnail) {
                thumbnailsContainer.scrollLeft = selectedThumbnail.offsetLeft - (thumbnailsContainer.clientWidth / 2) + (selectedThumbnail.clientWidth / 2);
            }
        }, 100);
        
        previewContainer.appendChild(thumbnailsContainer);
        popup.appendChild(previewContainer);
    }
    
    // 添加弹出层到页面
    document.body.appendChild(popup);
    
    // ESC按键关闭弹出层
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const popupElement = document.getElementById('simple-image-popup');
            if (popupElement) {
                document.body.removeChild(popupElement);
            }
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    // 更新媒体内容
    updateMediaContent(mediaContainer);
}

// 更新媒体内容
function updateMediaContent(container) {
    if (!container) return;
    
    const src = currentImages[currentIndex];
    container.innerHTML = '';
    
    let mediaElement;
    if (src.endsWith('.mp4')) {
        // 视频
        mediaElement = document.createElement('video');
        mediaElement.src = src;
        mediaElement.alt = '视频';
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
    } else {
        // 图片
        mediaElement = document.createElement('img');
        mediaElement.src = src;
        mediaElement.alt = '大图';
    }
    
    mediaElement.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    container.appendChild(mediaElement);
    
    // 添加拖动功能
    let isDragging = false;
    let startX, startY, offsetX, offsetY;
    
    mediaElement.style.position = 'relative';
    mediaElement.style.cursor = 'grab';
    
    mediaElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // 记录当前位置
        const transform = mediaElement.style.transform || 'translate(0, 0)';
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) {
            offsetX = parseFloat(match[1]);
            offsetY = parseFloat(match[2]);
        } else {
            offsetX = 0;
            offsetY = 0;
        }
        
        mediaElement.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        mediaElement.style.transform = `translate(${offsetX + deltaX}px, ${offsetY + deltaY}px) ${mediaElement.style.transform.replace(/translate\([^)]+\)/, '')}`;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        mediaElement.style.cursor = 'grab';
    });
    
    // 更新页码指示器
    const indicator = document.getElementById('popup-indicator');
    if (indicator) {
        indicator.innerHTML = `${currentIndex + 1} / ${currentImages.length}`;
    }
}

// 上一张
function prevImage() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    const container = document.getElementById('popup-media-container');
    updateMediaContent(container);
    
    // 更新缩略图选中状态
    const thumbnails = document.querySelectorAll('img[title^="图片"]');
    thumbnails.forEach((thumb, index) => {
        thumb.style.width = '64px';
        thumb.style.height = '64px';
        thumb.style.border = index === currentIndex ? '2px solid #007bff' : 'none';
    });
    
    // 滚动到选中的图片
    setTimeout(() => {
        const selectedThumbnail = document.querySelector('img[title^="图片"][style*="border: 2px solid #007bff"]');
        if (selectedThumbnail) {
            const thumbnailsContainer = selectedThumbnail.parentElement;
            thumbnailsContainer.scrollLeft = selectedThumbnail.offsetLeft - (thumbnailsContainer.clientWidth / 2) + (selectedThumbnail.clientWidth / 2);
        }
    }, 100);
}

// 下一张
function nextImage() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    const container = document.getElementById('popup-media-container');
    updateMediaContent(container);
    
    // 更新缩略图选中状态
    const thumbnails = document.querySelectorAll('img[title^="图片"]');
    thumbnails.forEach((thumb, index) => {
        thumb.style.width = '64px';
        thumb.style.height = '64px';
        thumb.style.border = index === currentIndex ? '2px solid #007bff' : 'none';
    });
    
    // 滚动到选中的图片
    setTimeout(() => {
        const selectedThumbnail = document.querySelector('img[title^="图片"][style*="border: 2px solid #007bff"]');
        if (selectedThumbnail) {
            const thumbnailsContainer = selectedThumbnail.parentElement;
            thumbnailsContainer.scrollLeft = selectedThumbnail.offsetLeft - (thumbnailsContainer.clientWidth / 2) + (selectedThumbnail.clientWidth / 2);
        }
    }, 100);
}

// 格式化视频时长
function formatDuration(seconds) {
    if (isNaN(seconds) || seconds === 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 关闭图片弹出层
function closeImagePopup() {
    const popup = document.getElementById('simple-image-popup');
    if (popup) {
        document.body.removeChild(popup);
    }
}

// 上传图片预览
document.addEventListener('DOMContentLoaded', function() {
    const uploadInputs = document.querySelectorAll('.hony-avatar-upload-input');
    uploadInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = input.nextElementSibling;
                    const img = preview.querySelector('.hony-avatar-upload-img');
                    const placeholder = preview.querySelector('.hony-avatar-upload-placeholder');
                    img.src = e.target.result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // 处理视频时长显示
    const videoElements = document.querySelectorAll('.video-with-duration');
    videoElements.forEach(video => {
        video.addEventListener('canplay', function() {
            const duration = this.duration;
            const durationElement = this.parentElement.querySelector('.video-duration');
            if (durationElement && duration && !isNaN(duration)) {
                const mins = Math.floor(duration / 60);
                const secs = Math.floor(duration % 60);
                durationElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        });
    });
});
