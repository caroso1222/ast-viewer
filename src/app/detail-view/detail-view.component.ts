import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import * as ts from 'typescript';

/**
 * List of properties that the recursion algorithm must not visit
 * to avoid loops
 */
const BLACKLIST = ['parent', '_children'];

/**
 * CSS classes assigned to the prop tree
 */
const TREE_CSS_CLASSES = {
  'expanded': 'fas fa-caret-down fa-white',
  'collapsed': 'fas fa-caret-right fa-white',
  'leaf': 'fas fa-circle fa-white',
  'empty': 'fas fa-caret-right disabled fa-white'
};

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailViewComponent {

  /**
   * Local cache of the node whose attributes will be rendered
   */
  private _node;

  /**
   * Node whose attributes will be rendered
   */
  @Input()
  set node(node) {
    if (node) {
      const children = this.visitPropNode(node);
      const root: any = {
        settings: {
          rightMenu: false,
          static: true,
          cssClasses: TREE_CSS_CLASSES
        },
        data: {
          key: ts.SyntaxKind[node.kind],
          kind: node.constructor.name
        }
      };
      if (children.length) {
        root.children = children;
      }
      this._node = root;
    }
  }

  get node() {
    return this._node;
  }

  /**
   * Returns an array of children with the properties ready
   * to be rendered in the property tree. This algorithm detects
   * what's the kind of the node, its value, etc, and transform it
   * into a more friendly object for the tree rendering
   * @param node - the node to visit
   */
  visitPropNode(node): any[] {
    const keys = Object.keys(node)
      .filter(key => BLACKLIST.indexOf(key) === -1);
    const children = [];
    for (const key of keys) {
      let propValue = node[key];
      const newObj: any = {
        settings: {
          rightMenu: false,
          static: true,
          cssClasses: TREE_CSS_CLASSES
        },
        data: { key }
      };
      if (typeof propValue === 'object') {
        newObj.data.kind = propValue.constructor.name;
        if (propValue.length) {
          newObj.data.kind = `Array(${propValue.length})`;
          newObj.data.type = 'array';
        }
        if (!isNaN(key as any)) {
          newObj.data.kind = ts.SyntaxKind[propValue.kind];
        }
        children.push(newObj);
        const _children = this.visitPropNode(propValue);
        if (_children.length) {
          newObj.children = _children;
        }
      } else {
        if (propValue) {
          newObj.data.type = typeof propValue;
          if (typeof propValue === 'string') {
            propValue = `'${propValue}'`;
          }
          if (key === 'kind') {
            newObj.data.kind = ts.SyntaxKind[propValue];
          }
          newObj.data.propValue = propValue;
          children.push(newObj);
        }
      }
    }
    return children;
  }
}
