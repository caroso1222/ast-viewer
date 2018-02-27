import { Component, OnInit, Input, ViewEncapsulation, HostBinding } from '@angular/core';
import * as ts from 'typescript';

@Component({
  selector: 'code-node',
  templateUrl: './code-node.component.html',
  styleUrls: ['./code-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'code-node' }
})
export class CodeNodeComponent implements OnInit {

  @Input()
  node;

  children = [];

  newLines = [];

  @HostBinding('class.code-node--leaf')
  _isLeaf = false;

  constructor() { }

  ngOnInit() {
    this.node.getChildren().forEach(_node => {
      this.children.push(_node);
    });
    this._isLeaf = this.isLeaf(this.node);
  }

  isLeaf(node) {
    return this.children.length === 0;
  }

  getNodeText() {
    return this.node.getFullText().replace(/\n/g, '');
  }

  getNumNewLines() {
    return this.node.getFullText().match(/\n/g) || [];
  }

}
