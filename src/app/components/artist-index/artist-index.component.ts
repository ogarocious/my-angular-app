import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-artist-index',
  templateUrl: './artist-index.component.html',
  imports: [CommonModule, RouterLink, SidebarComponent],
  styleUrls: ['./artist-index.component.scss'],
  standalone: true,
})
export class ArtistIndexComponent implements OnInit {
  artists: {
    id: number;
    name: string;
    username: string;
    totalStars: number;
    image_url?: string;
  }[] = [];
  isSidebarOpen: boolean = false;
  selectedArtist: any = null;

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.fetchArtists();
  }

  fetchArtists(): void {
    this.artistService.getArtists().subscribe(
      (data) => {
        // Map artist data to include image URLs
        this.artists = data.map((artist) => ({
          ...artist,
          image_url: this.getArtistImage(artist.username),
        }));
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  getArtistImage(username: string): string {
    const imageMap: { [key: string]: string } = {
      jayz: '/assets/jayz.png',
      kanyewest: '/assets/ye.png',
      eminem: '/assets/eminem.png',
      drake: '/assets/drake.png',
      tupac: '/assets/tupac.png',
      biggie: '/assets/biggie.png',
      kendricklamar: '/assets/kendrick.png',
      nickiminaj: '/assets/nicki.png',
      snoopdogg: '/assets/snoop.png',
      lilwayne: '/assets/lilwayne.png',
    };

    return imageMap[username] || '/assets/default-image.png';
  }

  handleImageError(artist: any): void {
    // Set a default image URL if the artist's image fails to load
    artist.image_url = '/assets/default-image.png';
  }

  openSidebar(artist: any): void {
    console.log('Opening sidebar for artist:', artist);
    this.selectedArtist = artist;
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    console.log('Closing sidebar');
    this.isSidebarOpen = false;
    this.selectedArtist = null;
  }
}
