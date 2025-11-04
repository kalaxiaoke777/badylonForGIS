<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🎮 BabylonSDK代码演示平台</h1>
      <div class="header-controls">
        <div class="example-selector">
          <label>选择示例：</label>
          <select v-model="selectedExample" @change="loadExample">
            <option v-for="(example, key) in examples" :key="key" :value="key">
              {{ example.title }}
            </option>
          </select>
        </div>
        <div class="layout-controls">
          <button @click="toggleLayout" class="btn btn-icon" :title="layout === 'horizontal' ? '切换到上下布局' : '切换到左右布局'">
            {{ layout === 'horizontal' ? '⬌' : '⬍' }}
          </button>
          <button @click="toggleEditor" class="btn btn-icon" :title="editorCollapsed ? '展开编辑器' : '收起编辑器'">
            {{ editorCollapsed ? '◀' : '▶' }}
          </button>
        </div>
      </div>
    </header>

    <div class="main-content" :class="{
      'vertical-layout': layout === 'vertical',
      'editor-collapsed': editorCollapsed
    }">
      <div v-show="!editorCollapsed" class="editor-panel" :style="editorStyle">
        <MonacoEditor ref="editorRef" :defaultCode="currentCode" language="javascript" @run="handleRunCode" />
      </div>

      <div v-show="!editorCollapsed" class="divider" :class="{ 'vertical-divider': layout === 'vertical' }"
        @mousedown="startResize"></div>

      <div class="viewer-panel" :style="viewerStyle">
        <BabylonViewer ref="viewerRef" @ready="handleBabylonReady" />
      </div>
    </div>

    <div v-if="errorMessage" class="error-toast">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import BabylonViewer from './components/BabylonViewer.vue'
import { examples, defaultExample } from './examples.js'

const editorRef = ref(null)
const viewerRef = ref(null)
const selectedExample = ref('basic')
const currentCode = ref(defaultExample.code)
const errorMessage = ref('')
const layout = ref('horizontal') // 'horizontal' 或 'vertical'
const editorCollapsed = ref(false)
const splitRatio = ref(50) // 分割比例 (%)
const isResizing = ref(false)

let babylonReady = false

const editorStyle = computed(() => {
  if (editorCollapsed.value) return {}
  if (layout.value === 'horizontal') {
    return { width: `${splitRatio.value}%` }
  } else {
    return { height: `${splitRatio.value}%` }
  }
})

const viewerStyle = computed(() => {
  if (editorCollapsed.value) {
    return layout.value === 'horizontal'
      ? { width: '100%' }
      : { height: '100%' }
  }
  if (layout.value === 'horizontal') {
    return { width: `${100 - splitRatio.value}%` }
  } else {
    return { height: `${100 - splitRatio.value}%` }
  }
})

const handleBabylonReady = () => {
  babylonReady = true
  console.log('Babylon.js 场景已准备就绪')
}

const loadExample = () => {
  const example = examples[selectedExample.value]
  if (example) {
    currentCode.value = example.code
    if (editorRef.value) {
      editorRef.value.setCode(example.code)
    }
  }
}

const handleRunCode = (code) => {
  if (!babylonReady) {
    showError('Babylon.js 场景还未准备好，请稍候...')
    return
  }

  if (!viewerRef.value) {
    showError('渲染器未初始化')
    return
  }

  const result = viewerRef.value.executeCode(code)

  if (result.success) {
    showError('✓ 代码执行成功！', 'success')
  } else {
    showError(`✗ 执行错误: ${result.error}`)
  }
}

const showError = (message, type = 'error') => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

const toggleLayout = () => {
  layout.value = layout.value === 'horizontal' ? 'vertical' : 'horizontal'
  splitRatio.value = 50 // 重置比例

  // 延迟调整以确保 DOM 更新完成
  setTimeout(() => {
    if (viewerRef.value) {
      viewerRef.value.resize()
    }
  }, 350) // 略大于 CSS transition 时间
}

const toggleEditor = () => {
  editorCollapsed.value = !editorCollapsed.value

  // 延迟调整以确保 DOM 更新完成
  setTimeout(() => {
    if (viewerRef.value) {
      viewerRef.value.resize()
    }
  }, 350) // 略大于 CSS transition 时间
}

const startResize = (e) => {
  isResizing.value = true
  document.body.style.cursor = layout.value === 'horizontal' ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'

  const onMouseMove = (e) => {
    if (!isResizing.value) return

    const container = document.querySelector('.main-content')
    const rect = container.getBoundingClientRect()

    if (layout.value === 'horizontal') {
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100
      splitRatio.value = Math.min(Math.max(newRatio, 20), 80) // 限制在 20%-80%
    } else {
      const newRatio = ((e.clientY - rect.top) / rect.height) * 100
      splitRatio.value = Math.min(Math.max(newRatio, 20), 80)
    }
  }

  const onMouseUp = () => {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  console.log('应用已加载')
})

onBeforeUnmount(() => {
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #fff;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.example-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.example-selector label {
  font-size: 14px;
  font-weight: 500;
}

.example-selector select {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.example-selector select:hover {
  background: rgba(255, 255, 255, 0.3);
}

.example-selector select option {
  background: #2d2d30;
  color: white;
}

.layout-controls {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-icon {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  min-width: 40px;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-icon:active {
  transform: translateY(0);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.main-content.vertical-layout {
  flex-direction: column;
}

.main-content.editor-collapsed .viewer-panel {
  width: 100% !important;
  height: 100% !important;
}

.editor-panel {
  min-width: 0;
  min-height: 0;
  flex-shrink: 0;
  transition: width 0.3s ease, height 0.3s ease;
}

.divider {
  background: #3e3e42;
  cursor: col-resize;
  transition: background 0.2s;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
}

.divider:not(.vertical-divider) {
  width: 5px;
  height: 100%;
}

.divider.vertical-divider {
  width: 100%;
  height: 5px;
  cursor: row-resize;
}

.divider:hover {
  background: #007acc;
}

.divider:hover::after {
  content: '';
  position: absolute;
  background: rgba(0, 122, 204, 0.3);
}

.divider:not(.vertical-divider):hover::after {
  left: -2px;
  right: -2px;
  top: 0;
  bottom: 0;
}

.divider.vertical-divider:hover::after {
  top: -2px;
  bottom: -2px;
  left: 0;
  right: 0;
}

.viewer-panel {
  min-width: 0;
  min-height: 0;
  flex-shrink: 0;
  transition: width 0.3s ease, height 0.3s ease;
}

.error-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  background: rgba(40, 40, 45, 0.95);
  border: 1px solid #007acc;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 拖动时的全局样式 */
body.resizing {
  cursor: col-resize !important;
  user-select: none !important;
}

body.resizing-vertical {
  cursor: row-resize !important;
  user-select: none !important;
}
</style>
