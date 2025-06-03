import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CommentaireContratSousTraitant } from "../../../models/commentaire-contratSousTraitant.model";
import { ContratSousTraitant } from "src/app/models/contrat.models";
import {
  addCommentaireContratSousTraitant,
  deleteCommentaireContratSousTraitant,
  loadCommentairesContratSousTraitant,
  updateCommentaireContratSousTraitant,
} from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.actions";

import {
  selectLoadingCommentairesContratSousTraitant,
  selectCommentairesByContratSousTraitantId,
} from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.selectors";
import { addCommentaireContratClient, deleteCommentaireContratClient, loadCommentairesContratClient, updateCommentaireContratClient } from "src/app/store/commentaire-contratClient/commentaire-contratClient.actions";
import { selectCommentairesByContratClientId, selectLoadingCommentairesContratClient } from "src/app/store/commentaire-contratClient/commentaire-contratClient.selectors";
import { CommentaireContratClient } from "src/app/models/commentaire-contratClient.model";
import { ContratClient } from "src/app/models/contratClient.models";



type CommentaireContratWithEdit =
  (CommentaireContratSousTraitant | CommentaireContratClient) & {
    isEditing?: boolean;
    editContent?: string;
  };

@Component({
  selector: "app-comment-contrat-modal",
  templateUrl: "./comment-contrat.component.html",
  styleUrls: ["./comment-contrat.component.scss"],
})
export class CommentContratComponent implements OnInit, AfterViewInit {
  @Input() contrat!: ContratSousTraitant | ContratClient;
  @Input() contratClientId: number | null = null;
  @Input() contratId: number | null = null;
  @Input() token: string | null = null;
  @Input() isClientMode: boolean = false;
  @Input() isAdminMode: boolean = false;
  @Input() currentUserEmail: string | null = null;

  @ViewChild("commentSection") commentSection!: ElementRef;

  comments$: Observable<CommentaireContratWithEdit[]> = new Observable();
  isLoading$: Observable<boolean> = new Observable();

  newComment = "";
  isSubmitting = false;
  isFocused = false;
  showDeleteConfirmation = false;
  commentToDelete: { id: number; index: number } | null = null;

  constructor(public modalRef: BsModalRef, private store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.isClientMode
      ? this.store.select(selectLoadingCommentairesContratClient)
      : this.store.select(selectLoadingCommentairesContratSousTraitant);

    

    if (this.contratClientId !== null) {
      this.store.dispatch(
        loadCommentairesContratClient({ contratClientId: this.contratClientId })
      );
      this.comments$ = this.store.select(
        selectCommentairesByContratClientId(this.contratClientId)
      );
    } else if (this.contratId !== null) {
      this.store.dispatch(
        loadCommentairesContratSousTraitant({ contratSTId: this.contratId })
      );
      this.comments$ = this.store.select(
        selectCommentairesByContratSousTraitantId(this.contratId)
      );
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  addComment(): void {
    if (!this.newComment.trim() || this.isSubmitting) return;
    this.isSubmitting = true;

    const auteur = this.currentUserEmail || "Utilisateur inconnu";

    if (this.isClientMode && this.contratClientId != null) {
      const commentaireClient: CommentaireContratClient = {
        contenu: this.newComment,
        auteurCommentaire: auteur,
        dateCommentaire: new Date().toISOString(),
        contratClient: this.contrat as ContratClient,
      };
      this.store.dispatch(addCommentaireContratClient({ commentaire: commentaireClient }));
    } else if (this.contratId != null) {
      const commentaireST: CommentaireContratSousTraitant = {
        contenu: this.newComment,
        auteurCommentaire: auteur,
        dateCommentaire: new Date().toISOString(),
        contratSousTraitant: this.contrat as ContratSousTraitant,
      };
      this.store.dispatch(addCommentaireContratSousTraitant({ commentaire: commentaireST }));
    }

    this.newComment = "";
    this.isSubmitting = false;
    setTimeout(() => this.scrollToBottom(), 300);
  }

  startEdit(comment: CommentaireContratWithEdit): void {
    comment.isEditing = true;
    comment.editContent = comment.contenu;
  }

  cancelEdit(comment: CommentaireContratWithEdit): void {
    comment.isEditing = false;
  }

  saveEdit(comment: CommentaireContratWithEdit): void {
    if (!comment.editContent?.trim()) return;

    if (this.isClientMode) {
      const updated: CommentaireContratClient = {
        commentaireId: comment.commentaireId,
        contenu: comment.editContent,
        auteurCommentaire: comment.auteurCommentaire,
        dateCommentaire: comment.dateCommentaire,
        contratClient: { contratClientId: this.contratClientId } as ContratClient,
      };
      this.store.dispatch(updateCommentaireContratClient({ commentaire: updated }));
    } else {
      const updated: CommentaireContratSousTraitant = {
        commentaireId: comment.commentaireId,
        contenu: comment.editContent,
        auteurCommentaire: comment.auteurCommentaire,
        dateCommentaire: comment.dateCommentaire,
        contratSousTraitant: this.contrat as ContratSousTraitant,
      };
      this.store.dispatch(updateCommentaireContratSousTraitant({ commentaire: updated }));
    }

    comment.isEditing = false;
  }

  confirmDelete(commentaireId: number): void {
    this.showDeleteConfirmation = true;
    this.commentToDelete = { id: commentaireId, index: -1 };
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.commentToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.commentToDelete) return;

    if (this.isClientMode) {
      this.store.dispatch(deleteCommentaireContratClient({ commentaireId: this.commentToDelete.id }));
    } else {
      this.store.dispatch(deleteCommentaireContratSousTraitant({ commentaireId: this.commentToDelete.id }));
    }

    this.cancelDelete();
  }

  scrollToBottom(): void {
    if (this.commentSection) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
