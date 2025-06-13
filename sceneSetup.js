let scene;
let engine;

window.onload = function () {
  const canvas = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(engine);

  // Camera setup
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 20, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // Lighting
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Ground grid
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  const groundMat = new BABYLON.GridMaterial("grid", scene);
  groundMat.majorUnitFrequency = 10;
  groundMat.minorUnitVisibility = 0.3;
  groundMat.gridRatio = 1;
  ground.material = groundMat;

  // Handle resizing
  window.addEventListener("resize", () => engine.resize());

  // Start render loop
  engine.runRenderLoop(() => scene.render());
};


