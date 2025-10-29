# 🎮 Babylon.js 代码演示平台

一个基于 Vue 3 + Monaco Editor + Babylon.js 的交互式 3D 代码演示平台。

## ✨ 特性

- 🎨 **Monaco Editor** - 强大的代码编辑器，支持语法高亮和智能提示
- 🎮 **Babylon.js** - 实时 3D 场景渲染
- 🔄 **实时预览** - 编辑代码后即时运行查看效果
- 📝 **多个示例** - 内置多个示例场景，快速上手
- 🎯 **左右分栏** - 左侧代码编辑，右侧实时预览
- ⚡ **Vite** - 快速的开发体验和构建速度

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📖 使用说明

### 基本操作

1. **选择示例**：在顶部下拉菜单中选择预设的示例代码
2. **编辑代码**：在左侧 Monaco Editor 中编辑 Babylon.js 代码
3. **运行代码**：点击"运行"按钮查看 3D 场景效果
4. **重置代码**：点击"重置"按钮恢复到当前示例的初始代码
5. **重置相机**：在右侧点击"重置相机"按钮恢复默认视角

### 内置示例

- **基础场景** - 旋转的立方体
- **多个几何体** - 展示球体、立方体和圆柱体
- **光照效果** - PBR 材质和多彩点光源
- **弹跳动画** - 物理弹跳效果
- **粒子系统** - 火焰粒子效果

### 编写代码

在代码中，你可以直接使用以下变量：

- `scene` - Babylon.js 场景对象
- `BABYLON` - Babylon.js 库
- `camera` - 相机对象
- `engine` - 渲染引擎对象

示例代码：

```javascript
// 创建一个球体
const sphere = BABYLON.MeshBuilder.CreateSphere(
  "sphere",
  { diameter: 2 },
  scene
);
sphere.position.y = 1;

// 创建材质
const material = new BABYLON.StandardMaterial("mat", scene);
material.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
sphere.material = material;

// 添加旋转动画
scene.registerBeforeRender(() => {
  sphere.rotation.y += 0.01;
});
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Monaco Editor** - VS Code 的代码编辑器核心
- **Babylon.js** - 强大的 3D 引擎

## 📁 项目结构

```
badylon-SDK/
├── src/
│   ├── components/
│   │   ├── MonacoEditor.vue    # Monaco 编辑器组件
│   │   └── BabylonViewer.vue   # Babylon.js 渲染组件
│   ├── examples.js             # 示例代码集合
│   ├── App.vue                 # 主应用组件
│   └── main.js                 # 应用入口
└── vite.config.js              # Vite 配置
```

## 📄 许可证

MIT

---

Made with ❤️ using Vue 3, Monaco Editor, and Babylon.js
