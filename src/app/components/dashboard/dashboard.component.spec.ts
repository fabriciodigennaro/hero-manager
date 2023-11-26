import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { Hero } from 'src/app/interfaces/hero.interface';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { HeroesService } from 'src/app/services/heroes.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const mockHero: Hero = {
    id: 1,
    name: 'Batman',
    description: 'Bruce Wayne, also known as Batman...',
  };

  beforeEach(() => {
    const heroesServiceSpy = jasmine.createSpyObj<HeroesService>(
      'HeroesService',
      ['searchHeroes', 'deleteHero'],
      {
        heroesResultsPage$: of([mockHero]),
        heroesTotalResults$: of(1),
      }
    );

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      declarations: [DashboardComponent],
      providers: [{ provide: HeroesService, useValue: heroesServiceSpy }],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call redirectToCreateForm on Add hero button click', () => {
    spyOn(component, 'redirectToCreateForm');
    const button = fixture.nativeElement.querySelector('#add-hero-btn');
    button.click();
    expect(component.redirectToCreateForm).toHaveBeenCalled();
  });

  it('should navigate to create hero form on redirectToCreateForm', () => {
    spyOn(component['_router'], 'navigate');
    component.redirectToCreateForm();
    expect(component['_router'].navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should call redirectToEditForm on Edit button click', () => {
    spyOn(component, 'redirectToEditForm');
    const expectedHeroId = 1;
    const button = fixture.nativeElement.querySelector('#edit-hero-btn');
    button.click();
    expect(component.redirectToEditForm).toHaveBeenCalledWith(expectedHeroId);
  });

  it('should navigate to edit form on redirectToEditForm', () => {
    spyOn(component['_router'], 'navigate');
    const heroId = 1;
    component.redirectToEditForm(heroId);
    expect(component['_router'].navigate).toHaveBeenCalledWith([
      `/edit/${heroId}`,
    ]);
  });

  it('should call confirmDeletion on delete button click', () => {
    spyOn(component, 'confirmDeletion');
    const expectedHero = mockHero;
    const button = fixture.nativeElement.querySelector('#delete-hero-btn');
    button.click();
    expect(component.confirmDeletion).toHaveBeenCalledWith(expectedHero);
  });

  it('should open confirm dialog on confirmDeletion and delete hero if confirmed', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<ConfirmDialogComponent>);

    const hero = { id: 1, name: 'Iron Man' } as Hero;
    component.confirmDeletion(hero);

    expect(component.dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: `Are you sure you want to remove ${hero.name} from your list of heroes?`,
    });

    expect(component['_heroesService'].deleteHero).toHaveBeenCalledWith(
      hero.id
    );
  });

  it('should open confirm dialog on confirmDeletion and not delete hero if cancelled', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined),
    } as MatDialogRef<ConfirmDialogComponent>);

    const hero = { id: 1, name: 'Iron Man' } as Hero;
    component.confirmDeletion(hero);

    expect(component.dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: `Are you sure you want to remove ${hero.name} from your list of heroes?`,
    });

    expect(component['_heroesService'].deleteHero).not.toHaveBeenCalled();
  });
});
