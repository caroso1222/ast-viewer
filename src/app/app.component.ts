import { CodeSelection } from 'shared/models/code-selection';
import { Ng2TreeSettings } from 'shared/tree/tree.types';
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

  astRootNode;

  editorRootNode;

  detailNode;

  isEditorViewActive = true;

  codeSelection: CodeSelection;

  initialCode;

  code;

  extendedRootNode;

  collapsedRootNode;

  treeSwitchEnabled = true;

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

  visit(node: ts.Node, extended: boolean): ASTNode {
    const children = [];
    if (extended) {
      node.getChildren().forEach(_node => {
        children.push(this.visit(_node, extended));
      });
    } else {
      ts.forEachChild(node, _node => {
        children.push(this.visit(_node, extended));
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
          'expanded': 'fas fa-caret-down fa-white',
          'collapsed': 'fas fa-caret-right fa-white',
          'leaf': 'fas fa-circle fa-white',
          'empty': 'fas fa-caret-right disabled fa-white'
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
    this.extendedRootNode = this.getRootFromCode(code, true);
    this.editorRootNode = this.extendedRootNode;
    if (this.extended) {
      this.astRootNode = this.extendedRootNode;
      // now invalidate the current collapsed tree
      this.collapsedRootNode = undefined;
    } else {
      this.astRootNode = this.getRootFromCode(code, false);
      this.collapsedRootNode = this.astRootNode;
    }
  }

  private getRootFromCode(code: string, extended: boolean) {
    const a = ts.createSourceFile('_.ts', code, ts.ScriptTarget.Latest, true);
    return this.visit(a, extended);
  }

  onASTNodeHover(evt) {
    this.selectedNode = this.nodeList[evt.node.id - 1];
    this.codeSelection = {
      startPos: this.selectedNode.pos,
      endPos: this.selectedNode.end
    };
  }

  onASTNodeClick(evt) {
    const isClickEvt =  evt.node._evt.type === 'click';
    // This allow us to ignore hover events on the editor to show the props in the prop viewer
    if (this.isEditorViewActive || isClickEvt) {
      this.detailNode = evt.node.node.tsNode as ts.Node;
    }
  }

  onEditorViewChange(isEditorViewActive) {
    this.isEditorViewActive = isEditorViewActive;
    if (!this.isEditorViewActive) {
      // set the extended to true and the ast to extended
      this.onExtendedChange(true);
    }
    this.treeSwitchEnabled = this.isEditorViewActive;
  }


  onExtendedChange(evt) {
    this.extended = evt;
    if (this.extended) {
      this.astRootNode = this.extendedRootNode;
    } else {
      // if there's no collapsed tree yet, then compute it
      if (!this.collapsedRootNode) {
        this.collapsedRootNode = this.getRootFromCode(this.code, false);
      }
      this.astRootNode = this.collapsedRootNode;
    }
  }
}

export interface ASTNode {
  value: string;
  children?: ASTNode[];
  id: number;
  settings: any;
  tsNode: ts.Node;
}
