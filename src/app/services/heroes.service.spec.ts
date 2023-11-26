import { TestBed } from '@angular/core/testing';
import { HeroesService } from './heroes.service';
import { Hero } from '../interfaces/hero.interface';
import { HeroesInMemoryDbService } from './heroes-in-memory-db.service';

describe('HeroesService', () => {
  let service: HeroesService;
  const mockHero1: Hero = {
    id: 1,
    name: 'Dummy Hero 1 term1',
    description: 'Dummy Hero description 1',
  };
  const mockHero2: Hero = {
    id: 2,
    name: 'Dummy Hero 2 term2',
    description: 'Dummy Hero description 2',
  };
  const mockHero3: Hero = {
    id: 3,
    name: 'Dummy Hero 3 Term1',
    description: 'Dummy Hero description 3',
  };
  const mockHeroes: Hero[] = [mockHero1, mockHero2, mockHero3];
  let mockHeroesInMemoryDbService: jasmine.SpyObj<HeroesInMemoryDbService>;

  beforeEach(() => {
    const heroesInMemoryDbServiceSpy =
      jasmine.createSpyObj<HeroesInMemoryDbService>('HeroesInMemoryDbService', [
        'getAll',
        'getById',
        'create',
        'delete',
        'update',
      ]);

    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        {
          provide: HeroesInMemoryDbService,
          useValue: heroesInMemoryDbServiceSpy,
        },
      ],
    });
    service = TestBed.inject(HeroesService);
    mockHeroesInMemoryDbService = TestBed.inject(
      HeroesInMemoryDbService
    ) as jasmine.SpyObj<HeroesInMemoryDbService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get hero by id and add it to the hero stream', () => {
    mockHeroesInMemoryDbService.getById.and.returnValue(mockHero1);
    const spyHeroBSNext = spyOn(service['heroBS'], 'next');
    const heroId = mockHero1.id;

    service.getHeroById(heroId);

    expect(spyHeroBSNext).toHaveBeenCalledWith(mockHero1);
  });

  it('should get hero by id and not add it to the hero stream when not found', () => {
    mockHeroesInMemoryDbService.getById.and.returnValue(null);
    const spyHeroBSNext = spyOn(service['heroBS'], 'next');
    const heroId = 1;

    service.getHeroById(heroId);

    expect(spyHeroBSNext).toHaveBeenCalledWith(null);
  });

  it('should search all heroes', () => {
    mockHeroesInMemoryDbService.getAll.and.returnValue(mockHeroes);
    const spyResultsPageNext = spyOn(service['heroesResultsPageBS'], 'next');
    const spyTotalResultsNext = spyOn(service['heroesTotalResultsBS'], 'next');
    const term = '';
    const pageNumber = 1;
    const resultsPerPage = 2;
    const expectedHeroes = mockHeroes.slice(0, 2);

    service.searchHeroes(term, pageNumber, resultsPerPage);

    expect(spyResultsPageNext).toHaveBeenCalledWith(expectedHeroes);
    expect(spyTotalResultsNext).toHaveBeenCalledWith(mockHeroes.length);
  });

  it('should search heroes by term', () => {
    mockHeroesInMemoryDbService.getAll.and.returnValue(mockHeroes);
    const spyResultsPageNext = spyOn(service['heroesResultsPageBS'], 'next');
    const spyTotalResultsNext = spyOn(service['heroesTotalResultsBS'], 'next');
    const term = 'term1';
    const pageNumber = 1;
    const resultsPerPage = 2;
    const expectedHeroes = [mockHero1, mockHero3];

    service.searchHeroes(term, pageNumber, resultsPerPage);

    expect(spyResultsPageNext).toHaveBeenCalledWith(expectedHeroes);
    expect(spyTotalResultsNext).toHaveBeenCalledWith(2);
  });

  it('should create hero', () => {
    mockHeroesInMemoryDbService.getAll.and.returnValue(mockHeroes);
    const spyResultsPageNext = spyOn(service['heroesResultsPageBS'], 'next');
    const spyTotalResultsNext = spyOn(service['heroesTotalResultsBS'], 'next');
    const newHero: Hero = {
      id: 13,
      name: 'New Hero',
      description: 'description',
    };

    service.createHero(newHero);

    expect(mockHeroesInMemoryDbService.create).toHaveBeenCalledWith(newHero);
    expect(mockHeroesInMemoryDbService.create).toHaveBeenCalledTimes(1);
    expect(spyResultsPageNext).toHaveBeenCalledWith(mockHeroes);
    expect(spyTotalResultsNext).toHaveBeenCalledWith(mockHeroes.length);
  });

  it('should delete hero', () => {
    mockHeroesInMemoryDbService.getAll.and.returnValue(mockHeroes);
    const spyTotalResultsNext = spyOn(service['heroesTotalResultsBS'], 'next');
    const heroIdToDelete = 1;

    service.deleteHero(heroIdToDelete);

    expect(mockHeroesInMemoryDbService.delete).toHaveBeenCalledWith(
      heroIdToDelete
    );
    expect(mockHeroesInMemoryDbService.delete).toHaveBeenCalledTimes(1);
    expect(spyTotalResultsNext).toHaveBeenCalledWith(mockHeroes.length);
  });

  it('should update hero', () => {
    mockHeroesInMemoryDbService.getAll.and.returnValue(mockHeroes);
    const spyResultsPageNext = spyOn(service['heroesResultsPageBS'], 'next');
    const updatedHero: Hero = {
      id: 1,
      name: 'Updated name',
      description: 'Updated description',
    };

    service.updateHero(updatedHero);

    expect(mockHeroesInMemoryDbService.update).toHaveBeenCalledWith(
      updatedHero
    );
    expect(mockHeroesInMemoryDbService.update).toHaveBeenCalledTimes(1);
    expect(spyResultsPageNext).toHaveBeenCalledWith(mockHeroes);
  });
});
