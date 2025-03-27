import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-import-contrat",
  templateUrl: "./import-contrat.component.html",
})
export class ImportContratComponent implements OnInit {
  contratForm!: FormGroup;
  selectedFile: File | null = null;
  fileName: string = "Aucun fichier sélectionné";
  fileError: boolean = false;
  fileSelected: boolean = false;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get("token") || "";
  this.token = String(this.token);
  console.log("✅ Token converti :", this.token, "Type:", typeof this.token);
    this.initForm();
  }
  

  // Initialisation du formulaire
  initForm() {
    this.contratForm = this.fb.group({
      designation: ["", Validators.required],
      tjm: ["", [Validators.required]],
    });
  }

  // Sélection d'un fichier
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

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
  // Soumission du formulaire d'importation
  importerContrat() {
    if (this.contratForm.valid && this.selectedFile && this.token) {
      const { designation, tjm } = this.contratForm.value;

      this.store.dispatch(
        ContratActions.importerContratClient({
          file: this.selectedFile,
          token: this.token,
          designation,
          tjm,
        })
      );
      Swal.fire({
        icon: "success",
        title: "Contrat importé avec succès !",
        text: `Le contrat "${designation}" a été ajouté.`,
        confirmButtonText: "Consulter mes contrats"
      }).then(() => {
        
        if (Array.isArray(this.token)) {
          this.token = this.token[0];
        } else if (typeof this.token === "object") {
          this.token = JSON.stringify(this.token); 
        }
      
        console.log("✅ Token Final :", this.token);
        if (typeof this.token === "string" && this.token.trim().length > 0) {
          console.log('🔁 REDIRECTION VERS:', `/client-interface/contrats-client/${encodeURIComponent(this.token.trim())}`);
          console.log('🔍 Type token:', typeof this.token);
          console.log('🧪 Token:', this.token);
          window.location.href = `/client-interface/contrats-client/${encodeURIComponent(this.token.trim())}`;
        } else {
          console.error("ERREUR : Token invalide, la navigation est annulée.");
        }
      });
      
    }}           
}
