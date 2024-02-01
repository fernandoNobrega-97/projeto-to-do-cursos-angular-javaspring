import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first, tap } from 'rxjs';

import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Course[]>(this.API)
      .pipe( // take(1) -> recebe a resposta do servidor e encerra a inscrição desse nosso endpoint, da nossa origem.
        first(), // vai receber a primeira resposta e encerrar a inscrição da nossa origem, do nosso endpoint.
        delay(2000),
        tap(courses => console.log('resultado do listar cursos -> ', courses))
      );
  }

  findById(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`)
      .pipe(
        first(),
        tap(result => console.log('resultado da busca pelo ID -> ', result))
      );
  }

  save(record: Partial<Course>) {

    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record)
      .pipe(
        first(),
        tap(result => console.log('resultado do create -> ', result))
      );
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record)
      .pipe(first(), tap(result => { console.log('resultado do update -> ', result) }));
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`)
      .pipe(first(), tap(result => { console.log('resultado do delete -> ', result) }));
  }
}
