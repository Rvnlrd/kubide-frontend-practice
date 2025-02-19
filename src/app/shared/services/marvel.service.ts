import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment.dev';
import { Comic } from '../interfaces/comics/comic.interface';
import { Heroe } from '../interfaces/heroe/heroe.interface';
import {
  CharacterDataContainer,
  CharacterDataWrapper,
} from '../interfaces/wrapper/wrappers.interface';

export interface ApiData<T> {
  data: null | CharacterDataContainer<T>;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MarvelService {
  private baseUrl = environment.baseUrl;
  private publicKey = environment.publicKey;
  private privateKey = environment.privateKey;
  private heroesState = new BehaviorSubject<ApiData<Heroe>>({
    loading: false,
    data: null,
  });
  public heroes$ = this.heroesState.asObservable();

  constructor(private http: HttpClient) {}

  get _heroesState() {
    return this.heroesState.getValue();
  }

  private generateHash(): { ts: string; hash: string } {
    const ts = new Date().getTime().toString();
    const hash = CryptoJS.MD5(
      `${ts}${this.privateKey}${this.publicKey}`,
    ).toString();
    return { ts, hash };
  }

  getHeroes(offset: number = 0, limit: number = 10) {
    this.heroesState.next({ data: this._heroesState.data, loading: true });
    const { ts, hash } = this.generateHash();
    this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters?ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`,
      )
      .pipe(
        map((resp) => {
          this.heroesState.next({
            data: {
              ...resp.data,
              results: [
                ...(this._heroesState.data?.results || []),
                ...resp.data.results,
              ],
            },
            loading: false,
          });
          return resp.data;
        }),
        catchError((error) => {
          console.error('Error al obtener héroes:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      )
      .subscribe();
  }

  searchHeroes(search: string, offset: number = 0, limit: number = 10) {
    const { ts, hash } = this.generateHash();
    this.heroesState.next({ data: this._heroesState.data, loading: true });
    this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters?nameStartsWith=${search}&ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`,
      )
      .pipe(
        map((resp) => {
          this.heroesState.next({
            data: {
              ...resp.data,
              results: [
                ...(this._heroesState.data?.results || []),
                ...resp.data.results,
              ],
            },
            loading: false,
          });
          return resp.data;
        }),
        catchError((error) => {
          console.error('Error al buscar héroes:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      )
      .subscribe();
  }

  resetHeroes() {
    this.heroesState.next({ data: null, loading: false });
  }

  getHeroById(id: number): Observable<CharacterDataContainer> {
    const { ts, hash } = this.generateHash();
    return this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters/${id}?ts=${ts}&apikey=${this.publicKey}&hash=${hash}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al obtener héroes:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      );
  }

  getHeroByName(name: string): Observable<CharacterDataContainer> {
    const { ts, hash } = this.generateHash();
    return this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters?name=${name}&ts=${ts}&apikey=${this.publicKey}&hash=${hash}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al obtener héroes:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      );
  }

  getHeroComics(
    id: number,
    offset: number = 0,
    limit: number = 10,
  ): Observable<CharacterDataContainer<Comic>> {
    const { ts, hash } = this.generateHash();
    return this.http
      .get<
        CharacterDataWrapper<Comic>
      >(`${this.baseUrl}characters/${id}/comics?ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`)
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al obtener cómics:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      );
  }

  getHeroSeries(id: number): Observable<CharacterDataContainer> {
    const { ts, hash } = this.generateHash();
    return this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters/${id}/series?ts=${ts}&apikey=${this.publicKey}&hash=${hash}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al obtener series:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      );
  }
}
