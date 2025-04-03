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
import { CommentaireContrat } from "../../../models/commentaire-contrat.model";
import { ContratClient } from "src/app/models/contratClient.models";
import { ContratSousTraitant } from "src/app/models/contrat.models";
import {
  addCommentaireContrat,
  deleteCommentaireContrat,
  loadCommentairesContrat,
  updateCommentaireContrat,
} from "src/app/store/commentaire-contrat/commentaire-contrat.actions";
import { selectCommentairesLoading } from "src/app/store/commentaire-contrat/commentaire-contrat.selectors";
import { selectCommentairesByContratId } from "src/app/store/contratClient/contratClient-selector";
import { selectCommentairesByContratSousTraitantId } from "src/app/store/commentaire-contrat/commentaire-contrat.selectors";

type CommentaireContratWithEdit = CommentaireContrat & {
  isEditing?: boolean;
  editContent?: string;
};

@Component({
  selector: "app-comment-contrat-modal",
  templateUrl: "./comment-contrat-modal.component.html",
  styleUrls: ["./comment-contrat-modal.component.scss"],
})
export class CommentContratModalComponent implements OnInit, AfterViewInit {
  @Input() contrat!: ContratClient | ContratSousTraitant;
  @Input() contratClientId: number | null = null;
  @Input() token: string | null = null;
  @Input() isClientMode: boolean = false;
  @Input() contratId: number | null = null;
  @Input() isAdminMode: boolean = false;
  @Input() currentUserEmail: string | null = null;

  @ViewChild("commentSection") commentSection!: ElementRef;

  comments$: Observable<CommentaireContratWithEdit[]> = new Observable();
  isLoading$: Observable<boolean> = new Observable();

  newComment: string = "";
  isSubmitting: boolean = false;
  isFocused: boolean = false;
  showDeleteConfirmation: boolean = false;
  commentToDelete: { id: number; index: number } | null = null;
  isLoading = false;
  hasNoComments = false;

  constructor(public modalRef: BsModalRef, private store: Store) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectCommentairesLoading);

    if (this.contratClientId !== null) {
      this.store.dispatch(
        loadCommentairesContrat({ contratId: this.contratClientId })
      );
      this.comments$ = this.store.select(
        selectCommentairesByContratId(this.contratClientId)
      );
    } else if (this.contratId !== null) {
      this.store.dispatch(
        loadCommentairesContrat({
          contratId: this.contratId,
          isSousTraitant: true,
        })
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

    const newCommentaire: CommentaireContrat = {
      contenu: this.newComment,
      auteurCommentaire: auteur,
      dateCommentaire: new Date() as any,
    };

    if (this.contratClientId) {
      newCommentaire.contratClient = { contratClientId: this.contratClientId };
    } else if (this.contratId) {
      newCommentaire.contratSousTraitant = { contratId: this.contratId };
    }

    this.store.dispatch(addCommentaireContrat({ commentaire: newCommentaire }));
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

    const updatedComment: CommentaireContrat = {
      commentaireId: comment.commentaireId,
      contenu: comment.editContent,
      auteurCommentaire: comment.auteurCommentaire,
      dateCommentaire: comment.dateCommentaire,
      ...(this.contratClientId && { contratClient: { contratClientId: this.contratClientId } }),
      ...(this.contratId && { contratSousTraitant: { contratId: this.contratId } }),
    };

    this.store.dispatch(updateCommentaireContrat({ commentaire: updatedComment }));
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
    this.store.dispatch(
      deleteCommentaireContrat({ commentaireId: this.commentToDelete.id })
    );
    this.cancelDelete();
  }

  scrollToBottom(): void {
    if (this.commentSection) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
