import { AppService } from './../app.service';
import { Component, OnInit, Input, ViewEncapsulation, HostBinding, HostListener } from '@angular/core';
import * as ts from 'typescript';
import * as _ts from 'typescript-compiler';
import { ASTNode } from '../app.component';
// import { isStartOfExpression } from 'typescript';

@Component({
  selector: 'code-node',
  templateUrl: './code-node.component.html',
  styleUrls: ['./code-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'code-node' }
})
export class CodeNodeComponent implements OnInit {

  @Input()
  node: ASTNode;

  children = [];

  newLines = [];

  @HostBinding('class.code-node--leaf')
  _isLeaf = false;

  constructor(private appService: AppService) { }

  ngOnInit() {
    if (this.node.children) {
      this.node.children.forEach(_node => {
        this.children.push(_node);
      });
    }
    this._isLeaf = this.isLeaf();
  }

  isLeaf() {
    return this.children.length === 0;
  }

  @HostListener('mouseover')
  onNodeHover() {
    if (this._isLeaf) {
      this.appService.selectNode(this.node.id);
    }
  }

  getNodeText() {
    return this.node.tsNode.getFullText().replace(/\n/g, '');
  }

  getNumNewLines() {
    return this.node.tsNode.getFullText().match(/\n/g) || [];
  }

  getClass() {
    if (ts.isStringLiteral(this.node.tsNode)) {
      return 'mtk5';
    } else if (this.node.tsNode.kind >= 72 && this.node.tsNode.kind <= 142) {
      return 'mtk8';
    } else if (ts.isNumericLiteral(this.node.tsNode)) {
      return 'mtk6';
    } else {
      return 'mtk1';
    }
  }

}
