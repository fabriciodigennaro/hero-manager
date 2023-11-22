import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  heroList: Hero[] = [];
  title: string = 'Heroes manager';
  searchValue = new FormControl('');
  heroes$: Observable<Hero[]> = new Observable();
  page: number = 1;
  resultsPerPage: number = 5;
  totalResults: number = 0;

  constructor(private _heroesService: HeroesService, private _router: Router) {}

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

  private getHeroes(): void {
    this.heroes$ = this._heroesService.heroesResultsPage$;
  }

  private searchHeroes(): void {
    const searchValue = this.searchValue.value ?? '';
    this._heroesService.searchHeroes(
      searchValue,
      this.page,
      this.resultsPerPage
    );
  }

  private getTotalResults(): void {
    const totalResultSubscription =
      this._heroesService.heroesTotalResults$.subscribe((newTotal) => {
        this.totalResults = newTotal;
      });
    this.subscriptions.push(totalResultSubscription);
  }

  redirectToHeroForm(): void {
    this._router.navigate(['/create']);
  }

  redirectToEditForm(heroId: number): void {
    this._router.navigate([`/edit/${heroId}`]);
  }

  confirmDeletion(heroId: number): void {
    this.deleteHero(heroId);
  }

  deleteHero(heroId: number): void {
    this._heroesService.deleteHero(heroId);
    this.searchHeroes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
