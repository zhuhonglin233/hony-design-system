# 设计规范网站 - 公共组件使用说明

## 项目结构

```
website-project/
├── common.css          # 公共样式文件
├── common.js           # 公共JavaScript文件
├── template.html       # 页面模板文件
├── index.html          # 首页
├── color.html          # 颜色规范页面
├── color.css           # 颜色页面特有样式
├── font.html           # 字体规范页面
├── font.css            # 字体页面特有样式
└── ...
```

## 公共组件说明

### 1. common.css - 公共样式文件

包含所有页面共用的样式：
- 全局样式（重置、字体、背景色等）
- 顶部导航栏样式（.navbar, .logo, .nav-menu等）
- 侧边导航样式（.side-nav, .side-nav-item等）
- 主内容区域样式（.main-content, .content等）
- 页面头部样式（.page-header, .page-title等）
- 章节样式（.section, .subsection等）
- 表格样式（.table）
- 颜色框样式（.color-box）
- 响应式设计

### 2. common.js - 公共JavaScript文件

包含所有页面共用的交互功能：
- 导航栏滚动效果（滚动时背景变化）
- 侧边导航点击效果（切换active状态）
- 顶部导航点击效果（切换active状态）

### 3. template.html - 页面模板文件

提供标准页面结构模板，包含占位符：
- `{{page_css}}` - 页面特有CSS文件
- `{{active_design}}` - 设计规范导航项激活状态
- `{{design_page}}` - 设计规范页面链接
- `{{active_color}}` - 颜色导航项激活状态
- `{{active_font}}` - 字体导航项激活状态
- `{{page_title}}` - 页面标题
- `{{page_description}}` - 页面描述
- `{{page_content}}` - 页面内容

## 如何创建新页面

### 1. 创建HTML文件

复制以下基本结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - 设计规范</title>
    <link rel="stylesheet" href="common.css">
    <link rel="stylesheet" href="your-page.css">
    <script src="common.js"></script>
</head>
<body>
    <div class="page-container">
        <!-- 导航栏 -->
        <nav class="navbar">
            <div class="navbar-content">
                <!-- Logo -->
                <div class="logo" onclick="window.location.href='index.html'">
                    <div class="logo-icon"></div>
                    <div class="logo-text">Design System</div>
                </div>
                
                <!-- 导航菜单 -->
                <div class="nav-menu">
                    <div class="nav-item active" onclick="window.location.href='your-page.html'">
                        <div class="nav-item-inner">
                            <div class="nav-text">设计规范</div>
                        </div>
                    </div>
                    <!-- 其他导航项... -->
                </div>
            </div>
        </nav>
        
        <!-- 主内容区域 -->
        <div class="main-content">
            <!-- 侧边导航 -->
            <aside class="side-nav">
                <div class="side-nav-title">设计规范</div>
                <div class="side-nav-menu">
                    <a href="color.html" class="side-nav-item">
                        <div class="side-nav-icon">●</div>
                        <div class="side-nav-text">颜色</div>
                    </a>
                    <a href="font.html" class="side-nav-item">
                        <div class="side-nav-icon">●</div>
                        <div class="side-nav-text">字体</div>
                    </a>
                    <a href="your-page.html" class="side-nav-item active">
                        <div class="side-nav-icon">●</div>
                        <div class="side-nav-text">你的页面</div>
                    </a>
                    <!-- 其他导航项... -->
                </div>
            </aside>

            <!-- 内容区域 -->
            <main class="content">
                <!-- 页面头部 -->
                <div class="page-header">
                    <div class="design-code">design code 设计规范</div>
                    <div class="page-title">页面标题</div>
                    <div class="page-description">页面描述内容...</div>
                </div>

                <!-- 页面内容 -->
                <div class="section">
                    <div class="section-title">章节标题</div>
                    <div class="subsection">
                        <div class="subsection-title">子章节标题</div>
                        <div class="subsection-description">子章节描述...</div>
                        <!-- 具体内容 -->
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>
```

### 2. 创建CSS文件

创建 `your-page.css` 文件，只包含页面特有的样式：

```css
/* 页面特有样式 */

/* 你的自定义样式 */
```

### 3. 更新导航

在所有相关页面的侧边导航中添加新页面的链接，并设置正确的active状态。

## 修改公共组件

### 修改导航栏样式

编辑 `common.css` 中的导航栏相关样式：
- `.navbar` - 导航栏容器
- `.logo` - Logo样式
- `.nav-menu` - 导航菜单
- `.nav-item` - 导航项
- `.nav-text` - 导航文字

### 修改侧边导航样式

编辑 `common.css` 中的侧边导航相关样式：
- `.side-nav` - 侧边导航容器
- `.side-nav-item` - 侧边导航项
- `.side-nav-text` - 侧边导航文字

### 修改页面布局

编辑 `common.css` 中的布局相关样式：
- `.main-content` - 主内容区域
- `.content` - 内容区域
- `.page-header` - 页面头部
- `.section` - 章节
- `.subsection` - 子章节
- `.component-container` - 组件容器（白色背景、圆角、内边距的容器）

### 修改交互功能

编辑 `common.js` 中的交互功能：
- `initNavbarScroll()` - 导航栏滚动效果
- `initSideNav()` - 侧边导航点击效果
- `initTopNav()` - 顶部导航点击效果

## 注意事项

1. **不要在页面CSS文件中重复定义公共样式**，只定义页面特有的样式
2. **确保所有页面都引入了common.css和common.js**
3. **修改公共样式会影响所有页面**，请谨慎修改
4. **新增页面时记得更新所有相关页面的侧边导航链接**
5. **保持页面结构和命名的一致性**

## 示例

参考 `color.html` 和 `font.html` 的实现方式，它们都使用了相同的公共组件和结构。