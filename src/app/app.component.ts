import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as ts from 'typescript';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  nodes = [];
  code = '';
  @ViewChild('tree')
  tree: TreeNode;

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
    return {
      name: ts.SyntaxKind[node.kind],
      children
    };
  }

  initTree() {
    console.log(this.code);
    const a = ts.createSourceFile('_.ts', this.code, ts.ScriptTarget.Latest, /*setParentNodes */ true);
    this.nodes = [this.visit(a)];
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    });
  }
}

interface ASTNode {
  name: string;
  children?: ASTNode[];
}
