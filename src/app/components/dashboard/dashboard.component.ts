import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  heroList: Hero[] = [];
  title: string = 'Heroes manager';
  searchValue = new FormControl('');
  heroes$: Observable<Hero[]> = new Observable();
  page: number = 1;
  resultsPerPage: number = 5;
  totalResults: number = 0;

  constructor(private _heroesService: HeroesService) {}

  ngOnInit() {
    this.searchHeroes();
    this.getHeroes();
    this.searchValue.statusChanges.subscribe(() => this.searchHeroes());
    this.getTotalResults();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.page = pageEvent.pageIndex + 1;
    this.resultsPerPage = pageEvent.pageSize;
    this.searchHeroes();
  }

  clearSearchForm(): void {
    this.searchValue.setValue('');
  }

  searchFormHasValue(): boolean {
    return this.searchValue.value != undefined && this.searchValue.value != '';
  }

  private getHeroes() {
    this.heroes$ = this._heroesService.heroesResultsPage$;
  }

  private searchHeroes() {
    const searchValue = this.searchValue.value ?? '';
    this._heroesService.searchHeroes(
      searchValue,
      this.page,
      this.resultsPerPage
    );
  }

  private getTotalResults() {
    this._heroesService.heroesTotalResults$.subscribe((newTotal) => {
      this.totalResults = newTotal;
    });
  }

  deleteHero(heroId: number) {
    this._heroesService.deleteHero(heroId);
    this.searchHeroes();
  }
}
