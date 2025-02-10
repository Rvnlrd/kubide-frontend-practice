import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comic } from '../interfaces/comics/comic.interface';
import {
  CharacterDataContainer,
  CharacterDataWrapper,
} from '../interfaces/wrapper/wrappers.interface';

@Injectable({
  providedIn: 'root',
})
export class MarvelService {
  private baseUrl = 'https://gateway.marvel.com/v1/public/';
  private publicKey = 'fe7b203a7b6179e6b5c380f35168c4f1';
  private privateKey = 'b573bb093145a6dd1fbf1f3cba02e299434b6369';

  constructor(private http: HttpClient) {}

  private generateHash(): { ts: string; hash: string } {
    const ts = new Date().getTime().toString();
    const hash = CryptoJS.MD5(
      `${ts}${this.privateKey}${this.publicKey}`,
    ).toString();
    return { ts, hash };
  }

  getHeroes(
    offset: number = 0,
    limit: number = 10,
  ): Observable<CharacterDataContainer> {
    const { ts, hash } = this.generateHash();
    return this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters?ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al obtener héroes:', error);
          return throwError(() => new Error('Error en la API de Marvel'));
        }),
      );
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

  searchHeroes(
    search: string,
    offset: number = 0,
    limit: number = 10,
  ): Observable<CharacterDataContainer> {
    const { ts, hash } = this.generateHash();

    return this.http
      .get<CharacterDataWrapper>(
        `${this.baseUrl}characters?nameStartsWith=${search}&ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          console.error('Error al buscar héroes:', error);
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
