import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Consultant } from 'src/app/models/consultant.models';
import { selectUserImage } from 'src/app/store/Authentication/authentication-selector';
import { loadUserImage } from 'src/app/store/Authentication/authentication.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-utilisateurdetailview',
  templateUrl: './utilisateurdetailview.component.html',
  styleUrls: ['./utilisateurdetailview.component.scss']
})
export class UtilisateurdetailviewComponent implements OnInit {
  @Input() consultant!: Consultant;
  @Output() close = new EventEmitter<void>();
  documents: {
    label: string;
    folder: string;
    filename: string;
    path: string | null;
  }[] = [];

  photoUrl: string = 'assets/images/users/avatar-1.jpg';


  constructor(private cdr: ChangeDetectorRef , private store : Store) {}

 ngOnInit(): void {
  if (!this.consultant) return;

  this.store.dispatch(loadUserImage());
  
  this.store.select(selectUserImage).subscribe(img => {
    if (img) 
      this.photoUrl = img;
      
  });
  this.prepareDocuments();
  setTimeout(() => this.cdr.detectChanges(), 100);
}



  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '—';
  }

  closeModal(): void {
    this.close.emit();
  }

  

  prepareDocuments(): void {
    const extract = (f: string | undefined) => f?.split('/').pop() ?? null;
    const pd = this.consultant.personalDetails;

    this.documents = [
      { label: 'Carte Identité', folder: 'cni', filename: extract(pd?.cni), path: this.getFileUrl('cni', extract(pd?.cni)) },
      { label: 'Carte Grise', folder: 'cartegrise', filename: extract(pd?.carteGrise), path: this.getFileUrl('cartegrise', extract(pd?.carteGrise)) },
      { label: 'Navigo', folder: 'navigo', filename: extract(pd?.navigo), path: this.getFileUrl('navigo', extract(pd?.navigo)) },
      { label: 'Attestation', folder: 'attestations', filename: extract(pd?.attestations?.[0]), path: this.getFileUrl('attestations', extract(pd?.attestations?.[0])) },
      { label: 'Contrat', folder: 'contrat', filename: extract(pd?.contart), path: this.getFileUrl('contrat', extract(pd?.contart)) },
      { label: 'KBIS', folder: 'kbis', filename: extract(pd?.kbis), path: this.getFileUrl('kbis', extract(pd?.kbis)) },
      { label: 'URSSAF', folder: 'urssaf', filename: extract(pd?.urssaf), path: this.getFileUrl('urssaf', extract(pd?.urssaf)) },
      { label: 'RIB', folder: 'rib', filename: extract(pd?.rib), path: this.getFileUrl('rib', extract(pd?.rib)) }
    ];
  }

  getFileUrl(folder: string, filename?: string | null): string | null {
    if (!folder || !filename) return null;
    const clean = filename.split('/').pop();
    return `${environment.apiUrl}/auth/files/${folder}/${encodeURIComponent(clean!)}`;
  }

  viewFile(folder: string, filename: string): void {
  if (!folder || !filename) return;

  const token = sessionStorage.getItem('auth-token');
  const url = `${environment.apiUrl}/auth/files/${folder}/${encodeURIComponent(filename)}`;

  fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(async res => {
      if (!res.ok) throw new Error('Fichier introuvable ou non autorisé');

      const blob = await res.blob();
      const fileURL = URL.createObjectURL(blob);
      const ext = filename.split('.').pop()?.toLowerCase();
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        if (ext === 'pdf') {
          newWindow.document.write(`
            <html>
              <head><title>Document</title></head>
              <body style="margin:0">
                <iframe width="100%" height="100%" src="${fileURL}" frameborder="0" style="border:none;"></iframe>
              </body>
            </html>
          `);
        } else {
          newWindow.document.write(`
            <html>
              <head><title>Image</title></head>
              <body style="margin:0">
                <img src="${fileURL}" style="width:100%">
              </body>
            </html>
          `);
        }
      }
    })
    .catch(err => {
      const errorWindow = window.open('', '_blank');
      if (errorWindow) {
        errorWindow.document.write(`<p>Erreur : ${err.message}</p>`);
      }
    });
}

  hasAnyDocument(): boolean {
    const pd = this.consultant?.personalDetails;
    return !!(pd.cni || pd.rib || pd.kbis || pd.urssaf || pd.attestations || pd.contart || pd.navigo || pd.photo || pd.carteGrise);
  }
}
