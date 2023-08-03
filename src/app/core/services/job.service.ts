import { BaseService } from "./base.service";
import { Job } from "../entities/job.entities";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService<Job> {

  constructor(override http: HttpClient) {
    super(http, 'jobs');
  }

  organizeJobs(): Observable<Job[]> {
    return this.getAll();
  }
}
