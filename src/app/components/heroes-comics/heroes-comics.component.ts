import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarvelService } from '../../shared/services/marvel.service';

import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComicSummary } from '../../shared/interfaces/heroe/heroe.interface';

@Component({
  selector: 'app-heroes-comics',
  templateUrl: './heroes-comics.component.html',
  standalone: true,
  styleUrl: './heroes-comics.component.scss',
  imports: [CommonModule, NgbPaginationModule],
})
export class HeroesComicsComponent implements OnInit {
  @Input() comics: ComicSummary[] = [];
  currentPage: number = 1;
  totalComics: number = 0;
  heroeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private marvelService: MarvelService,
  ) {}

  ngOnInit(): void {
    this.heroeId = this.route.snapshot.params['id'];
    this.getHeroesComics();
  }

  getHeroesComics(page: number = 1): void {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * 10;
    this.marvelService.getHeroComics(this.heroeId, offset, 10).subscribe({
      next: (resp) => {
        if (resp && resp.results) {
          this.comics = resp.results;
          this.totalComics = resp.total;
        }
      },
      error: (err) => console.error('Error al cargar cómics:', err),
    });
  }
}
