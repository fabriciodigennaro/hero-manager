import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  heroId: number = 0;
  hero: Hero | null = null;

  constructor(
    private _heroesService: HeroesService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.heroId = this.route.snapshot.params['id'];
    this.getHero(this.heroId);
  }

  getHero(heroId: number): void {
    this._heroesService.hero$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((hero) => {
        if (hero) {
          this.hero = hero;
        }
      });
    this._heroesService.getHeroById(heroId);
  }

  redirectToDashboard(): void {
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
