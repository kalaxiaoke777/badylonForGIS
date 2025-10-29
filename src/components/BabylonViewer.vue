<template>
    <div class="babylon-container">
        <div class="babylon-toolbar">
            <h3>Babylon.js 预览</h3>
            <button @click="resetCamera" class="btn btn-secondary">重置相机</button>
        </div>
        <canvas ref="renderCanvas" class="render-canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as BABYLON from '@babylonjs/core'

const renderCanvas = ref(null)
let engine = null
let scene = null
let camera = null

const emit = defineEmits(['ready'])

onMounted(() => {
    initBabylon()
})

onBeforeUnmount(() => {
    if (engine) {
        engine.dispose()
    }
})

const initBabylon = () => {
    if (!renderCanvas.value) return

    // 创建引擎
    engine = new BABYLON.Engine(renderCanvas.value, true, {
        preserveDrawingBuffer: true,
        stencil: true
    })

    // 创建场景
    scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.15, 1)

    // 创建相机
    camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 3,
        10,
        BABYLON.Vector3.Zero(),
        scene
    )
    camera.attachControl(renderCanvas.value, true)
    camera.lowerRadiusLimit = 2
    camera.upperRadiusLimit = 20

    // 创建灯光
    const light1 = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 0),
        scene
    )
    light1.intensity = 0.7

    const light2 = new BABYLON.DirectionalLight(
        'light2',
        new BABYLON.Vector3(-1, -2, -1),
        scene
    )
    light2.intensity = 0.5

    // 创建默认场景
    createDefaultScene()

    // 渲染循环
    engine.runRenderLoop(() => {
        scene.render()
    })

    // 响应式调整
    window.addEventListener('resize', () => {
        engine.resize()
    })

    // 通知父组件场景已准备好
    emit('ready', { scene, engine, camera })
}

const createDefaultScene = () => {
    // 创建地面
    const ground = BABYLON.MeshBuilder.CreateGround(
        'ground',
        { width: 10, height: 10 },
        scene
    )
    const groundMaterial = new BABYLON.StandardMaterial('groundMat', scene)
    groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35)
    ground.material = groundMaterial

    // 创建一个示例球体
    const sphere = BABYLON.MeshBuilder.CreateSphere(
        'sphere',
        { diameter: 2 },
        scene
    )
    sphere.position.y = 1

    const sphereMaterial = new BABYLON.StandardMaterial('sphereMat', scene)
    sphereMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.7, 1)
    sphereMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)
    sphere.material = sphereMaterial
}

const resetCamera = () => {
    if (camera) {
        camera.alpha = -Math.PI / 2
        camera.beta = Math.PI / 3
        camera.radius = 10
        camera.target = BABYLON.Vector3.Zero()
    }
}

const clearScene = () => {
    if (scene) {
        // 保留相机和灯光，移除其他物体
        const meshes = scene.meshes.slice()
        meshes.forEach(mesh => {
            mesh.dispose()
        })
    }
}

const executeCode = (code) => {
    try {
        clearScene()

        // 创建一个安全的执行环境
        const func = new Function('scene', 'BABYLON', 'camera', 'engine', code)
        func(scene, BABYLON, camera, engine)

        return { success: true }
    } catch (error) {
        console.error('代码执行错误:', error)
        return { success: false, error: error.message }
    }
}

defineExpose({
    executeCode,
    clearScene,
    resetCamera,
    getScene: () => scene,
    getEngine: () => engine,
    getCamera: () => camera
})
</script>

<style scoped>
.babylon-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #1a1a1f;
}

.babylon-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #252526;
    border-bottom: 1px solid #3e3e42;
}

.babylon-toolbar h3 {
    margin: 0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
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

.btn-secondary {
    background: #3e3e42;
    color: white;
}

.btn-secondary:hover {
    background: #4e4e52;
    transform: translateY(-1px);
}

.render-canvas {
    flex: 1;
    width: 100%;
    outline: none;
    touch-action: none;
}
</style>
