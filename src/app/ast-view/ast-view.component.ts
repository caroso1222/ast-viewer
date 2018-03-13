import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { AppService } from '../app.service';
import { TreeComponent } from 'shared/tree/tree.component';

@Component({
  selector: 'app-ast-view',
  templateUrl: './ast-view.component.html',
  styleUrls: ['./ast-view.component.scss']
})
export class AstViewComponent implements OnInit {

  /**
   * Reference to the tree component
   */
  @ViewChild('tree')
  tree: TreeComponent;

  /**
   * Element ref to the tree container
   */
  @ViewChild('treeWrapper')
  treeWrapper: ElementRef;

  /**
   * Whether or not the extended view is enabled
   */
  extended = true;

  /**
   * Event emitted when the extended checkbox mutates
   */
  @Output()
  extendedChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Root node of the AST tree
   */
  @Input()
  rootNode;

  /**
   * Event emitted when a node is hovered
   */
  @Output()
  nodeHover: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted when a node is clicked
   */
  @Output()
  nodeClick: EventEmitter<any> = new EventEmitter();

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.setTree(this.tree);
    this.appService.setTreeContainer(this.treeWrapper);
  }

  /**
   * Callback fired when extended checkbox changes
   */
  onExtendedChange() {
    this.extendedChange.next(this.extended);
  }

  /**
   * Method called when a tree node is hovered
   * @param node - the hovered node
   */
  onNodeHover(node) {
    this.nodeHover.next(node);
  }

  /**
   * Method called when a tree node is clicked
   * @param node - the clicked node
   */
  onNodeClick(node) {
    this.nodeClick.next(node);
  }

}
