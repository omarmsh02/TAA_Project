// Enhanced dragLogic.js with rotation up/down, disconnect, delete, and 90-degree rotation
const allParts = [];
const undoStack = [];
const redoStack = [];
let selected = null;

// Enhanced Drag Behavior
function addDragBehavior(container, visualMesh) {
  allParts.push(container);

  // Add drag behavior to container
  const dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)
  });

  dragBehavior.useObjectOrientationForDragging = false;
  
  dragBehavior.onDragStartObservable.add(() => {
    // Visual feedback on drag start
    if (visualMesh && visualMesh.material) {
      visualMesh.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.8);
    }
  });

  dragBehavior.onDragEndObservable.add(() => {
    // Snap to grid
    container.position.x = Math.round(container.position.x);
    container.position.z = Math.round(container.position.z);
    
    // Reset visual feedback
    if (visualMesh && visualMesh.material) {
      visualMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    }
    
    checkAndConnectParts(container);
  });

  container.addBehavior(dragBehavior);
  container.isPickable = true;

  // Make sure child meshes are also pickable for selection
  container.getChildMeshes().forEach(mesh => {
    mesh.isPickable = true;
  });
}

// Enhanced Connection Logic
function checkAndConnectParts(mesh) {
  const threshold = 2.5;

  for (const other of allParts) {
    if (other !== mesh && !mesh.parent && !other.isDescendantOf(mesh)) {
      const distance = BABYLON.Vector3.Distance(mesh.position, other.position);
      if (distance < threshold) {
        // Create connection
        mesh.setParent(other);
        mesh.position = new BABYLON.Vector3(0, 0, 2); // Relative position
        
        // Visual feedback for connection
        showConnectionEffect(other.position);
        return;
      }
    }
  }
}

function eraseAll() {
  if (confirm("Are you sure you want to clear all components?")) {
    allParts.forEach(mesh => mesh.dispose());
    allParts.length = 0;
    undoStack.length = 0;
    redoStack.length = 0;
    selected = null;
    updateComponentCount();
    updateSelectionIndicator();
  }
}

// Enhanced Undo/Redo System
function undo() {
  if (allParts.length === 0) return;
  
  const mesh = allParts.pop();
  undoStack.push({
    mesh: mesh,
    position: mesh.position.clone(),
    rotation: mesh.rotation.clone()
  });
  
  mesh.setEnabled(false);
  updateComponentCount();
  
  if (selected === mesh) {
    selected = null;
    updateSelectionIndicator();
  }
}

function redo() {
  if (undoStack.length === 0) return;
  
  const item = undoStack.pop();
  item.mesh.position = item.position;
  item.mesh.rotation = item.rotation;
  item.mesh.setEnabled(true);
  allParts.push(item.mesh);
  updateComponentCount();
}

// Enhanced Rotation Functions - 90 DEGREE ROTATION
function rotateSelected(degrees) {
  if (!selected) {
    showMessage("No component selected");
    return;
  }

  // Apply rotation to the selected container
  selected.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(degrees), BABYLON.Space.LOCAL);
  
  // Visual feedback
  showRotationEffect(selected.position);
}

// NEW: Rotate Up/Down functions
function rotateSelectedUp() {
  if (!selected) {
    showMessage("No component selected");
    return;
  }

  // Rotate around X-axis (pitch up)
  selected.rotate(BABYLON.Axis.X, BABYLON.Tools.ToRadians(-90), BABYLON.Space.LOCAL);
  
  // Visual feedback
  showRotationEffect(selected.position);
}

function rotateSelectedDown() {
  if (!selected) {
    showMessage("No component selected");
    return;
  }

  // Rotate around X-axis (pitch down)
  selected.rotate(BABYLON.Axis.X, BABYLON.Tools.ToRadians(90), BABYLON.Space.LOCAL);
  
  // Visual feedback
  showRotationEffect(selected.position);
}

// NEW: Disconnect function
function disconnectSelected() {
  if (!selected) {
    showMessage("No component selected");
    return;
  }

  if (selected.parent && selected.parent !== scene) {
    // Store the world position before disconnecting
    const worldPosition = selected.getAbsolutePosition().clone();
    
    // Disconnect from parent
    selected.setParent(null);
    
    // Set the world position to maintain current position
    selected.position = worldPosition;
    
    showMessage("Component disconnected");
    showDisconnectionEffect(selected.position);
  } else {
    showMessage("Component is not connected to anything");
  }
}

// NEW: Delete selected component
function deleteSelected() {
  if (!selected) {
    showMessage("No component selected");
    return;
  }

  if (confirm("Are you sure you want to delete the selected component?")) {
    const index = allParts.indexOf(selected);
    if (index > -1) {
      // Show deletion effect before disposing
      showDeletionEffect(selected.position);
      
      // Remove from array
      allParts.splice(index, 1);
      
      // Dispose the mesh
      selected.dispose();
      
      // Clear selection
      selected = null;
      updateComponentCount();
      updateSelectionIndicator();
      
      showMessage("Component deleted");
    }
  }
}

// Enhanced Selection System
function setupPointerSelection(scene) {
  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN && pointerInfo.pickInfo.hit) {
      const picked = pointerInfo.pickInfo.pickedMesh;

      // Clear previous selection highlight
      clearSelectionHighlight();

      if (picked && picked.name !== "ground") {
        // Find the container (parent TransformNode)
        let target = picked;
        while (target.parent && !(target.parent instanceof BABYLON.Scene)) {
          if (target.parent instanceof BABYLON.TransformNode && target.parent.name.startsWith("container_")) {
            target = target.parent;
            break;
          }
          target = target.parent;
        }

        selected = target;
        highlightSelection(selected);
        updateSelectionIndicator();
      } else {
        selected = null;
        updateSelectionIndicator();
      }
    }
  });
}

// Visual Effects and UI Helper Functions
function updateSelectionIndicator() {
  const indicator = document.getElementById("selectionIndicator");
  if (selected) {
    indicator.textContent = `Selected: ${selected.name || 'Component'}`;
    indicator.style.background = "rgba(102, 126, 234, 0.95)";
    indicator.style.color = "white";
  } else {
    indicator.textContent = "No component selected";
    indicator.style.background = "rgba(255, 255, 255, 0.95)";
    indicator.style.color = "#2c3e50";
  }
}

function highlightSelection(mesh) {
  // Add selection outline effect
  mesh.getChildMeshes().forEach(childMesh => {
    if (childMesh.material) {
      childMesh.material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 1.0);
    }
  });
}

function clearSelectionHighlight() {
  if (selected) {
    selected.getChildMeshes().forEach(childMesh => {
      if (childMesh.material) {
        childMesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
      }
    });
  }
}

function showConnectionEffect(position) {
  // Create a temporary visual effect for connections
  const sphere = BABYLON.MeshBuilder.CreateSphere("connectionEffect", {diameter: 0.5}, scene);
  sphere.position = position.clone();
  sphere.position.y += 1;
  
  const material = new BABYLON.StandardMaterial("connectionMat", scene);
  material.emissiveColor = new BABYLON.Color3(0, 1, 0);
  sphere.material = material;
  
  // Animate and dispose
  BABYLON.Animation.CreateAndStartAnimation("scaleUp", sphere, "scaling", 30, 15, 
    new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(2, 2, 2), 0);
  
  setTimeout(() => {
    sphere.dispose();
  }, 500);
}

function showRotationEffect(position) {
  // Visual feedback for rotation
  const torus = BABYLON.MeshBuilder.CreateTorus("rotationEffect", {diameter: 3, thickness: 0.1}, scene);
  torus.position = position.clone();
  torus.position.y += 0.1;
  
  const material = new BABYLON.StandardMaterial("rotationMat", scene);
  material.emissiveColor = new BABYLON.Color3(1, 0.5, 0);
  material.alpha = 0.7;
  torus.material = material;
  
  BABYLON.Animation.CreateAndStartAnimation("fadeOut", material, "alpha", 30, 20, 0.7, 0, 0);
  
  setTimeout(() => {
    torus.dispose();
  }, 600);
}

// NEW: Disconnection effect
function showDisconnectionEffect(position) {
  const cylinder = BABYLON.MeshBuilder.CreateCylinder("disconnectEffect", {height: 2, diameter: 1}, scene);
  cylinder.position = position.clone();
  cylinder.position.y += 1;
  
  const material = new BABYLON.StandardMaterial("disconnectMat", scene);
  material.emissiveColor = new BABYLON.Color3(1, 1, 0);
  material.alpha = 0.8;
  cylinder.material = material;
  
  BABYLON.Animation.CreateAndStartAnimation("fadeOut", material, "alpha", 30, 20, 0.8, 0, 0);
  
  setTimeout(() => {
    cylinder.dispose();
  }, 600);
}

// NEW: Deletion effect
function showDeletionEffect(position) {
  const box = BABYLON.MeshBuilder.CreateBox("deleteEffect", {size: 2}, scene);
  box.position = position.clone();
  box.position.y += 1;
  
  const material = new BABYLON.StandardMaterial("deleteMat", scene);
  material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  material.alpha = 0.8;
  box.material = material;
  
  BABYLON.Animation.CreateAndStartAnimation("shrink", box, "scaling", 30, 15, 
    new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0.1, 0.1, 0.1), 0);
  
  setTimeout(() => {
    box.dispose();
  }, 500);
}

function showMessage(text) {
  // Simple message system
  console.log(text);
  
  // Optional: Show message in UI
  const indicator = document.getElementById("selectionIndicator");
  const originalText = indicator.textContent;
  indicator.textContent = text;
  indicator.style.background = "rgba(255, 193, 7, 0.95)";
  indicator.style.color = "black";
  
  setTimeout(() => {
    updateSelectionIndicator();
  }, 2000);
}

// Export functions to global scope
window.setupPointerSelection = setupPointerSelection;
window.eraseAll = eraseAll;
window.undo = undo;
window.redo = redo;
window.rotateSelected = rotateSelected;
window.rotateSelectedUp = rotateSelectedUp;
window.rotateSelectedDown = rotateSelectedDown;
window.disconnectSelected = disconnectSelected;
window.deleteSelected = deleteSelected;

// Enhanced Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  switch(e.key.toLowerCase()) {
    case "q":
      rotateSelected(-90); 
      break;
    case "e":
      rotateSelected(90);
      break;
    case "r":
      rotateSelectedUp();
      break;
    case "f":
      rotateSelectedDown();
      break;
    case "x":
      disconnectSelected();
      break;
    case "delete":
    case "backspace":
      deleteSelected();
      break;
    case "escape":
      selected = null;
      clearSelectionHighlight();
      updateSelectionIndicator();
      break;
  }
});