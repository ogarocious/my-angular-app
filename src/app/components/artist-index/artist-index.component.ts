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
    starsPurchased?: number;
  }[] = [];
  isSidebarOpen: boolean = false;
  selectedArtist: any = null;
  recentSupporters: any[] = []; // Stores the most recent supporters

  constructor(private artistService: ArtistService, private router: Router) {}

  onStarsPurchased(event: { artistId: number; starsPurchased: number }): void {
    const artist = this.artists.find((artist) => artist.id === event.artistId);
    if (artist) {
      artist.totalStars += event.starsPurchased;
    }

    if (this.selectedArtist?.id === event.artistId) {
      this.selectedArtist.totalStars =
        artist?.totalStars || this.selectedArtist.totalStars;
    }

    this.fetchArtistsAndTotals();
  }

  ngOnInit(): void {
    this.fetchArtistsAndTotals();
  }

  fetchArtistsAndTotals(): void {
    // Fetch artists
    this.artistService.getArtists().subscribe(
      (artists) => {
        // Fetch star totals
        this.artistService.getArtistStarTotals().subscribe(
          (totals) => {
            console.log('Star Totals from API:', totals);

            // Merge totals into artists and include image URLs
            this.artists = artists.map((artist) => {
              const total =
                totals.find((t) => t.artistId === artist.id)?.totalStars || 0;
              return {
                ...artist,
                totalStars: total, // Default totalStars plus purchases
                image_url: this.getArtistImage(artist.username), // Add artist image
              };
            });
          },
          (error) => console.error('Error fetching star totals:', error)
        );
      },
      (error) => console.error('Error fetching artists:', error)
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
    this.selectedArtist = artist; // Pass the selected artist to the sidebar
    this.isSidebarOpen = true; // Open the sidebar
  }

  closeSidebar(): void {
    console.log('Closing sidebar');
    this.isSidebarOpen = false;
    this.selectedArtist = null;
  }
}
