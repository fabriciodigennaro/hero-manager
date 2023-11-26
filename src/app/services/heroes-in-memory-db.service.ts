import { Injectable } from '@angular/core';
import { INITIAL_HEROES_LIST } from '../shared/hero-response-mock-list';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesInMemoryDbService {
  private heroesDB: Hero[] = INITIAL_HEROES_LIST;

  constructor() {}

  getAll() {
    return this.heroesDB.slice();
  }

  getById(heroId: Number): Hero | null {
    return this.heroesDB.find((hero) => hero.id == heroId) ?? null;
  }

  create(hero: Hero): void {
    const heroId = this.heroesDB.length
      ? this.heroesDB[this.heroesDB.length - 1].id + 1
      : 1;
    hero.id = heroId;
    this.heroesDB.push(hero);
  }

  update(hero: Hero): void {
    const heroes = this.heroesDB.map((savedHero) => {
      if (savedHero.id == hero.id) {
        return hero;
      }
      return savedHero;
    });
    this.heroesDB = heroes;
  }

  delete(id: Number): void {
    const heroes = this.heroesDB.filter((hero) => hero.id != id);
    this.heroesDB = heroes;
  }
}
