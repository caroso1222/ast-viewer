import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TreeModule as Ng2TreeModule } from '../shared/tree/tree.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CodeNodeComponent } from './code-node/code-node.component';


@NgModule({
  declarations: [
    AppComponent,
    CodeNodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2TreeModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
