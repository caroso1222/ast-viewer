import { CodeSelection } from 'shared/models/code-selection';
import { Ng2TreeSettings } from './../shared/tree/tree.types';
import { AppService } from './app.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as ts from 'typescript';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

  detailNode;

  monacoActive = true;

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

  onASTNodeHover(evt) {
    this.selectedNode = this.nodeList[evt.node.id - 1];
    this.codeSelection = {
      startPos: this.selectedNode.pos,
      endPos: this.selectedNode.end
    };
  }

  onASTNodeClick(evt) {
    if (this.monacoActive) {
      this.detailNode = evt.node.node.tsNode as ts.Node;
    }
  }


  onExtendedChange(evt) {
    this.extended = evt;
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
