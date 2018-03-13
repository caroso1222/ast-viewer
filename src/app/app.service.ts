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
      this.scrollTo(
        this.treeContainer.nativeElement,
        offsetTop - 200,
        150
      );
    }
  }

  scrollTo(element, to, duration) {
    const start = element.scrollTop,
      change = to - start,
      increment = 20;

    let currentTime = 0;
    const animateScroll = () => {
      currentTime += increment;
      const val = this.linear(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  linear = function (t, b, c, d) {
    return (t /= d) * c + b;
  };

}
