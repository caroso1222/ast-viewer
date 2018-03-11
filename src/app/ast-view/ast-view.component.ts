import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-ast-view',
  templateUrl: './ast-view.component.html',
  styleUrls: ['./ast-view.component.scss']
})
export class AstViewComponent {

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
