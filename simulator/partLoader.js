// Enhanced Part Loader with proper container system
window.loadPart = function (fileName) {
  showLoading();
  
  BABYLON.SceneLoader.ImportMesh("", "../glb_images/", fileName, scene, (meshes) => {
    hideLoading();
    
    if (meshes.length === 0) {
      console.error("No meshes loaded from file:", fileName);
      return;
    }

    const root = meshes[0];
    
    // Create a container for better transformation handling
    const container = new BABYLON.TransformNode("container_" + Date.now(), scene);
    container.position = new BABYLON.Vector3(0, 0.5, 0);
    
    // Parent all loaded meshes to the container
    meshes.forEach(mesh => {
      if (mesh.parent === null) {
        mesh.setParent(container);
      }
    });

    addDragBehavior(container, meshes[0]);
    updateComponentCount();
    
  }, null, (scene, message) => {
    hideLoading();
    console.error("Error loading model:", message);
    alert("Failed to load component: " + fileName);
  });
};

// UI Helper Functions
function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

function updateComponentCount() {
  document.getElementById("componentCount").textContent = `Components: ${allParts.length}`;
}