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

  @ViewChild('textarea')
  textarea: ElementRef;

  nodeList = [];
  counter = 0;

  selectedNode: any = {};

  ngOnInit() {
    console.log(this.tree);
    this.code = 'let x: string  = \'string\'';
    this.initTree();
  }

  ngAfterViewInit() {
  }

  visit(node: ts.Node): ASTNode {
    const children = [];
    node.getChildren().forEach(_node => {
      children.push(this.visit(_node));
    });
    this.nodeList.push(node);
    return {
      value: ts.SyntaxKind[node.kind],
      children,
      id: this.counter++
    };
  }

  initTree() {
    console.log(this.code);
    const a = ts.createSourceFile('_.ts', this.code, ts.ScriptTarget.Latest, /*setParentNodes */ true);
    this.nodes = this.visit(a);
    // setTimeout(() => {
    //   this.tree.treeModel.expandAll();
    // });
    console.log(this.nodes);
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
    this.selectedNode.kind = ts.SyntaxKind[this.selectedNode.kind];
    this.createSelection(this.selectedNode.pos, this.selectedNode.end);
  }

  createSelection(start, end) {
    const field = this.textarea.nativeElement;
    if (field.createTextRange ) {
      const selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end);
      selRange.select();
      field.focus();
    } else if (field.setSelectionRange ) {
      field.focus();
      field.setSelectionRange(start, end);
    } else if (typeof field.selectionStart !== 'undefined' ) {
      field.selectionStart = start;
      field.selectionEnd = end;
      field.focus();
    }
  }
}

interface ASTNode {
  value: string;
  children?: ASTNode[];
  id: number;
}
