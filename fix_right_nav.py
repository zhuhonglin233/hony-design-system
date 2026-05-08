import os
import re

# 需要处理的目录
directories = [
    '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/A-system',
    '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/B-navigation',
    '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/C-input',
    '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/D-display',
    '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/E-popup'
]

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 移除右侧导航类名的 hony- 前缀
    content = content.replace('class="hony-right-nav"', 'class="right-nav"')
    content = content.replace('class="hony-right-nav-items"', 'class="right-nav-items"')
    content = content.replace('class="hony-right-nav-item', 'class="right-nav-item')
    
    # 更新交互函数中的选择器
    content = content.replace("document.querySelectorAll('.hony-right-nav-item')", "document.querySelectorAll('.right-nav-item')")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"处理完成: {filepath}")

def main():
    for directory in directories:
        for filename in os.listdir(directory):
            if filename.endswith('.html'):
                filepath = os.path.join(directory, filename)
                process_html_file(filepath)
    
    # 处理 image.js 中的函数
    js_file = '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/A-system/image.js'
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace("document.querySelectorAll('.hony-right-nav-item')", "document.querySelectorAll('.right-nav-item')")
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"处理完成: {js_file}")

if __name__ == '__main__':
    main()