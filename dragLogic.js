function addDragBehavior(mesh) {
  const dragBehavior = new BABYLON.PointerDragBehavior({ 
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) 
  });
  dragBehavior.useObjectOrientationForDragging = false;
  dragBehavior.onDragEndObservable.add(() => {
    mesh.position.x = Math.round(mesh.position.x);
    mesh.position.z = Math.round(mesh.position.z);
  });
  mesh.addBehavior(dragBehavior);
}



