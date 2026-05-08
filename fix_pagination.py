import re

# 读取Pagination.js文件
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/B-navigation/Pagination.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复问题1：totalPages不能重新赋值（const声明的）
content = content.replace(
    '    totalPages = Math.ceil(actualTotal / size);',
    '    const newTotalPages = Math.ceil(actualTotal / size);'
)

# 修复问题2：使用newTotalPages
content = content.replace(
    '    for (let i = 1; i <= totalPages; i++) {',
    '    for (let i = 1; i <= newTotalPages; i++) {'
)

# 修复问题3：选择器的类名（hony-selected而不是selected）
content = content.replace(
    '    selector.querySelectorAll(\'.hony-selector-option\').forEach(opt => opt.classList.remove(\'selected\'));\n    option.classList.add(\'selected\');',
    '    selector.querySelectorAll(\'.hony-selector-option\').forEach(opt => opt.classList.remove(\'hony-selected\'));\n    option.classList.add(\'hony-selected\');'
)

# 修复问题4：函数名（selectOption而不是handlePageSizeChange？不，让我检查）
# 让我们确保HTML中的onclick调用正确的函数

# 写入修复后的文件
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/desktop/B-navigation/Pagination.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("已修复Pagination.js")