import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TreeModule as Ng2TreeModule } from 'shared/tree/tree.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CodeNodeComponent } from './code-node/code-node.component';
import { AppService } from './app.service';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { AstViewComponent } from './ast-view/ast-view.component';
import { DetailViewComponent } from './detail-view/detail-view.component';


@NgModule({
  declarations: [
    AppComponent,
    CodeNodeComponent,
    EditorViewComponent,
    AstViewComponent,
    DetailViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    Ng2TreeModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
