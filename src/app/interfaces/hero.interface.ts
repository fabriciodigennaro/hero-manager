export interface HeroResponse {
  totalResult: number;
  heroes: Hero[];
}

export interface Hero {
  id: number;
  name: string;
  description: string;
}
