import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:5000/api/artists'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
