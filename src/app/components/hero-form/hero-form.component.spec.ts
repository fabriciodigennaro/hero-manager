import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormComponent } from './hero-form.component';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const heroesServiceSpy = jasmine.createSpyObj(
      ['getHeroById', 'createHero', 'updateHero'],
      {
        hero$: new Subject<Hero | null>(),
      }
    );

    const activatedRouteSpy = jasmine.createSpyObj({
      snapshot: {
        params: {},
      },
    });

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
          useValue: activatedRouteSpy,
        },
        {
          provide: HeroesService,
          useValue: heroesServiceSpy,
        },
      ],
    });

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    mockHeroesService = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    mockActivatedRoute = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
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

  it('should mark name as invalid if length is under 3 chars', () => {
    component.form.setValue({ name: 'ab', description: '' });
    component.form.get('name')?.markAsTouched();
    expect(component.isInvalidField('name')).toBeTruthy();
  });

  it('should mark name as invalid if length is more than 20 chars', () => {
    component.form.setValue({ name: 'A big name here!!!!!!', description: '' });
    component.form.get('name')?.markAsTouched();
    expect(component.isInvalidField('name')).toBeTruthy();
  });

  it('should mark description as invalid if length is under 20 chars', () => {
    component.form.setValue({
      name: '',
      description: 'Description',
    });
    component.form.get('description')?.markAsTouched();
    expect(component.isInvalidField('description')).toBeTruthy();
  });

  it('should mark description as invalid if length is more than 500 chars', () => {
    const bigText = 'X'.repeat(501);
    component.form.setValue({ name: '', description: bigText });
    component.form.get('description')?.markAsTouched();
    expect(component.isInvalidField('description')).toBeTruthy();
  });

  it('should set is edit mode', () => {
    mockActivatedRoute.snapshot.params = { id: '1' };

    component.ngOnInit();

    expect(component.isEditMode).toBeTrue();
  });

  it('should set is create mode', () => {
    mockActivatedRoute.snapshot.params = {};

    component.ngOnInit();

    expect(component.isEditMode).toBeFalse();
  });

  it('should call update hero when in edit mode and form is valid', () => {
    component.isEditMode = true;
    component.heroId = 1;
    const expectedUpdatedHero: Hero = {
      id: 1,
      name: 'HeroName',
      description: 'This is a Hero description',
    };
    component.form.setValue({
      name: 'HeroName',
      description: 'This is a Hero description',
    });
    component.onSubmit();
    expect(mockHeroesService.updateHero).toHaveBeenCalledWith(
      expectedUpdatedHero
    );
  });

  it('should call create hero when in create mode and form is valid', () => {
    component.isEditMode = false;
    component.heroId = 0;
    const expectedHero: Hero = {
      id: 0,
      name: 'HeroName',
      description: 'This is a Hero description',
    };
    component.form.setValue({
      name: 'HeroName',
      description: 'This is a Hero description',
    });
    component.onSubmit();
    expect(mockHeroesService.createHero).toHaveBeenCalledWith(expectedHero);
  });

  it('should not call create hero if form is invalid', () => {
    component.isEditMode = false;
    component.form.setValue({ name: '', description: '' });
    component.onSubmit();
    expect(mockHeroesService.createHero).not.toHaveBeenCalled();
  });

  it('should not call edit hero if form is invalid', () => {
    component.isEditMode = true;
    component.form.setValue({ name: '', description: '' });
    component.onSubmit();
    expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
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
