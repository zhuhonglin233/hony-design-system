import re

# 读取shuttle.html文件
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/C-input/shuttle.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 找到左边面板的内容（在右侧面板之前）
left_panel_pattern = r'(<div class="hony-transfer-panel hony-left-panel">.*?)(?=<div class="hony-transfer-panel hony-right-panel">)'
match = re.search(left_panel_pattern, html_content, re.DOTALL)

if match:
    left_panel_content = match.group(1)
    # 删除左边面板中的所有删除图标
    left_panel_content_cleaned = re.sub(r'\s*<span class="transfer-delete iconfont" onclick="event\.stopPropagation\(\); deleteItem\(this\)">&#xef0c;</span>\s*', '', left_panel_content)
    
    # 替换原内容
    html_content = html_content.replace(left_panel_content, left_panel_content_cleaned)
    
    # 写回HTML文件
    with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/C-input/shuttle.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("shuttle.html 修复完成")
    print("已删除左边面板中的所有删除图标")
else:
    print("未找到左边面板")