import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { fetchFactureById } from '../../../store/Facture/facture.actions';
import { selectFacture, selectLoading, selectError } from '../../../store/Facture/facture.selectors';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.scss']
})
export class FactureListComponent implements OnInit, OnDestroy {
  facture$ = this.store.select(selectFacture);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  // Comment-related properties
  comments: any[] = []; // Array to store comments
  newComment: string = ''; // New comment input
  commenterName: string = ''; // Name of the commentator (from URL)

  // Breadcrumb items
  breadCrumbItems: Array<{}> = [
    { label: 'Factures' },
    { label: 'Detail', active: true }
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    const name = this.route.snapshot.paramMap.get('name')!; // Get the name from the URL
    this.commenterName = name; // Set the commentator's name

    console.log('Facture ID:', id);
    this.store.dispatch(fetchFactureById({ id }));

    // Fetch comments for the facture
    this.fetchComments(id);

    // Initialize tooltips
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      .forEach(tooltipNode => new Tooltip(tooltipNode));
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  // Fetch comments for the facture
  fetchComments(factureId: number) {
    this.http.post<any[]>(`http://localhost:8089/spring/commentairesFacture/byFactureId`, factureId).subscribe({
        next: (data) => {
            this.comments = data.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()); // Sort by newest first
        },
        error: (error) => {
            console.error('Error fetching comments:', error);
        },
    });
}

  // Add a new comment
  addComment() {
    const factureId = +this.route.snapshot.paramMap.get('id')!;
    const comment = {
      contenu: this.newComment,
      dateCreation: new Date().toISOString(),
      factureSousTraitant: { factureId: factureId }
    };

    this.http.post('http://localhost:8089/spring/commentairesFacture', comment).subscribe({
      next: () => {
        this.newComment = ''; // Clear the input
        this.fetchComments(factureId); // Refresh the comments list
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }
}