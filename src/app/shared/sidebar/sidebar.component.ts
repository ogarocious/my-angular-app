import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isOpen: boolean = false; // Controls sidebar visibility
  @Input() artist: any = null; // Artist details
  @Input() sidebarWidth: string = '40rem'; // Default width of the sidebar

  @Output() close = new EventEmitter<void>(); // Emits an event to close the sidebar
  @Output() isOpenChange = new EventEmitter<boolean>(); // Emits changes in `isOpen` for two-way binding
  @Output() starsPurchased = new EventEmitter<{
    artistId: number;
    starsPurchased: number;
  }>();

  starsSelected: number = 0; // Tracks the selected number of stars
  supporterName: string = ''; // Stores the supporter name input
  supporterMessage: string = ''; // Stores the supporter message input
  recentSupporters: any[] = []; // Stores the most recent supporters
  errorMessage: string | null = null;

  isModalOpen: boolean = false; // Controls modal visibility

  constructor(
    private artistService: ArtistService,
    private snackBar: MatSnackBar
  ) {}

  handleStarsPurchase(starsPurchased: number): void {
    this.starsPurchased.emit({
      artistId: this.artist.id,
      starsPurchased,
    });

    if (this.artist) {
      this.artist.totalStars += starsPurchased;
    }

    this.refreshSupporters();
  }
  refreshSupporters(): void {
    if (!this.artist) return;

    this.artistService.getStarPurchasesByArtist(this.artist.id).subscribe(
      (data) => {
        this.recentSupporters = data.sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        ); // Update the supporters list
        this.errorMessage = null;

        const totalStars = data.reduce(
          (sum, purchase) => sum + purchase.starsPurchased,
          0
        );

        this.artist.totalStars = totalStars;
      },
      (error) => {
        if (error.status === 404) {
          console.warn(
            `No recent supporters found for artist: ${this.artist.name}`
          );
          this.recentSupporters = [];
          this.errorMessage = 'No recent supporters yet.';
        } else {
          console.error('Error fetching star purchases:', error);
          this.errorMessage = 'Failed to load recent supporters.';
        }
      }
    );
  }

  ngOnChanges(): void {
    if (this.artist && this.isOpen) {
      // Fetch recent supporters for the artist
      this.artistService.getStarPurchasesByArtist(this.artist.id).subscribe(
        (data) => {
          this.recentSupporters = data; // Update supporters list
          this.errorMessage = null;
        },
        (error) => {
          if (error.status === 404) {
            // Handle case where no purchases are found
            console.warn(
              `No recent supporters found for artist: ${this.artist.name}`
            );
            this.recentSupporters = [];
            this.errorMessage = 'No recent supporters yet.';
          } else {
            // Handle other errors
            console.error('Error fetching star purchases:', error);
            this.errorMessage = 'Failed to load recent supporters.';
          }
        }
      );
    }
  }

  /**
   * Opens the modal.
   */
  openModal(): void {
    this.isModalOpen = true;
  }

  /**
   * Closes the modal and updates the sidebar's state.
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Closes the sidebar and emits the close event.
   */
  closeSidebar(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen); // Emit the new state for two-way binding
    this.close.emit(); // Notify the parent that the sidebar is closed
  }

  /**
   * Selects the number of stars for the purchase.
   */
  selectStars(stars: number): void {
    this.starsSelected = stars;
  }

  /**
   * Handles the purchase of stars.
   */
  purchaseStars(): void {
    // Ensure all required fields are filled
    if (!this.supporterName || !this.supporterMessage) {
      this.snackBar.open(
        'Please fill out all fields before purchasing.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
      return;
    }

    // Display a success message
    this.snackBar.open(
      `Thank you for supporting ${this.artist.name} with ${this.starsSelected} stars!`,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );

    // Close the modal and sidebar after purchase
    this.closeModal();
    this.closeSidebar();
  }
}
