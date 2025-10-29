<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🎮 BabylonSDK代码演示平台</h1>
      <div class="example-selector">
        <label>选择示例：</label>
        <select v-model="selectedExample" @change="loadExample">
          <option v-for="(example, key) in examples" :key="key" :value="key">
            {{ example.title }}
          </option>
        </select>
      </div>
    </header>

    <div class="main-content">
      <div class="editor-panel">
        <MonacoEditor ref="editorRef" :defaultCode="currentCode" language="javascript" @run="handleRunCode" />
      </div>

      <div class="divider"></div>

      <div class="viewer-panel">
        <BabylonViewer ref="viewerRef" @ready="handleBabylonReady" />
      </div>
    </div>

    <div v-if="errorMessage" class="error-toast">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import BabylonViewer from './components/BabylonViewer.vue'
import { examples, defaultExample } from './examples.js'

const editorRef = ref(null)
const viewerRef = ref(null)
const selectedExample = ref('basic')
const currentCode = ref(defaultExample.code)
const errorMessage = ref('')

let babylonReady = false

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

onMounted(() => {
  // 页面加载完成后的初始化
  console.log('应用已加载')
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
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
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

.main-content {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.editor-panel {
  flex: 1;
  min-width: 0;
  height: 100%;
}

.divider {
  width: 4px;
  background: #3e3e42;
  cursor: col-resize;
  transition: background 0.2s;
}

.divider:hover {
  background: #007acc;
}

.viewer-panel {
  flex: 1;
  min-width: 0;
  height: 100%;
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
</style>
