import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-utilisateurdetailview',
  templateUrl: './utilisateurdetailview.component.html',
  styleUrls: ['./utilisateurdetailview.component.scss']
})
export class UtilisateurdetailviewComponent implements OnInit {
  @Input() user: any;
  @Output() close = new EventEmitter<void>();


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Personal Details:', this.user?.consultant?.personalDetails);

   console.log("User received in modal:", this.user);

  // Vérification si l'utilisateur est bien chargé
  if (!this.user) {
    console.warn("Aucun utilisateur reçu !");
    return;
  }

  const raw = this.user?.consultant as any;

  // Vérification de l'existence de `personalDetails` ou `personaldetails`
  if (raw) {
    if (raw.personalDetails) {
      console.log("✅ Personal Details found:", raw.personalDetails);
    } else if (raw.personaldetails) {
      console.log("✅ Found `personaldetails`, correcting...");
      raw.personalDetails = raw.personaldetails;
      console.log("🔁 Corrected Personal Details:", raw.personalDetails);
    } else {
      console.warn("❌ Aucune donnée `personalDetails` trouvée !");
    }
  }

  // Forcer la mise à jour pour afficher les données corrigées
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
    const personalDetails = this.user?.consultant?.personalDetails;
    if (!personalDetails) return false;
    
    return !!(
      personalDetails.cni ||
      personalDetails.rib ||
      personalDetails.carteGrise ||
      personalDetails.kbis ||
      personalDetails.urssaf ||
      personalDetails.attestations ||
      personalDetails.contart
    );
  }

  
}