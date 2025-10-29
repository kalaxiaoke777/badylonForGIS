<template>
    <div class="monaco-editor-container">
        <div class="editor-toolbar">
            <button @click="resetCode" class="btn btn-secondary">重置</button>
            <button @click="runCode" class="btn btn-primary">运行</button>
        </div>
        <div ref="editorContainer" class="editor"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
    defaultCode: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'javascript'
    }
})

const emit = defineEmits(['run'])

const editorContainer = ref(null)
let editor = null
const originalCode = ref(props.defaultCode)

onMounted(() => {
    if (editorContainer.value) {
        editor = monaco.editor.create(editorContainer.value, {
            value: props.defaultCode,
            language: props.language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            scrollBeyondLastLine: false
        })
    }
})

onBeforeUnmount(() => {
    if (editor) {
        editor.dispose()
    }
})

watch(() => props.defaultCode, (newCode) => {
    if (editor && newCode) {
        editor.setValue(newCode)
        originalCode.value = newCode
    }
})

const resetCode = () => {
    if (editor) {
        editor.setValue(originalCode.value)
    }
}

const runCode = () => {
    if (editor) {
        const code = editor.getValue()
        emit('run', code)
    }
}

defineExpose({
    getCode: () => editor?.getValue() || '',
    setCode: (code) => editor?.setValue(code)
})
</script>

<style scoped>
.monaco-editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #1e1e1e;
}

.editor-toolbar {
    display: flex;
    gap: 10px;
    padding: 10px;
    background: #252526;
    border-bottom: 1px solid #3e3e42;
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

.btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.btn-primary {
    background: #007acc;
    color: white;
}

.btn-primary:hover {
    background: #005a9e;
}

.btn-secondary {
    background: #3e3e42;
    color: white;
}

.btn-secondary:hover {
    background: #4e4e52;
}

.editor {
    flex: 1;
    min-height: 0;
}
</style>
