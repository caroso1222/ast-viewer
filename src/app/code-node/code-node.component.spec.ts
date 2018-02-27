import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeNodeComponent } from './code-node.component';

describe('CodeNodeComponent', () => {
  let component: CodeNodeComponent;
  let fixture: ComponentFixture<CodeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
