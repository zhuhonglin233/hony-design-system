import re

# Read iconfont.css
with open('/Users/zhuhonglin/Documents/朱虹霖AI智能体/zhu_honglin/website-project/overall/icons/iconfont.css', 'r') as f:
    content = f.read()

# Extract all icon names
pattern = r'\.icon-([^:]+):before'
icons = re.findall(pattern, content)
icons = list(set(icons))  # Remove duplicates
icons.sort()

# Categorize icons
linear = []
filled = []
functional = []

for icon in icons:
    if icon.endswith('-filled'):
        filled.append(icon)
    else:
        linear.append(icon)

# Functional icons are those without a filled counterpart
for icon in linear:
    if icon + '-filled' not in icons:
        functional.append(icon)

for icon in filled:
    base = icon[:-7]
    if base not in linear:
        functional.append(icon)

functional.sort()

# Generate HTML for each category
def generate_icon_html(icon_list):
    html = '<div class="icon-showcase">\n'
    for icon in icon_list:
        html += f'''                                    <div class="icon-item" onclick="copyIconName('icon-{icon}')">
                                        <span class="iconfont icon-{icon}"></span>
                                        <span class="icon-name">{icon}</span>
                                    </div>
'''
    html += '                                </div>\n'
    return html

linear_html = generate_icon_html(linear)
filled_html = generate_icon_html(filled)
functional_html = generate_icon_html(functional)

print(f"Linear: {len(linear)}, Filled: {len(filled)}, Functional: {len(functional)}")

with open('/tmp/icon_output.txt', 'w') as f:
    f.write("=== LINEAR ===\n")
    f.write(linear_html)
    f.write("\n=== FILLED ===\n")
    f.write(filled_html)
    f.write("\n=== FUNCTIONAL ===\n")
    f.write(functional_html)