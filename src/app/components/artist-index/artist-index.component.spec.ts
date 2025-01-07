import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';

@Component({
  selector: 'app-artist-index',
  templateUrl: './artist-index.component.html',
  styleUrls: ['./artist-index.component.scss'],
})
export class ArtistIndexComponent implements OnInit {
  artists: Artist[] = []; // Array to store artists

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.fetchArtists();
  }

  // Fetch the list of artists from the service
  fetchArtists(): void {
    this.artistService.getArtists().subscribe(
      (data: Artist[]) => {
        this.artists = data;
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }
}
