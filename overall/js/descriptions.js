// 详情描述组件相关函数

/**
 * 滚动到指定章节
 * @param {string} title - 章节标题
 */
function scrollToSection(title) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.querySelector('h2')?.textContent === title) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}