#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
给所有组件类名添加 "hony-" 前缀的脚本
"""

import os
import re

# 不需要添加前缀的通用类名列表
EXCLUDE_CLASSES = [
    'page-container',
    'main-content',
    'content-area',
    'content-main',
    'page-header',
    'design-code',
    'page-title',
    'page-description',
    'section',
    'section-title',
    'subsection',
    'subsection-title',
    'subsection-description',
    'sidebar-container',
    'navbar-container',
    'background-decoration',
    'level-title-container',
    'level-title-line',
    'level-title',
    'level-description',
    'iconfont',
    # 添加其他通用类名...
]

# 组件特定前缀列表 - 这些是我们需要加 hony- 前缀的
COMPONENT_PREFIXES = [
    'btn',
    'button',
    'card',
    'tab',
    'image',
    'badge',
    'avatar',
    'table',
    'timeline',
    'comment',
    'calendar',
    'descriptions',
    'list',
    'alert',
    'modal',
    'dropdown',
    'popconfirm',
    'input',
    'select',
    'checkbox',
    'checkmark',
    'radio',
    'swich',
    'slider',
    'score',
    'upload',
    'tree',
    'shuttle',
    'form',
    'tabs',
    'breadcrumb',
    'steps',
    'step',
    'Multi',
    'title',
    'Pagination',
    'navigation',
    'top-nav',
    'side-nav',
    'nav',
    'drawer-nav',
    'collapse-menu',
    'menu-title',
    'nav-menu',
    'sidebar-nav',
    'right-nav',
    'component',
    'password',
    'verification',
]


def should_add_prefix(class_name):
    """判断是否应该给这个类名添加前缀"""
    # 如果在排除列表中，不添加前缀
    for exclude in EXCLUDE_CLASSES:
        if class_name == exclude:
            return False
    
    # 如果以组件前缀开头，添加前缀
    for prefix in COMPONENT_PREFIXES:
        if class_name.startswith(prefix):
            return True
    
    return False


def replace_in_html(file_path):
    """替换 HTML 文件中的 class 属性和 id 属性"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换 class="xxx" 中的类名
        def replace_class_match(match):
            class_list = match.group(2).split()
            new_classes = []
            for cls in class_list:
                if should_add_prefix(cls) and not cls.startswith('hony-'):
                    new_classes.append(f'hony-{cls}')
                else:
                    new_classes.append(cls)
            return f'{match.group(1)}{" ".join(new_classes)}{match.group(3)}'
        
        # 匹配 class="xxx" 或 class='xxx'
        content = re.sub(r'(\bclass=["\'])([^"\']+)(["\'])', replace_class_match, content)
        
        # 替换 id="sidebar-nav-xxx" 中的 id
        def replace_id_match(match):
            id_name = match.group(2)
            if should_add_prefix(id_name) and not id_name.startswith('hony-'):
                return f'{match.group(1)}hony-{id_name}{match.group(3)}'
            return match.group(0)
        
        # 匹配 id="xxx" 或 id='xxx'
        content = re.sub(r'(\bid=["\'])([^"\']+)(["\'])', replace_id_match, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated HTML: {file_path}')
            return True
        return False
    except Exception as e:
        print(f'Error processing HTML {file_path}: {e}')
        return False


def replace_in_css(file_path):
    """替换 CSS 文件中的类选择器和 id 选择器"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换 .xxx 为 .hony-xxx
        def replace_css_class(match):
            class_name = match.group(1)
            if should_add_prefix(class_name) and not class_name.startswith('hony-'):
                return f'.hony-{class_name}'
            return match.group(0)
        
        # 匹配 .class-name 样式的选择器
        content = re.sub(r'\.([a-zA-Z0-9_-]+)', replace_css_class, content)
        
        # 替换 #xxx 为 #hony-xxx
        def replace_css_id(match):
            id_name = match.group(1)
            if should_add_prefix(id_name) and not id_name.startswith('hony-'):
                return f'#hony-{id_name}'
            return match.group(0)
        
        # 匹配 #id-name 样式的选择器
        content = re.sub(r'#([a-zA-Z0-9_-]+)', replace_css_id, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated CSS: {file_path}')
            return True
        return False
    except Exception as e:
        print(f'Error processing CSS {file_path}: {e}')
        return False


def replace_in_js(file_path):
    """替换 JS 文件中的类名和 id 引用"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换 querySelector 等中的类名
        def replace_js_class(match):
            class_name = match.group(2)
            if should_add_prefix(class_name) and not class_name.startswith('hony-'):
                return f'{match.group(1)}.hony-{class_name}{match.group(3)}'
            return match.group(0)
        
        # 匹配 .class-name 在字符串中
        content = re.sub(r'(["\'])\.([a-zA-Z0-9_-]+)(["\'])', replace_js_class, content)
        
        # 替换 querySelector 等中的 id 选择器
        def replace_js_id_selector(match):
            id_name = match.group(2)
            if should_add_prefix(id_name) and not id_name.startswith('hony-'):
                return f'{match.group(1)}#hony-{id_name}{match.group(3)}'
            return match.group(0)
        
        # 匹配 #id-name 在字符串中
        content = re.sub(r'(["\'])#([a-zA-Z0-9_-]+)(["\'])', replace_js_id_selector, content)
        
        # 替换 getElementById 中的 id
        def replace_get_element_by_id(match):
            id_name = match.group(2)
            if should_add_prefix(id_name) and not id_name.startswith('hony-'):
                return f'{match.group(1)}"hony-{id_name}"{match.group(3)}'
            return match.group(0)
        
        # 匹配 getElementById('id-name')
        content = re.sub(r'(getElementById\()(["\'])([a-zA-Z0-9_-]+)(["\'])\)', replace_get_element_by_id, content)
        
        # 替换 classList.add/remove/toggle 等中的类名
        def replace_class_list(match):
            class_name = match.group(2)
            if should_add_prefix(class_name) and not class_name.startswith('hony-'):
                return f'{match.group(1)}"hony-{class_name}"{match.group(3)}'
            return match.group(0)
        
        content = re.sub(r'(\.(?:add|remove|toggle|contains)\()(["\'])([a-zA-Z0-9_-]+)(["\'])\)', replace_class_list, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated JS: {file_path}')
            return True
        return False
    except Exception as e:
        print(f'Error processing JS {file_path}: {e}')
        return False


def process_directory(directory):
    """处理目录中的所有文件"""
    html_count = 0
    css_count = 0
    js_count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith('.html'):
                if replace_in_html(file_path):
                    html_count += 1
            elif file.endswith('.css'):
                if replace_in_css(file_path):
                    css_count += 1
            elif file.endswith('.js'):
                if replace_in_js(file_path):
                    js_count += 1
    
    print(f'\nSummary:')
    print(f'Updated {html_count} HTML files')
    print(f'Updated {css_count} CSS files')
    print(f'Updated {js_count} JS files')


if __name__ == '__main__':
    project_dir = '/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop'
    print(f'Starting to add "hony-" prefix to components in {project_dir}...\n')
    process_directory(project_dir)
    print('\nDone!')
