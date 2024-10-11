import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://127.0.0.1:5000/api/team-info';  // Flask API URL

  constructor(private http: HttpClient) {}

  getTeamInfo(teamName: string): Observable<any> {
    let params = new HttpParams().set('team_name', teamName);  // Add query parameter
    return this.http.get(this.apiUrl, { params });
  }
}
