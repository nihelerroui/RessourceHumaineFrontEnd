import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactureClientService } from '../../../core/services/factureclient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factureclientdetail',
  templateUrl: './factureclientdetail.component.html',
  styleUrls: ['./factureclientdetail.component.scss']
})
export class FactureClientDetailComponent implements OnInit {
  facturePreview: any;
  totalMontantHt: number = 0;
  constructor(
    private route: ActivatedRoute,
    private factureClientService: FactureClientService,
  ) { }

  ngOnInit(): void {
    // Capture the id from the route parameters
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.getFacturePreview(id);
      }
    });
  }

  getMonthName(dateString: string): string {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const date = new Date(dateString);
    const monthIndex = date.getMonth();
    
    return monthNames[monthIndex];
  }
  

  // Calls the API to fetch the factureclient preview data using the provided id
  getFacturePreview(id: number): void {
    this.factureClientService.getFacturePreview(id).subscribe(
      data => {
        this.facturePreview = data;
        console.log('Facture preview data:', data);

        // Normalize the payment type and status fields
        this.facturePreview.typePaiement = this.normalizeString(this.facturePreview.typePaiement);
        this.facturePreview.statutPaiement = this.normalizeString(this.facturePreview.statutPaiement);
        this.facturePreview.statutFacture = this.normalizeString(this.facturePreview.statutFacture);
        this.calculateTotalMontantHt();
      },
      error => {
        console.error('Error fetching facture preview:', error);
      }
    );
  }

  // Helper function to normalize strings (lowercase entire string and capitalize first letter of each word)
  normalizeString(value: string): string {
    if (!value) return value;

    // Replace underscores with spaces
    value = value.replace(/_/g, ' ');

    // Normalize specific cases
    if (value.toLowerCase() === 'non payée') {
      return 'Non payée';
    } else if (value.toLowerCase() === 'en attente') {
      return 'En attente';
    }

    // Convert the entire string to lowercase, then capitalize the first letter of each word
    return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
  calculateTotalMontantHt(): void {
    this.totalMontantHt = this.facturePreview.prestations.reduce((sum, prestation) => {
      return sum + prestation.montantHt;
    }, 0);
  }
}
