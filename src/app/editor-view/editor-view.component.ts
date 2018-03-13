import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { CodeSelection } from 'shared/models/code-selection';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {

  /**
   * Whether or not the monaco editor is active
   */
  isEditorEnabled = true;

  /**
   * Options for the Monaco editor
   */
  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    minimap: { enabled: false }
  };

  /**
   * Reference to the Monaco editor instance
   */
  editor;

  /**
   * A list of code decorations applied to Monaco. Mainly used to
   * highlight code.
   */
  decorations = [];

  /**
   * Source code rendered inside Monaco
   */
  code: string;

  /**
   * Event emitted when there's a code update inside the Monaco editor
   */
  @Output()
  codeUpdate: EventEmitter<string> = new EventEmitter();

  /**
   * Event emitted when there's a change from Inspector to Editor view
   */
  @Output()
  viewChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Code to render in component init
   */
  @Input()
  initialCode: string;

  /**
   * A cache used to store the number of characters per line of code.
   * It has the following form:
   * A = [1, 4, 6, 24, 1, 16], where A[i] represents the number of characters
   * in line i.
   */
  cachedLinesLength = [];

  /**
   * The root node of the tree used to render the fake code editor
   */
  @Input()
  rootNode;

  /**
   * Stream of code updation events
   */
  private codeUpdate$: Subject<string> = new Subject();

  /**
   * Represents a code snippet selection given its startPos and endPos
   */
  @Input()
  set codeSelection(selection: CodeSelection) {
    if (selection) {
      const [initRow, initCol] = this.getLineCol(selection.startPos);
      const [endRow, endCol] = this.getLineCol(selection.endPos);
      this.selectText(initRow, initCol, endRow, endCol);
    }
  }

  ngOnInit() {
    this.code = this.initialCode;
    this.cacheLines(this.code);
    this.codeUpdate$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(code => {
        this.codeUpdate.next(code);
      });
  }

  /**
   * Callback fired when Monaco is initialized
   * @param editor - editor instance
   */
  onEditorInit(editor: any) {
    this.editor = editor;

    // Disabled semantic and syntax validations in Monaco
    (window as any).monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
  }

  /**
   * Selects a text in the editor. The method should receive an initial and a final point.
   * Each point is defined by a tuple (row,col)
   * @param initRow - Start point row
   * @param initCol - Start point column
   * @param endRow - End point row
   * @param endCol - End point column
   */
  selectText(initRow: number, initCol: number, endRow: number, endCol: number) {
    this.decorations = this.editor.deltaDecorations(this.decorations, [
      {
        range: new (window as any).monaco.Range(initRow, initCol, endRow, endCol),
        options: {
          inlineClassName: 'monaco-highlight'
        }
      },
    ]);
  }

  /**
   * Method called from Monaco when there's a code update
   * @param code - new code
   */
  onCodeUpdate(code: string) {
    this.cacheLines(code);
    this.codeUpdate$.next(code);
  }

  /**
   * Returns the (row, col) tuple "coordinate" of a given absolute code
   * position. The absolute position is often obtained from the particular
   * AST node that should be visualized in the code.
   * @param pos - the absolute position within the code snippet
   */
  getLineCol(pos: number): [number, number] {
    for (let i = 0; i < this.cachedLinesLength.length; i++) {
      if (this.cachedLinesLength[i] > pos) {
        return [i + 1, pos + 1];
      }
      pos -= this.cachedLinesLength[i];
    }
    return [0, 0];
  }

  /**
   * Updates the lines length cache.
   * @param code - Monaco code
   */
  cacheLines(code: string) {
    this.cachedLinesLength = code.split('\n').map(l => l.length + 1);
  }

  /**
   * Switch between editor and inspector view
   */
  switchView() {
    this.isEditorEnabled = !this.isEditorEnabled;
    this.viewChange.next(this.isEditorEnabled);
  }

}
