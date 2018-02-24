import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TreeModule as Ng2TreeModule } from 'ng2-tree';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
