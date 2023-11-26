import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroesService } from 'src/app/services/heroes.service';
import { Subject } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero.interface';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        params: {
          id: '1',
        },
      },
    });

    const heroesServiceSpy = jasmine.createSpyObj(['getHeroById'], {
      hero$: new Subject<Hero | null>(),
    });

    const routerSpy = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockHeroesService = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call redirectToDashboard on go back button click', () => {
    spyOn(component, 'redirectToDashboard');
    const button = fixture.nativeElement.querySelector('#go-back-btn');
    button.click();
    expect(component.redirectToDashboard).toHaveBeenCalled();
  });

  it('should redirect to dashboard on redirectToDashboard', () => {
    component.redirectToDashboard();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should get hero by id using id from route', () => {
    const expectedHeroId = 1;

    component.ngOnInit();

    expect(mockHeroesService.getHeroById).toHaveBeenCalledWith(expectedHeroId);
  });

  it('should show not found message when hero not found', () => {
    const heroSubject = mockHeroesService.hero$ as Subject<Hero | null>;

    heroSubject.next(null);

    const h1 = fixture.nativeElement.querySelector('h1')?.textContent;

    expect(h1).toEqual('Hero not found :(');
  });

  it('should show hero details', () => {
    const heroSubject = mockHeroesService.hero$ as Subject<Hero | null>;

    heroSubject.next({
      id: 1,
      name: 'Batman',
      description: 'Dummy description',
    });

    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1')?.textContent;
    const p = fixture.nativeElement.querySelector('p')?.textContent;

    expect(h1).toEqual('Batman');
    expect(p).toEqual('Dummy description');
  });
});
