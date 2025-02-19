import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarvelService } from '../../shared/services/marvel.service';

import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Comic } from '../../shared/interfaces/comics/comic.interface';

@Component({
  selector: 'app-heroes-comics',
  templateUrl: './heroes-comics.component.html',
  standalone: true,
  styleUrl: './heroes-comics.component.scss',
  imports: [CommonModule, NgbPaginationModule],
})
export class HeroesComicsComponent implements OnInit {
  comics: Comic[] = [];
  currentPage: number = 0;
  totalComics: number = 0;
  heroeId: number = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private marvelService: MarvelService,
  ) {}

  ngOnInit(): void {
    this.heroeId = this.route.snapshot.params['id'];
  }

  getHeroesComics(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    const offset = (page - 1) * 10;

    this.marvelService.getHeroComics(this.heroeId, offset, 10).subscribe({
      next: (resp) => {
        if (resp && resp.results) {
          this.comics = resp.results;
          this.totalComics = resp.total;
          this.loading = false;
        }
      },
      error: (err) => console.error('Error al cargar cómics:', err),
    });
  }
}
