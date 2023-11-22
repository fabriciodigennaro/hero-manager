import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { INITIAL_HEROES_LIST } from '../shared/hero-response-mock-list';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private heroBS: Subject<Hero | null> = new Subject();
  private heroesResultsPageBS: BehaviorSubject<Hero[]> = new BehaviorSubject(
    new Array<Hero>()
  );
  private heroesTotalResultsBS: BehaviorSubject<number> = new BehaviorSubject(
    0
  );
  private heroesDB: Hero[] = INITIAL_HEROES_LIST;

  constructor() {}

  get heroesResultsPage$(): Observable<Hero[]> {
    return this.heroesResultsPageBS.asObservable();
  }

  get hero$(): Observable<Hero | null> {
    return this.heroBS.asObservable();
  }

  get heroesTotalResults$(): Observable<number> {
    return this.heroesTotalResultsBS.asObservable();
  }

  getHeroById(id: number): void {
    const hero = this.heroesDB.find((hero) => hero.id == id) ?? null;
    this.heroBS.next(hero);
  }

  searchHeroes(term: string, pageNumber: number, resultsPerPage: number): void {
    const trimmedTerm = term.trim();
    const heroes = trimmedTerm.length
      ? this.getFilteredHeroesByName(trimmedTerm)
      : this.heroesDB;
    const start = this.calculatePaginatorStart(pageNumber, resultsPerPage);
    const end = this.calculatePaginatorEnd(pageNumber, resultsPerPage);
    const paginatedHeroes = heroes.slice(start, end);

    this.heroesResultsPageBS.next(paginatedHeroes);
    this.heroesTotalResultsBS.next(this.heroesDB.length);
  }

  createHero(hero: Hero): void {
    const heroId = this.heroesDB.length
      ? this.heroesDB[this.heroesDB.length - 1].id + 1
      : 1;
    hero.id = heroId;
    this.heroesDB.push(hero);
    this.heroesResultsPageBS.next(this.heroesDB);
    this.heroesTotalResultsBS.next(this.heroesDB.length);
  }

  deleteHero(id: number): void {
    const heroes = this.heroesDB.filter((hero) => hero.id != id);
    this.heroesDB = heroes;
    this.heroesTotalResultsBS.next(this.heroesDB.length);
  }

  updateHero(updatedHero: Hero): void {
    const heroes = this.heroesDB.map((savedHero) => {
      if (savedHero.id == updatedHero.id) {
        return updatedHero;
      }
      return savedHero;
    });
    this.heroesDB = heroes;
    this.heroesResultsPageBS.next(heroes);
  }

  private getFilteredHeroesByName(term: string): Hero[] {
    return this.heroesDB.filter((hero) =>
      hero.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  private calculatePaginatorStart(
    pageNumber: number,
    resultsPerPage: number
  ): number {
    const calculatedStart = (pageNumber - 1) * resultsPerPage;
    return Math.max(0, calculatedStart);
  }

  private calculatePaginatorEnd(
    pageNumber: number,
    resultsPerPage: number
  ): number {
    const calculatedEnd = (pageNumber - 1) * resultsPerPage + resultsPerPage;
    return Math.min(calculatedEnd, this.heroesDB.length);
  }
}
