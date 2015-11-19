# 乔布堂前端的类库

## 目录结构

```
root
  |- dist 产出目录，用于外部引用，如 `bower` 或者手动引入
  |- font 字体文件目录
  |- less 样式文件目录
    |- reset.less  对于一些浏览器样式的 reset
    |- util.less  一些方便使用的 class
    |- site.less  各个子网站和主站都可能需要的样式 
  |- Makefile 构建文件，用于发布等
  |- package.json
```

## 承担的责任

1. 整站的 reset 样式: 包括基本的字体，基本元素的 reset
2. 和设计沟通好的基本组件样式: 按钮，输入框，分页
3. 基本的组件: 弹出框，下拉框
4. 基本的页面元素: 头部，尾部，多次共用的业务逻辑

## 页面样式组件

### 头部导航

**注意** 两种头部导航只有在0.0.18以后才支持

因为要面对两种类型的头部,所以对头部的样式进行了一些调整,外部要包装一层 `div` 元素
1. 对于普通的头

```html
<div class="page-header page-header_normal">
    ${layout.header}
</div>
```

2. 对于有二级导航菜单的头部

```html
<div class="page-header page-header_thin">
    ${layout.header}
</div>
```
