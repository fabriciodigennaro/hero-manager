import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormComponent } from './hero-form.component';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      declarations: [HeroFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                id: 1,
              },
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with controls', () => {
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('description')).toBeTruthy();
  });

  it('should mark name and description as invalid if they are empty', () => {
    component.form.setValue({ name: '', description: '' });
    component.form.get('name')?.markAsTouched();
    component.form.get('description')?.markAsTouched();
    expect(component.isInvalidField('name')).toBeTruthy();
    expect(component.isInvalidField('description')).toBeTruthy();
  });

  it('should mark name as invalid if length is under 3 chars.', () => {
    component.form.setValue({ name: 'ab', description: '' });
    component.form.get('name')?.markAsTouched();
    expect(component.isInvalidField('name')).toBeTruthy();
  });

  it('should mark name as invalid if length is more than 20 chars.', () => {
    component.form.setValue({ name: 'A big name here!!!!!!', description: '' });
    component.form.get('name')?.markAsTouched();
    expect(component.isInvalidField('name')).toBeTruthy();
  });

  it('should mark desciption as invalid if length is under 20 chars.', () => {
    component.form.setValue({
      name: '',
      description: 'Description',
    });
    component.form.get('description')?.markAsTouched();
    expect(component.isInvalidField('description')).toBeTruthy();
  });

  it('should mark description as invalid if length is more than 100 chars.', () => {
    const bigText =
      'Silent shadows, heroes rise, whispers of courage echoing in the night, their 101 hearts ablaze with undying light.';
    component.form.setValue({ name: '', description: bigText });
    component.form.get('description')?.markAsTouched();
    expect(component.isInvalidField('description')).toBeTruthy();
  });

  it('should call editHero() when in edit mode and form is valid', () => {
    spyOn<any>(component, 'editHero').and.callThrough();
    component.isEditMode = true;
    component.form.setValue({
      name: 'HeroName',
      description: 'This is a Hero description',
    });
    component.onSubmit();
    expect(component['editHero']).toHaveBeenCalled();
  });

  it('should call createHero() when in create mode and form is valid', () => {
    spyOn<any>(component, 'createHero').and.callThrough();
    component.isEditMode = false;
    component.form.setValue({
      name: 'HeroName',
      description: 'This is a Hero description',
    });
    component.onSubmit();
    expect(component['createHero']).toHaveBeenCalled();
  });

  it('should not call editHero() or createHero() if form is invalid', () => {
    spyOn<any>(component, 'editHero');
    spyOn<any>(component, 'createHero');
    component.form.setValue({ name: '', description: '' });
    component.onSubmit();
    expect(component['editHero']).not.toHaveBeenCalled();
    expect(component['createHero']).not.toHaveBeenCalled();
  });

  it('should redirect to the dashboard after form submission', () => {
    spyOn(component, 'redirectToDashboard');
    component.form.setValue({
      name: 'HeroName',
      description: 'This is a Hero description',
    });
    component.onSubmit();
    expect(component.redirectToDashboard).toHaveBeenCalled();
  });
});
