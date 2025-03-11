import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ContratActions from '../../../store/contratClient/contratClient.actions';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContratClient } from 'src/app/store/contratClient/contratClient.models';

@Component({
  selector: 'app-import-contrat',
  templateUrl: './import-contrat.component.html',
  styleUrls: ['./import-contrat.component.css'],
})
export class ImportContratComponent implements OnInit {
  contratForm!: FormGroup;
  selectedFile: File | null = null;
  fileName: string = "Aucun fichier sélectionné";
  fileError: boolean = false;
  fileSelected: boolean = false;


  constructor(private route: ActivatedRoute,private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initForm();
    
  }
  //initialiser le formulaire
  initForm() {
    this.contratForm = this.fb.group({
      designation: ["", Validators.required],
      tjm: ["", [Validators.required]] 
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.fileError = false;
        this.fileSelected = true;
      } else {
        this.selectedFile = null;
        this.fileName = "Aucun fichier sélectionné";
        this.fileError = true;
        this.fileSelected = false;
      }
    }
  }

  // Soumission du formulaire pour importer le contrat
  importerContrat() {
    if (this.contratForm.valid && this.selectedFile) {
      const { designation, tjm } = this.contratForm.value;
      const token = this.route.snapshot.paramMap.get("token");
      this.store.dispatch(
        ContratActions.importerContratClient({
          file: this.selectedFile,
          token,
          designation,
          tjm,
        })
      );

      // Réinitialiser le formulaire après soumission
      this.contratForm.reset();
      this.fileName = "Aucun fichier sélectionné";
      this.selectedFile = null;
    }
  }
}