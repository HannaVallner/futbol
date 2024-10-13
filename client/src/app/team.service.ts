import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = '../api/team-info';

  constructor(private http: HttpClient) {}

  getTeamInfo(teamName: string): Observable<any> {
    let params = new HttpParams().set('team_name', teamName);
    return this.http.get(this.apiUrl, { params });
  }
}
