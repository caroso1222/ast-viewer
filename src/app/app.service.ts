import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  private tree;

  constructor() { }

  setTree(tree) {
    this.tree = tree;
  }

  selectNode(id) {
    const oopNodeController = this.tree.getControllerByNodeId(id);
    oopNodeController.select();
  }

}
