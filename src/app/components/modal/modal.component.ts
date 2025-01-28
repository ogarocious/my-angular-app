import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() isOpen: boolean = false; // Control modal visibility
  @Input() artist: any = {}; // Artist data passed from the parent component
  @Output() isOpenChange = new EventEmitter<boolean>(); // Two-way binding for isOpen
  @Output() close = new EventEmitter<void>(); // Event to notify parent to close modal
  @Output() starsPurchased = new EventEmitter<{
    artistId: number;
    starsPurchased: number;
  }>();
  @Output() purchaseCompleted = new EventEmitter<void>(); // Event emitted on purchase completion

  purchaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private artistService: ArtistService
  ) {
    // Initialize the reactive form
    this.purchaseForm = this.fb.group({
      stars: [null, Validators.required], // Selected stars
      name: ['', Validators.required], // Supporter name
      message: ['', Validators.required], // Supporter message
    });
  }

  starsSelected: number = 1; // Default number of stars selected
  supporterName: string = ''; // Name input by the user
  supporterMessage: string = ''; // Message input by the user

  /**
   * Closes the modal by emitting a close event.
   */
  closeModal(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen); // Emit the new state for two-way binding
    this.purchaseForm.reset(); // Reset the form
  }
  /**
   * Updates the selected number of stars.
   * @param stars Number of stars selected
   */
  selectStars(stars: number): void {
    if (stars > 0) {
      this.purchaseForm.patchValue({ stars });
    } else {
      console.error('Invalid number of stars selected.');
    }
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      const purchaseDetails = {
        artistId: this.artist.id,
        starsPurchased: this.purchaseForm.value.stars,
        supporterName: this.purchaseForm.value.name,
        message: this.purchaseForm.value.message,
        amountPaid: this.purchaseForm.value.stars * 50,
        purchaseDate: new Date(),
      };

      this.starsPurchased.emit(purchaseDetails);

      console.log('Purchase Details:', purchaseDetails);

      this.artistService.createStarPurchase(purchaseDetails).subscribe(
        (response) => {
          // Display success snackbar
          this.snackBar.open(
            `Thank you for supporting ${this.artist.name} with ${this.purchaseForm.value.stars} stars!`,
            'Close',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar'],
            }
          );

          // Reset the form and close the modal
          this.purchaseForm.reset();
          this.purchaseCompleted.emit();
          this.closeModal();
        },
        (error) => {
          console.error('Error creating star purchase:', error);
          this.snackBar.open(
            'An error occurred while processing your purchase. Please try again.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
    } else {
      // If form is invalid, display an error snackbar
      this.snackBar.open(
        'Please fill out all fields before purchasing.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
    }
  }
}
