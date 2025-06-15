// let scene, engine;

// window.onload = function () {
//   const canvas = document.getElementById("renderCanvas");
//   engine = new BABYLON.Engine(canvas, true, { antialias: true });
//   scene = new BABYLON.Scene(engine);

//   // Enhanced Camera
//   const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
//   camera.attachControl(canvas, true);
//   camera.setTarget(BABYLON.Vector3.Zero());
//   camera.lowerRadiusLimit = 5;
//   camera.upperRadiusLimit = 50;

//   // Enhanced Lighting
//   const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
//   light.intensity = 0.8;
  
//   const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -1, -1), scene);
//   dirLight.intensity = 0.4;
//   dirLight.position = new BABYLON.Vector3(20, 40, 20);

//   // Professional Ground with Grid
//   const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
//   const groundMat = new BABYLON.GridMaterial("grid", scene);
//   groundMat.majorUnitFrequency = 5;
//   groundMat.minorUnitVisibility = 0.45;
//   groundMat.gridRatio = 1;
//   groundMat.mainColor = new BABYLON.Color3(0.9, 0.9, 0.9);
//   groundMat.lineColor = new BABYLON.Color3(0.7, 0.7, 0.7);
//   groundMat.opacity = 0.8;
//   ground.material = groundMat;

//   // Setup pointer selection
//   setupPointerSelection(scene);

//   window.addEventListener("resize", () => engine.resize());
//   engine.runRenderLoop(() => scene.render());
// };

// sceneSetup.js - Enhanced scene setup for Smart Home Simulator
let scene, engine;

window.onload = function () {
  const canvas = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas, true, { antialias: true });
  scene = new BABYLON.Scene(engine);

  // Enhanced Camera
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 50;

  // Enhanced Lighting
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.8;
  
  const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -1, -1), scene);
  dirLight.intensity = 0.4;
  dirLight.position = new BABYLON.Vector3(20, 40, 20);

  // Professional Ground with Grid
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  const groundMat = new BABYLON.GridMaterial("grid", scene);
  groundMat.majorUnitFrequency = 5;
  groundMat.minorUnitVisibility = 0.45;
  groundMat.gridRatio = 1;
  groundMat.mainColor = new BABYLON.Color3(0.9, 0.9, 0.9);
  groundMat.lineColor = new BABYLON.Color3(0.7, 0.7, 0.7);
  groundMat.opacity = 0.8;
  ground.material = groundMat;

  // Setup pointer selection
  setupPointerSelection(scene);

  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
};