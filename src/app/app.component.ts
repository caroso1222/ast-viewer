import { CodeSelection } from 'shared/models/code-selection';
import { Ng2TreeSettings } from './../shared/tree/tree.types';
import { AppService } from './app.service';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import * as ts from 'typescript';

const BLACKLIST = ['parent', '_children'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  nodes = {};


  @ViewChild('tree')
  tree;

  extended = true;

  activePanel: 'editor' | 'nodes' | 'props' = 'editor';

  @ViewChild('treeWrapper')
  treeWrapper;

  @ViewChild('textarea')
  textarea: ElementRef;

  monaco = (window as any).monaco;

  nodeList = [];
  counter = 1;

  selectedNode: any = {};


  rootNode;

  monacoActive = true;

  propsTree;

  codeSelection: CodeSelection;

  initialCode;

  code;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.initialCode =
`import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular 5';

  ngOnInit() {
    let a = 2;
    if (a < 10) {
      this.sendData(a);
      window.alert();
    }
  }
}
`;
    this.appService.setTree(this.tree);
    this.appService.setTreeContainer(this.treeWrapper);

    this.onCodeUpdate(this.initialCode);
  }

  ngAfterViewInit() {
  }

  visit(node: ts.Node): ASTNode {
    const children = [];
    if (this.extended) {
      node.getChildren().forEach(_node => {
        children.push(this.visit(_node));
      });
    } else {
      ts.forEachChild(node, _node => {
        children.push(this.visit(_node));
      });
    }
    this.nodeList.push(node);
    const obj: ASTNode = {
      value: ts.SyntaxKind[node.kind],
      id: this.counter++,
      tsNode: node,
      settings: {
        rightMenu: false,
        static: true,
        cssClasses: {
          'expanded': 'fa fa-caret-down fa-white',
          'collapsed': 'fa fa-caret-right fa-white',
          'leaf': 'fa fa-circle fa-white',
          'empty': 'fa fa-caret-right disabled fa-white'
        }
      }
    };
    if (children.length) {
      obj.children = children;
    }
    return obj;
  }

  onCodeUpdate(code: string) {
    this.code = code;
    const a = ts.createSourceFile('_.ts', code, ts.ScriptTarget.Latest, true);
    this.nodes = this.visit(a);
    this.rootNode = this.nodes;
  }

  logEvent(evt) {
    this.selectedNode = this.nodeList[evt.node.id - 1];
    this.codeSelection = {
      startPos: this.selectedNode.pos,
      endPos: this.selectedNode.end
    };
  }

  onNodeClick(evt) {
    if (this.monacoActive) {
      const node = evt.node.node.tsNode as ts.Node;
      const children = this.visitPropNode(node);
      const root: any = {
        settings: {
          rightMenu: false,
          static: true,
          cssClasses: {
            'expanded': 'fa fa-caret-down fa-white',
            'collapsed': 'fa fa-caret-right fa-white',
            'leaf': 'fa fa-circle fa-white',
            'empty': 'fa fa-caret-right disabled fa-white'
          }
        },
        data: {
          key: ts.SyntaxKind[this.selectedNode.kind],
          kind: node.constructor.name
        }
      };
      if (children.length) {
        root.children = children;
      }
      this.propsTree = root;
      return root;
    }
  }


  visitPropNode(node): any {
    const keys = Object.keys(node)
      .filter(key => BLACKLIST.indexOf(key) === -1);
    const children = [];
    for (const key of keys) {
      let propValue = node[key];
      const newObj: any = {
        settings: {
          rightMenu: false,
          static: true,
          cssClasses: {
            'expanded': 'fa fa-caret-down fa-white',
            'collapsed': 'fa fa-caret-right fa-white',
            'leaf': 'fa fa-circle fa-white',
            'empty': 'fa fa-caret-right disabled fa-white'
          }
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


  onExtendedChange(evt) {
    this.onCodeUpdate(this.code);
  }
}

export interface ASTNode {
  value: string;
  children?: ASTNode[];
  id: number;
  settings: any;
  tsNode: ts.Node;
}

// http://mbostock.github.io/d3/talk/20110921/#21
