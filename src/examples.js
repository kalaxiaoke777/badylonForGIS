// 示例代码集合

export const examples = {
  basic: {
    title: "基础场景 - 旋转的立方体",
    code: `// 创建一个旋转的立方体
const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene);
box.position.y = 1;

// 创建材质
const material = new BABYLON.StandardMaterial('boxMat', scene);
material.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
box.material = material;

// 添加旋转动画
scene.registerBeforeRender(() => {
  box.rotation.y += 0.01;
  box.rotation.x += 0.005;
});

// 创建地面
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
ground.material = groundMat;`,
  },

  multiple: {
    title: "多个几何体",
    code: `// 创建多个不同的几何体
const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1.5 }, scene);
sphere.position = new BABYLON.Vector3(-2, 1, 0);

const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1.5 }, scene);
box.position = new BABYLON.Vector3(0, 1, 0);

const cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 2, diameter: 1 }, scene);
cylinder.position = new BABYLON.Vector3(2, 1, 0);

// 为每个物体创建不同的材质
const sphereMat = new BABYLON.StandardMaterial('sphereMat', scene);
sphereMat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
sphere.material = sphereMat;

const boxMat = new BABYLON.StandardMaterial('boxMat', scene);
boxMat.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
box.material = boxMat;

const cylinderMat = new BABYLON.StandardMaterial('cylinderMat', scene);
cylinderMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 1);
cylinder.material = cylinderMat;

// 添加动画
scene.registerBeforeRender(() => {
  sphere.rotation.y += 0.02;
  box.rotation.x += 0.01;
  cylinder.rotation.z += 0.015;
});

// 地面
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
ground.material = groundMat;`,
  },

  lighting: {
    title: "光照效果",
    code: `// 创建一个球体
const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);
sphere.position.y = 1;

// 创建 PBR 材质（基于物理的渲染）
const pbr = new BABYLON.PBRMetallicRoughnessMaterial('pbr', scene);
pbr.baseColor = new BABYLON.Color3(1, 0.8, 0.2);
pbr.metallic = 0.8;
pbr.roughness = 0.2;
sphere.material = pbr;

// 创建多个点光源
const colors = [
  new BABYLON.Color3(1, 0, 0),
  new BABYLON.Color3(0, 1, 0),
  new BABYLON.Color3(0, 0, 1)
];

colors.forEach((color, index) => {
  const light = new BABYLON.PointLight(
    'light' + index,
    new BABYLON.Vector3(
      3 * Math.cos((index * Math.PI * 2) / 3),
      2,
      3 * Math.sin((index * Math.PI * 2) / 3)
    ),
    scene
  );
  light.diffuse = color;
  light.intensity = 2;
  
  // 创建光源标记
  const lightSphere = BABYLON.MeshBuilder.CreateSphere('ls' + index, { diameter: 0.2 }, scene);
  lightSphere.position = light.position;
  const mat = new BABYLON.StandardMaterial('lsMat' + index, scene);
  mat.emissiveColor = color;
  lightSphere.material = mat;
});

// 地面
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
ground.material = groundMat;`,
  },

  animation: {
    title: "弹跳动画",
    code: `// 创建多个弹跳的球体
const sphereCount = 5;
const spheres = [];

for (let i = 0; i < sphereCount; i++) {
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    'sphere' + i,
    { diameter: 0.8 },
    scene
  );
  
  sphere.position.x = (i - sphereCount / 2) * 1.5;
  sphere.position.y = 0.4;
  
  const material = new BABYLON.StandardMaterial('mat' + i, scene);
  material.diffuseColor = new BABYLON.Color3(
    Math.random(),
    Math.random(),
    Math.random()
  );
  sphere.material = material;
  
  // 为每个球体添加自定义属性
  sphere.velocity = 0;
  sphere.delay = i * 0.2;
  sphere.time = 0;
  
  spheres.push(sphere);
}

// 动画循环
scene.registerBeforeRender(() => {
  const deltaTime = engine.getDeltaTime() / 1000;
  
  spheres.forEach(sphere => {
    sphere.time += deltaTime;
    
    if (sphere.time > sphere.delay) {
      const gravity = -9.8;
      sphere.velocity += gravity * deltaTime;
      sphere.position.y += sphere.velocity * deltaTime;
      
      // 碰撞检测
      if (sphere.position.y <= 0.4) {
        sphere.position.y = 0.4;
        sphere.velocity = -sphere.velocity * 0.8; // 能量损失
      }
    }
  });
});

// 地面
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
ground.material = groundMat;`,
  },

  particles: {
    title: "粒子系统",
    code: `// 创建一个发射器
const emitter = BABYLON.MeshBuilder.CreateSphere('emitter', { diameter: 0.5 }, scene);
emitter.position.y = 0.5;
const emitterMat = new BABYLON.StandardMaterial('emitterMat', scene);
emitterMat.emissiveColor = new BABYLON.Color3(1, 0.5, 0);
emitter.material = emitterMat;

// 创建粒子系统
const particleSystem = new BABYLON.ParticleSystem('particles', 2000, scene);

// 设置粒子纹理（使用内置纹理）
particleSystem.particleTexture = new BABYLON.Texture(
  'https://www.babylonjs-playground.com/textures/flare.png',
  scene
);

// 粒子发射位置
particleSystem.emitter = emitter;
particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);

// 颜色设置
particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
particleSystem.color2 = new BABYLON.Color4(1, 0.8, 0, 1);
particleSystem.colorDead = new BABYLON.Color4(0.5, 0.2, 0, 0);

// 粒子大小
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.3;

// 粒子生命周期
particleSystem.minLifeTime = 0.5;
particleSystem.maxLifeTime = 1.5;

// 发射速率
particleSystem.emitRate = 300;

// 混合模式
particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

// 重力
particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);

// 方向
particleSystem.direction1 = new BABYLON.Vector3(-1, 3, -1);
particleSystem.direction2 = new BABYLON.Vector3(1, 3, 1);

// 速度
particleSystem.minEmitPower = 2;
particleSystem.maxEmitPower = 4;
particleSystem.updateSpeed = 0.01;

// 启动粒子系统
particleSystem.start();

// 让发射器旋转
scene.registerBeforeRender(() => {
  emitter.rotation.y += 0.02;
});

// 地面
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15);
ground.material = groundMat;`,
  },
};

export const defaultExample = examples.basic;
