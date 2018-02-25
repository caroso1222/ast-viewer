import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as ts from 'typescript';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    console.log(code);
    const a = ts.createSourceFile('_.ts', code, ts.ScriptTarget.Latest, /*setParentNodes */ true);
    this.nodes = this.visit(a);
  }

  logEvent(evt) {
    console.log(evt);
    this.selectedNode = this.nodeList[evt.node.id];
    console.log(this.selectedNode);
    delete this.selectedNode.parent;
    delete this.selectedNode._children;
    delete this.selectedNode.name;
    delete this.selectedNode.initializer;
    delete this.selectedNode.declarations;
    delete this.selectedNode.type;
    delete this.selectedNode.expression;
    delete this.selectedNode.thenStatement;
    delete this.selectedNode.statements;
    delete this.selectedNode.declarationList;
    this.selectedNode.kind = ts.SyntaxKind[this.selectedNode.kind];
    this.createSelection(this.selectedNode.pos, this.selectedNode.end);
  }

  onExtendedChange(evt) {
    console.log(evt.target.checked);
    this.initTree(this.code);
  }

  createSelection(start, end) {
    console.log(start, end);
  }

  onEditorInit(editor: any) {
    (window as any).monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
    console.log(editor);
    editor.deltaDecorations([], [
      { range: new (window as any).monaco.Range(5, 7, 6, 10), options: { inlineClassName: 'myInlineDecoration' }},
    ]);
  }
}

interface ASTNode {
  value: string;
  children?: ASTNode[];
  id: number;
}
