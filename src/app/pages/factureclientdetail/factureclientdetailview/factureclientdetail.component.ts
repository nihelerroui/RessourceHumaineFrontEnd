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

  // Calls the API to fetch the factureclient preview data using the provided id
  getFacturePreview(id: number): void {
    this.factureClientService.getFacturePreview(id).subscribe(
      data => {
        this.facturePreview = data;
        console.log('Facture preview data:', data);
      },
      error => {
        console.error('Error fetching facture preview:', error);
      }
    );
  }
}
