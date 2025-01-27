import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  starsSelected: number = 0; // Tracks the selected number of stars
  supporterName: string = ''; // Stores the supporter name input
  supporterMessage: string = ''; // Stores the supporter message input

  isModalOpen: boolean = false; // Controls modal visibility

  constructor(private snackBar: MatSnackBar) {}

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

    // Build the purchase details
    const purchaseDetails = {
      artistId: this.artist.id,
      starsPurchased: this.starsSelected,
      supporterName: this.supporterName,
      supporterMessage: this.supporterMessage,
      amountPaid: this.starsSelected * 50,
      purchaseDate: new Date(),
    };

    // Log the purchase details (or send them to the server if applicable)
    console.log('Purchase Details:', purchaseDetails);

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
