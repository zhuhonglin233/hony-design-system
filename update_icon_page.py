import re

# Read the icon output
with open('/tmp/icon_output.txt', 'r') as f:
    content = f.read()

# Split into sections
parts = content.split('=== ')
linear_html = ''
filled_html = ''
functional_html = ''

current_section = ''
for part in parts:
    if part.startswith('LINEAR ===\n'):
        current_section = 'linear'
        linear_html = part.replace('LINEAR ===\n', '')
    elif part.startswith('FILLED ===\n'):
        current_section = 'filled'
        filled_html = part.replace('FILLED ===\n', '')
    elif part.startswith('FUNCTIONAL ===\n'):
        current_section = 'functional'
        functional_html = part.replace('FUNCTIONAL ===\n', '')

# Read the icon.html
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/Specification/icon.html', 'r') as f:
    icon_html = f.read()

# Replace each section
# Find the pattern for linear icons section
linear_pattern = r'(<div class="subsection" id="icon-linear">.*?<div class="component-container">).*?(</div>\s*</div>\s*<div class="subsection")'
icon_html = re.sub(linear_pattern, r'\1\n' + linear_html + r'\2', icon_html, flags=re.DOTALL)

# Find the pattern for filled icons section
filled_pattern = r'(<div class="subsection" id="icon-filled">.*?<div class="component-container">).*?(</div>\s*</div>\s*<div class="subsection")'
icon_html = re.sub(filled_pattern, r'\1\n' + filled_html + r'\2', icon_html, flags=re.DOTALL)

# Find the pattern for functional icons section
functional_pattern = r'(<div class="subsection" id="icon-function">.*?<div class="component-container">).*?(</div>\s*</div>\s*(?:<div class="subsection"))'
icon_html = re.sub(functional_pattern, r'\1\n' + functional_html + r'\2', icon_html, flags=re.DOTALL)

# Write the updated icon.html
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/Specification/icon.html', 'w') as f:
    f.write(icon_html)

print("Icon page updated successfully!")