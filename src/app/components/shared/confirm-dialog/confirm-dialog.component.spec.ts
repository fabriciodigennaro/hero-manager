import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: MatDialogRef<ConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj(['close']);

    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on "Cancel" button click', () => {
    component.onClickNo();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog on "Delete" button click', () => {
    const deleteButton = fixture.debugElement.nativeElement.querySelector(
      '.buttons button[color="accent"]'
    );
    deleteButton.click();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display the correct message in the dialog', () => {
    const testMessage = 'Any Question message?';
    component.message = testMessage;
    fixture.detectChanges();
    const dialogContent = fixture.debugElement.nativeElement.querySelector(
      '.dialog-container p'
    );
    expect(dialogContent.textContent).toContain(testMessage);
  });
});
