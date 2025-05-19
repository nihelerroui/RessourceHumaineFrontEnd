import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Consultant } from 'src/app/models/consultant.models';

@Component({
  selector: 'app-utilisateurdetailview',
  templateUrl: './utilisateurdetailview.component.html',
  styleUrls: ['./utilisateurdetailview.component.scss']
})
export class UtilisateurdetailviewComponent implements OnInit {
  @Input() consultant!: Consultant;
  @Output() close = new EventEmitter<void>();


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Consultant reçu dans le modal:', this.consultant);

    if (!this.consultant) {
      console.warn('Aucun consultant fourni !');
      return;
    }

    const raw = this.consultant as any;

    // Correction si les noms sont mal typés
    if (raw && raw.personaldetails && !raw.personalDetails) {
      console.log("Correction: renommage de personaldetails → personalDetails");
      raw.personalDetails = raw.personaldetails;
    }

    setTimeout(() => this.cdr.detectChanges(), 100);

  }

  closeModal(): void {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifié';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  }

 hasAnyDocument(): boolean {
    const pd = this.consultant?.personalDetails;
    if (!pd) return false;

    return !!(pd.cni || pd.rib || pd.kbis || pd.urssaf || pd.attestations || pd.contart || pd.navigo || pd.photo || pd.carteGrise);
  }

  
}