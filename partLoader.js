window.loadPart = function (fileName) {
  BABYLON.SceneLoader.ImportMesh("", "./glb_images/", fileName, scene, (meshes) => {
    const root = meshes[0];
    root.position = new BABYLON.Vector3(0, 0.5, 0);
    addDragBehavior(root);
  }, null, (scene, message) => {
    console.error("Error loading model:", message);
  });
};

