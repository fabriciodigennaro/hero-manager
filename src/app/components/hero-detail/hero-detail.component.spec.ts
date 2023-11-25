import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroesService } from 'src/app/services/heroes.service';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute: any;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;

  beforeEach(waitForAsync(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy().and.returnValue('1'),
        },
      },
    };

    mockHeroesService = jasmine.createSpyObj(['getHeroById']);

    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroesService, useValue: mockHeroesService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to dashboard on button click', () => {
    const navigateSpy = spyOn((<any>component)._router, 'navigate');

    component.redirectToDashboard();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
