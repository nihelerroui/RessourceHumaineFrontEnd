import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectUserImage } from "src/app/store/Authentication/authentication-selector";
import { loadUserImage } from "src/app/store/Authentication/authentication.actions";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-profileview",
  templateUrl: "./profileview.component.html",
  styleUrls: ["./profileview.component.scss"],
})
export class ProfileViewComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;

  consultant: any;
  documents: {
    label: string;
    folder: string;
    filename: string;
    path: string | null;
  }[] = [];
  profileForm: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard", path: "/" },
      { label: "Profile", active: true },
    ];

    const stored = sessionStorage.getItem("currentUser");
    if (stored) {
      this.consultant = JSON.parse(stored);

      const pd = this.consultant.personalDetails;
      this.store.dispatch(loadUserImage());

      this.store.select(selectUserImage).subscribe((img) => {
        if (img) {
          this.consultant.photoUrl = img;
        }
      });

      const extractFilename = (fullPath: string | undefined): string | null => {
        if (!fullPath) return null;
        return fullPath.split("/").pop() ?? null;
      };

      this.documents = [
        {
          label: "Carte Identité",
          folder: "cni",
          filename: extractFilename(this.consultant?.personalDetails?.cni),
          path: this.getFileUrl(
            "cni",
            extractFilename(this.consultant?.personalDetails?.cni)
          ),
        },
        {
          label: "Carte Grise",
          folder: "cartegrise",
          filename: extractFilename(
            this.consultant?.personalDetails?.carteGrise
          ),
          path: this.getFileUrl(
            "cartegrise",
            extractFilename(this.consultant?.personalDetails?.carteGrise)
          ),
        },
        {
          label: "Navigo",
          folder: "navigo",
          filename: extractFilename(this.consultant?.personalDetails?.navigo),
          path: this.getFileUrl(
            "navigo",
            extractFilename(this.consultant?.personalDetails?.navigo)
          ),
        },
        {
          label: "Attestation",
          folder: "attestations",
          filename: extractFilename(
            this.consultant?.personalDetails?.attestations?.[0]
          ),
          path: this.getFileUrl(
            "attestations",
            extractFilename(this.consultant?.personalDetails?.attestations?.[0])
          ),
        },
        {
          label: "Contrat",
          folder: "contrat",
          filename: extractFilename(this.consultant?.personalDetails?.contart),
          path: this.getFileUrl(
            "contrat",
            this.consultant?.personalDetails?.contart
          ),
        },
        {
          label: "KBIS",
          folder: "kbis",
          filename: extractFilename(this.consultant?.personalDetails?.kbis),
          path: this.getFileUrl(
            "kbis",
            extractFilename(this.consultant?.personalDetails?.kbis)
          ),
        },
        {
          label: "URSSAF",
          folder: "urssaf",
          filename: extractFilename(this.consultant?.personalDetails?.urssaf),
          path: this.getFileUrl(
            "urssaf",
            extractFilename(this.consultant?.personalDetails?.urssaf)
          ),
        },
        {
          label: "RIB",
          folder: "rib",
          filename: extractFilename(this.consultant?.personalDetails?.rib),
          path: this.getFileUrl("rib", this.consultant?.personalDetails?.rib),
        },
      ];
    }
  }

  getFileUrl(folder: string, filename?: string | null): string | null {
    if (!folder || !filename) return null;

    const cleanFilename = filename.split("/").pop();

    return `${environment.apiUrl}/auth/files/${folder}/${encodeURIComponent(
      cleanFilename
    )}`;
  }

  viewFile(folder: string, filename: string): void {
    if (!folder || !filename) return;

    const token = sessionStorage.getItem("auth-token");
    const url = `${
      environment.apiUrl
    }/auth/files/${folder}/${encodeURIComponent(filename)}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Fichier introuvable ou non autorisé");

        const blob = await res.blob();
        const fileURL = URL.createObjectURL(blob);

        const ext = filename.split(".").pop()?.toLowerCase();
        const newWindow = window.open("", "_blank");

        if (newWindow) {
          if (ext === "pdf") {
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
            <html><body style="margin:0"><img src="${fileURL}" style="width:100%"/></body></html>
          `);
          }
        }
      })
      .catch((err) => {
        const errorWindow = window.open("", "_blank");
        if (errorWindow) {
          errorWindow.document.write(`<p>Erreur : ${err.message}</p>`);
        }
      });
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : "—";
  }

  readonly roleColors = {
    ADMINISTRATEUR: {
      primary: "#4f46e5",
      secondary: "#818cf8",
      icon: "shield",
    },
    RESPONSABLE_FINANCIER: {
      primary: "#0891b2",
      secondary: "#22d3ee",
      icon: "landmark",
    },
    SOUS_TRAITANT: {
      primary: "#059669",
      secondary: "#34d399",
      icon: "briefcase",
    },
  };

  constructor(private router: Router, private store: Store) {}

  getRoleStyle() {
    const role = this.consultant?.user?.role ?? "SOUS_TRAITANT";
    return this.roleColors[role] || this.roleColors["SOUS_TRAITANT"];
  }

  editProfile(): void {
    this.router.navigate(["/profile/edit"]);
  }
}
