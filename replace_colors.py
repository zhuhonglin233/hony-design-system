#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

# 定义替换规则
replace_rules = [
    # 主色
    (r'var\(--primary-1\)', 'var(--primary-face-1)'),
    (r'var\(--primary-2\)', 'var(--primary-face-2)'),
    (r'var\(--primary-4\)', 'var(--primary-main-4)'),
    (r'var\(--primary-5\)', 'var(--primary-main-2)'),
    (r'var\(--primary-6\)', 'var(--primary-main-1)'),
    (r'var\(--primary-7\)', 'var(--primary-main-3)'),
    
    # 成功色
    (r'var\(--success-1\)', 'var(--success-face-1)'),
    (r'var\(--success-2\)', 'var(--success-face-2)'),
    (r'var\(--success-4\)', 'var(--success-main-4)'),
    (r'var\(--success-5\)', 'var(--success-main-2)'),
    (r'var\(--success-6\)', 'var(--success-main-1)'),
    (r'var\(--success-7\)', 'var(--success-main-3)'),
    
    # 警告色
    (r'var\(--warning-1\)', 'var(--warning-face-1)'),
    (r'var\(--warning-2\)', 'var(--warning-face-2)'),
    (r'var\(--warning-4\)', 'var(--warning-main-4)'),
    (r'var\(--warning-5\)', 'var(--warning-main-2)'),
    (r'var\(--warning-6\)', 'var(--warning-main-1)'),
    (r'var\(--warning-7\)', 'var(--warning-main-3)'),
    
    # 危险色
    (r'var\(--danger-1\)', 'var(--danger-face-1)'),
    (r'var\(--danger-2\)', 'var(--danger-face-2)'),
    (r'var\(--danger-3\)', 'var(--danger-main-4)'),
    (r'var\(--danger-4\)', 'var(--danger-main-4)'),
    (r'var\(--danger-5\)', 'var(--danger-main-2)'),
    (r'var\(--danger-6\)', 'var(--danger-main-1)'),
    (r'var\(--danger-7\)', 'var(--danger-main-3)'),
    
    # 中性色 - 灰色文字
    (r'var\(--grey-5\)', 'var(--grey-text-4)'),
    (r'var\(--grey-6\)', 'var(--grey-text-4)'),
    (r'var\(--grey-7\)', 'var(--grey-text-3)'),
    (r'var\(--grey-8\)', 'var(--grey-text-2)'),
    (r'var\(--grey-9\)', 'var(--grey-text-1)'),
    (r'var\(--grey-10\)', 'var(--grey-text-1)'),
    (r'var\(--grey-11\)', 'var(--grey-main-3)'),
    (r'var\(--grey-12\)', 'var(--grey-text-1)'),
    
    # 中性色 - 灰色边框和背景
    (r'var\(--grey-1\)', 'var(--grey-face-1)'),
    (r'var\(--grey-2\)', 'var(--grey-face-2)'),
    (r'var\(--grey-3\)', 'var(--grey-border-1)'),
    (r'var\(--grey-4\)', 'var(--grey-border-2)'),
]

# 定义 white 的替换
white_replace_rules = [
    (r'background-color: white;', 'background-color: var(--grey-bg-0);'),
    (r'background: white;', 'background: var(--grey-bg-0);'),
    (r'background-color: #FFFFFF;', 'background-color: var(--grey-bg-0);'),
    (r'background: #FFFFFF;', 'background: var(--grey-bg-0);'),
    (r'background-color: #ffffff;', 'background-color: var(--grey-bg-0);'),
    (r'background: #ffffff;', 'background: var(--grey-bg-0);'),
    (r'color: white;', 'color: var(--primary-main-5);'),
]

def replace_colors_in_file(file_path):
    """替换文件中的颜色变量"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 应用替换规则
        for pattern, replacement in replace_rules:
            content = re.sub(pattern, replacement, content)
        
        # 应用 white 替换规则
        for pattern, replacement in white_replace_rules:
            content = re.sub(pattern, replacement, content)
        
        # 如果有变化，写入文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'已更新: {file_path}')
            return True
        return False
    except Exception as e:
        print(f'处理文件 {file_path} 时出错: {e}')
        return False

def main():
    """主函数"""
    # 项目根目录
    project_dir = '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project'
    
    # 要处理的文件扩展名
    extensions = ('.css', '.html')
    
    # 统计
    total_files = 0
    modified_files = 0
    
    # 遍历目录
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            if file.endswith(extensions) and file != 'design-tokens.css':
                file_path = os.path.join(root, file)
                total_files += 1
                if replace_colors_in_file(file_path):
                    modified_files += 1
    
    print(f'\n处理完成! 总共检查了 {total_files} 个文件, 修改了 {modified_files} 个文件。')

if __name__ == '__main__':
    main()
