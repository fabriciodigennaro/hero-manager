import { TestBed } from '@angular/core/testing';

import { HeroesInMemoryDbService } from './heroes-in-memory-db.service';
import { Hero } from '../interfaces/hero.interface';
import { INITIAL_HEROES_LIST } from '../shared/hero-response-mock-list';

describe('HeroesInMemoryDbService', () => {
  let service: HeroesInMemoryDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesInMemoryDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all heroes', () => {
    const foundHeroes = service.getAll();

    expect(foundHeroes).toEqual(INITIAL_HEROES_LIST);
  });

  it('should get hero by id', () => {
    const expectedHero: Hero = INITIAL_HEROES_LIST[0];

    const foundHero = service.getById(expectedHero.id);

    expect(foundHero).toEqual(expectedHero);
  });

  it('should save hero', () => {
    const savedHeroes = service.getAll();
    const expectedId = savedHeroes[savedHeroes.length - 1].id + 1;
    const newHero: Hero = {
      id: expectedId,
      name: 'New Hero',
      description: 'description',
    };

    service.create(newHero);

    expect(service.getAll()).toContain(newHero);
  });

  it('should update hero', () => {
    const heroToUpdate: Hero = INITIAL_HEROES_LIST[0];
    const updatedHero: Hero = {
      id: heroToUpdate.id,
      name: 'updated name',
      description: 'updated description',
    };

    expect(service.getById(heroToUpdate.id)).toEqual(heroToUpdate);

    service.update(updatedHero);

    expect(service.getById(heroToUpdate.id)).toEqual(updatedHero);
  });

  it('should delete hero', () => {
    const heroToDelete: Hero = INITIAL_HEROES_LIST[0];

    expect(service.getById(heroToDelete.id)).toEqual(heroToDelete);

    service.delete(heroToDelete.id);

    expect(service.getById(heroToDelete.id)).toEqual(null);
  });
});
