import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss']
})
export class ProfileViewComponent implements OnInit {

  consultant: any;
  documents: { label: string, folder : string, filename :string , path: string | null }[] = [];

  ngOnInit(): void {
    const stored = sessionStorage.getItem("currentUser");
    if (stored) {
      this.consultant = JSON.parse(stored);

      const pd = this.consultant.personalDetails;

      this.documents = [
  {
    label: 'Carte Identité',
    folder: 'cni',
    filename: this.consultant?.personalDetails?.cni,
    path: this.getFileUrl('cni', this.consultant?.personalDetails?.cni)
  },
  {
    label: 'Carte Grise',
    folder: 'cartegrise',
    filename: this.consultant?.personalDetails?.carteGrise,
    path: this.getFileUrl('cartegrise', this.consultant?.personalDetails?.carteGrise)
  },
  {
    label: 'Navigo',
    folder: 'navigo',
    filename: this.consultant?.personalDetails?.navigo,
    path: this.getFileUrl('navigo', this.consultant?.personalDetails?.navigo)
  },
  {
    label: 'Attestation',
    folder: 'attestations',
    filename: this.consultant?.personalDetails?.attestations?.[0], // première si liste
    path: this.getFileUrl('attestations', this.consultant?.personalDetails?.attestations?.[0])
  },
  {
    label: 'Contrat',
    folder: 'contrat',
    filename: this.consultant?.personalDetails?.contrat,
    path: this.getFileUrl('contrat', this.consultant?.personalDetails?.contrat)
  },
  {
    label: 'KBIS',
    folder: 'kbis',
    filename: this.consultant?.personalDetails?.kbis,
    path: this.getFileUrl('kbis', this.consultant?.personalDetails?.kbis)
  },
  {
    label: 'URSSAF',
    folder: 'urssaf',
    filename: this.consultant?.personalDetails?.urssaf,
    path: this.getFileUrl('urssaf', this.consultant?.personalDetails?.urssaf)
  },
  {
    label: 'RIB',
    folder: 'rib',
    filename: this.consultant?.personalDetails?.rib,
    path: this.getFileUrl('rib', this.consultant?.personalDetails?.rib)
  }
];


    }
  }

  getFileUrl(folder: string, filename: string): string | null {
  if (!folder || !filename) return null;
  const token = sessionStorage.getItem('auth-token');
  return `${environment.apiUrl}/auth/files/${folder}/${encodeURIComponent(filename)}?token=${token}`;
}



 viewFile(folder: string, filename: string): void {
  if (!folder || !filename) return;

  const token = sessionStorage.getItem('auth-token');
  const url = `${environment.apiUrl}/auth/files/${folder}/${filename}`;

  const newWindow = window.open();
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async res => {
      if (!res.ok) throw new Error('Fichier introuvable ou non autorisé');

      const blob = await res.blob();
      const fileURL = URL.createObjectURL(blob);

      if (newWindow) {
        newWindow.location.href = fileURL;
      }
    })
    .catch(err => {
      if (newWindow) {
        newWindow.document.write(`<p>Erreur : ${err.message}</p>`);
      }
    });
}



  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '—';
  }
 

  readonly roleColors = {
    'ADMINISTRATEUR': {
      primary: '#4f46e5',
      secondary: '#818cf8',
      icon: 'shield'
    },
    'RESPONSABLE_FINANCIER': {
      primary: '#0891b2',
      secondary: '#22d3ee',
      icon: 'landmark'
    },
    'SOUS_TRAITANT': {
      primary: '#059669',
      secondary: '#34d399',
      icon: 'briefcase'
    }
  };

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}



 

  getRoleStyle() {
    const role = this.consultant?.user?.role ?? 'SOUS_TRAITANT';
    return this.roleColors[role] || this.roleColors['SOUS_TRAITANT'];
  }


  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

 

}
