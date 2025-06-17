import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as ContratActions from "../../../store/contratClient/contratClient.actions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { TokenUtilService } from "src/app/core/services/token-util.service";

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
    private fb: FormBuilder,
    private store: Store,
    private tokenUtil: TokenUtilService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get("token") || '';
    console.log("📦 Token reçu depuis l'URL :", this.token);
    const clientId = this.tokenUtil.extractClientId(this.token);
  if (clientId) {
    localStorage.setItem('clientId', clientId.toString());
    localStorage.setItem('clientToken', this.token);
  } else {
    console.warn("⚠️ Token invalide ou clientId introuvable");
  }
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
  importerContrat() {
    const clientId = localStorage.getItem('clientId');
  
    if (this.contratForm.valid && this.selectedFile && clientId) {
      const { designation, tjm } = this.contratForm.value;
  
      this.store.dispatch(
        ContratActions.importerContratClient({
          file: this.selectedFile,
          clientId: +clientId,
          designation,
          tjm
        })
      );
  
      Swal.fire({
        icon: "success",
        title: "Contrat importé avec succès !",
        text: `Le contrat "${designation}" a été ajouté.`,
        confirmButtonText: "Consulter mes contrats"
      }).then(() => {
        console.log("✅ Redirection vers les contrats du clientId :", clientId);
        window.location.href = `/contrats-client/${clientId}`;
      });
  
    } else {
      console.error("❌ Formulaire invalide ou clientId manquant");
    }
  }
           
}
