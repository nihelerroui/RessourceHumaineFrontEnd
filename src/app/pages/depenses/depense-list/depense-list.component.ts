import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { DepenseService } from '../../../core/services/depense.service';
import { Depense } from '../../../shared/models/depense.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-depense-list',
  templateUrl: './depense-list.component.html',
  styleUrls: ['./depense-list.component.scss'],
})
export class DepenseListComponent implements OnInit {
  lists: Depense[] = [];
  depenses: Depense[] = [];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  bsConfig: Partial<BsDatepickerConfig>;
  createForm: FormGroup;
  editForm: FormGroup;
  depenseDetailsForm: FormGroup;
  selectedDate: Date;
  term: string = '';
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  factures = [];
  societes = [];

  constructor(private depenseService: DepenseService, private fb: FormBuilder) {
    this.bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY',
      };
  }

  ngOnInit(): void {
    // Initialize the forms
    this.createForm = this.fb.group({
      mois: [''],
      type: [''],
      montant: [''],
      designation: [''],
      motif: [''],
      facture: [''],
      societe: [''],
    });

    this.editForm = this.fb.group({
      mois: [''],
      type: [''],
      montant: [''],
      designation: [''],
      motif: [''],
      facture: [''],
      societe: [''],
    });

    this.depenseDetailsForm = this.fb.group({
      mois: [''],
      type: [''],
      montant: [''],
      designation: [''],
      societe: [''],
    });

    // Fetch initial data
    this.getDepenses();
    this.getFactures();
    this.getSocietes();
  }

  getDepenses(): void {
    this.loading$.next(true); // Start loading
    this.depenseService.getDepenses().subscribe(
      (data) => {
        this.depenses = data;
        this.lists = data;
        console.log("Depenses loaded:", this.depenses); // Debugging line to ensure data is being fetched
        this.loading$.next(false); // Stop loading
      },
      (error) => {
        this.loading$.next(false); // Stop loading
        this.error$.next('An error occurred while fetching the depenses.');
        console.error("Error fetching depenses:", error); // Log the error
      }
    );
  }

  getFactures(): void {
    this.depenseService.getFactures().subscribe((data) => {
      this.factures = data;
      console.log("Factures loaded:", this.factures); // Debugging line
    });
  }

  getSocietes(): void {
    this.depenseService.getSocietes().subscribe((data) => {
      this.societes = data;
      console.log("Societes loaded:", this.societes); // Debugging line
    });
  }

  openCreateModal(content: any): void {
    // Open the modal for creating a new depense
  }

  saveDepense(): void {
    this.depenseService.createDepense(this.createForm.value).subscribe((newDepense) => {
      this.depenses.push(newDepense);
      this.createForm.reset();
      console.log("New depense added:", newDepense); // Debugging line
    });
  }

  editDataGet(depenseId: number, content: any): void {
    // Fetch the depense data to edit and open the modal
  }

  updateDepense(): void {
    this.depenseService.updateDepense(this.editForm.value).subscribe((updatedDepense) => {
      const index = this.depenses.findIndex((d) => d.depenseId === updatedDepense.depenseId);
      this.depenses[index] = updatedDepense;
      this.editForm.reset();
      console.log("Depense updated:", updatedDepense); // Debugging line
    });
  }

  delete(event: any, depenseId: number): void {
    this.depenseService.deleteDepense(depenseId).subscribe(() => {
      this.depenses = this.depenses.filter((d) => d.depenseId !== depenseId);
      console.log("Depense deleted:", depenseId); // Debugging line
    });
  }

  viewDetails(depenseId: number, content: any): void {
    // Fetch depense details and open the modal
  }

  searchDepense(): void {
    // Filter the list of depenses based on the search term
    if (this.term) {
      this.lists = this.depenses.filter((depense) =>
        depense.designation.toLowerCase().includes(this.term.toLowerCase())
      );
    } else {
      this.lists = this.depenses;
    }
  }

  selectStatus(): void {
    // Filter by status if needed
  }

  selectType(): void {
    // Filter by type if needed
  }

  pageChanged(event: any): void {
    // Handle page change event for pagination
  }
}
