import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  private tree;

  private treeContainer;

  constructor() { }

  setTree(tree) {
    this.tree = tree;
  }

  setTreeContainer(container) {
    this.treeContainer = container;
  }

  selectNode(id) {
    const oopNodeController = this.tree.getControllerByNodeId(id);

    if (oopNodeController) {
      oopNodeController.select();
      const el = oopNodeController.component.nodeElementRef.nativeElement;
      const offsetTop = el.offsetTop;
      this.treeContainer.nativeElement.scrollTop = offsetTop - 200;
    }
  }

}
