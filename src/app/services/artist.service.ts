import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private artistsUrl = 'http://localhost:5000/api/artists';

  private starPurchaseUrl = 'http://localhost:5000/api/starpurchases';

  constructor(private http: HttpClient) {}

  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(this.artistsUrl);
  }

  getStarPurchases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.starPurchaseUrl}`);
  }

  getStarPurchasesByArtist(artistId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.starPurchaseUrl}/artist/${artistId}`);
  }

  createStarPurchase(purchase: any): Observable<any> {
    return this.http.post<any>(`${this.starPurchaseUrl}`, purchase);
  }
}
