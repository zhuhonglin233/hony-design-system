#!/usr/bin/env python3
import os
import re
from pathlib import Path

project_root = Path(__file__).parent
print(f"Project root: {project_root}")

def check_file(file_path):
    rel_path = file_path.relative_to(project_root)
    print(f"\n--- {rel_path} ---")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查所有 href 和 src
    links = re.findall(r'(?:href|src)="([^"]+)"', content)
    issues = []
    
    for link in links:
        # 跳过外部链接
        if link.startswith(('http://', 'https://', '#', 'javascript:')):
            continue
        
        # 计算目标文件绝对路径
        file_dir = file_path.parent
        target_path = (file_dir / link).resolve()
        
        if not target_path.exists():
            issues.append(f"NOT FOUND: {link}")
            print(f"  ❌ {link}")
        else:
            print(f"  ✅ {link}")
    
    return issues

def main():
    all_issues = {}
    
    # 检查 desktop 目录
    desktop_dir = project_root / 'desktop'
    for html_file in desktop_dir.rglob('*.html'):
        issues = check_file(html_file)
        if issues:
            all_issues[str(html_file.relative_to(project_root))] = issues
    
    # 检查 Specification 目录
    spec_dir = project_root / 'Specification'
    for html_file in spec_dir.glob('*.html'):
        issues = check_file(html_file)
        if issues:
            all_issues[str(html_file.relative_to(project_root))] = issues
    
    # 检查根目录 index.html
    index_file = project_root / 'index.html'
    if index_file.exists():
        issues = check_file(index_file)
        if issues:
            all_issues['index.html'] = issues
    
    print(f"\n{'='*60}")
    print("SUMMARY OF ISSUES:")
    for file, issues in all_issues.items():
        print(f"\n{file}:")
        for issue in issues:
            print(f"  - {issue}")

if __name__ == '__main__':
    main()
