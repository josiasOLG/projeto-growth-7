import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity } from '../entities/entity.entities';

const BASE_URL = 'http://localhost:3000';

export abstract class BaseService<T extends Entity>  {
  protected entities: T[] = [];
  private readonly API_URL: string;

  constructor(protected http: HttpClient, apiUrl: string) {
    this.API_URL = `${BASE_URL}/${apiUrl}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.API_URL);
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${id}`);
  }
  post(entity: any): Observable<T> {
    return this.http.post<T>(this.API_URL, entity);
  }

  put(id: number, updatedEntity: T): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${id}`, updatedEntity);
  }

  add(job: any): Observable<T> {
    return this.http.post<T>(this.API_URL, job);
  }

  edit(id: number, job: any): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${id}`, job);
  }

  remove(id: number): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/${id}`);
  }
}
