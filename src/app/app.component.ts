import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as ts from 'typescript';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  nodes = {};
  code = '';
  @ViewChild('tree')
  tree: TreeNode;
  extended = true;

  @ViewChild('textarea')
  textarea: ElementRef;

  monaco = (window as any).monaco;

  nodeList = [];
  counter = 0;
  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    minimap: { enabled: false }
  };

  selectedNode: any = {};

  cachedLinesLength = [];

  editor;

  decorations = [];

  rootNode;

  ngOnInit() {
    console.log(this.tree);
    this.code =
`import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
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
    this.initTree(this.code);
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
    const obj: any = {
      value: ts.SyntaxKind[node.kind],
      id: this.counter++
    };
    if (children.length) {
      obj.children = children;
    }
    return obj;
  }

  initTree(code) {
    this.cacheLines();
    const a = ts.createSourceFile('_.ts', code, ts.ScriptTarget.Latest, /*setParentNodes */ true);
    this.rootNode = a;
    this.nodes = this.visit(a);
  }

  cacheLines() {
    this.cachedLinesLength = this.code.split('\n').map(l => l.length + 1);
  }

  logEvent(evt) {
    this.selectedNode = this.nodeList[evt.node.id];
    // delete this.selectedNode.parent;
    // delete this.selectedNode._children;
    // delete this.selectedNode.name;
    // delete this.selectedNode.initializer;
    // delete this.selectedNode.declarations;
    // delete this.selectedNode.type;
    // delete this.selectedNode.expression;
    // delete this.selectedNode.thenStatement;
    // delete this.selectedNode.statements;
    // delete this.selectedNode.declarationList;
    // this.selectedNode.kind = ts.SyntaxKind[this.selectedNode.kind];
    this.createSelection(this.selectedNode.pos, this.selectedNode.end);
  }

  onExtendedChange(evt) {
    this.initTree(this.code);
  }

  createSelection(start, end) {
    const [initRow, initCol] = this.getLineCol(start);
    const [endRow, endCol] = this.getLineCol(end);
    this.selectText(initRow, initCol, endRow, endCol);
  }

  getLineCol(pos) {
    for (let i = 0; i < this.cachedLinesLength.length; i++) {
      if (this.cachedLinesLength[i] > pos) {
        return [i + 1, pos + 1];
      }
      pos -= this.cachedLinesLength[i];
    }
  }

  onEditorInit(editor: any) {
    this.editor = editor;
    (window as any).monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
    this.selectText(5, 7, 6, 10);
  }

  selectText(initRow, initCol, endRow, endCol) {
    this.decorations = this.editor.deltaDecorations(this.decorations, [
      {
        range: new (window as any).monaco.Range(initRow, initCol, endRow, endCol),
        options: {
          inlineClassName: 'myInlineDecoration'
        }
      },
    ]);
  }
}

interface ASTNode {
  value: string;
  children?: ASTNode[];
  id: number;
}

// http://mbostock.github.io/d3/talk/20110921/#21
