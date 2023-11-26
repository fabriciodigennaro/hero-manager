import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { HeroesInMemoryDbService } from './heroes-in-memory-db.service';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private heroBS: Subject<Hero | null> = new Subject();
  private heroesResultsPageBS: BehaviorSubject<Hero[]> = new BehaviorSubject(
    new Array<Hero>()
  );
  private heroesTotalResultsBS: BehaviorSubject<number> = new BehaviorSubject(
    0
  );

  constructor(private _heroesInMemoryDbService: HeroesInMemoryDbService) {}

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
    const hero = this._heroesInMemoryDbService.getById(id);
    this.heroBS.next(hero);
  }

  searchHeroes(term: string, pageNumber: number, resultsPerPage: number): void {
    const trimmedTerm = term.trim();
    const allHeroes = this._heroesInMemoryDbService.getAll();
    const foundHeroes = trimmedTerm.length
      ? this.getFilteredHeroesByName(trimmedTerm, allHeroes)
      : allHeroes;
    const start = this.calculatePaginatorStart(pageNumber, resultsPerPage);
    const end = this.calculatePaginatorEnd(
      pageNumber,
      resultsPerPage,
      foundHeroes.length
    );
    const paginatedHeroes = foundHeroes.slice(start, end);

    this.heroesResultsPageBS.next(paginatedHeroes);
    this.heroesTotalResultsBS.next(foundHeroes.length);
  }

  createHero(hero: Hero): void {
    this._heroesInMemoryDbService.create(hero);
    const updatedHeroes = this._heroesInMemoryDbService.getAll();
    this.heroesResultsPageBS.next(updatedHeroes);
    this.heroesTotalResultsBS.next(updatedHeroes.length);
  }

  deleteHero(id: number): void {
    this._heroesInMemoryDbService.delete(id);
    const updatedHeroes = this._heroesInMemoryDbService.getAll();
    this.heroesTotalResultsBS.next(updatedHeroes.length);
  }

  updateHero(updatedHero: Hero): void {
    this._heroesInMemoryDbService.update(updatedHero);
    const updatedHeroes = this._heroesInMemoryDbService.getAll();
    this.heroesResultsPageBS.next(updatedHeroes);
  }

  private getFilteredHeroesByName(term: string, heroes: Hero[]): Hero[] {
    return heroes.filter((hero) =>
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
    resultsPerPage: number,
    totalResults: number
  ): number {
    const calculatedEnd = (pageNumber - 1) * resultsPerPage + resultsPerPage;
    return Math.min(calculatedEnd, totalResults);
  }
}
