import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasxclienteComponent } from './facturasxcliente.component';

describe('FacturasxclienteComponent', () => {
  let component: FacturasxclienteComponent;
  let fixture: ComponentFixture<FacturasxclienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturasxclienteComponent]
    });
    fixture = TestBed.createComponent(FacturasxclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
