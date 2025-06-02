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



type CommentaireContratWithEdit = CommentaireContratSousTraitant  & {
  isEditing?: boolean;
  editContent?: string;
};

@Component({
  selector: "app-comment-contrat-modal",
  templateUrl: "./comment-contrat.component.html",
  styleUrls: ["./comment-contrat.component.scss"],
})
export class CommentContratComponent implements OnInit, AfterViewInit {
  @Input() contrat!:ContratSousTraitant;
  //@Input() contratClientId: number | null = null;
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
    this.isLoading$ = this.store.select(selectLoadingCommentairesContratSousTraitant);

    if (this.contratId !== null) {
      this.store.dispatch(loadCommentairesContratSousTraitant({ contratSTId: this.contratId }));
      this.comments$ = this.store.select(selectCommentairesByContratSousTraitantId(this.contratId));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  addComment(): void {
    if (!this.newComment.trim() || this.isSubmitting) return;

    this.isSubmitting = true;

    const auteur = this.currentUserEmail || "Utilisateur inconnu";

    const commentaire: CommentaireContratSousTraitant = {
      contenu: this.newComment,
      auteurCommentaire: auteur,
      dateCommentaire: new Date().toISOString(),
      contratSousTraitant: this.contrat as ContratSousTraitant
    };

    this.store.dispatch(addCommentaireContratSousTraitant({ commentaire }));

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

    const updatedComment: CommentaireContratSousTraitant = {
      commentaireId: comment.commentaireId,
      contenu: comment.editContent,
      auteurCommentaire: comment.auteurCommentaire,
      dateCommentaire: comment.dateCommentaire,
      contratSousTraitant: this.contrat as ContratSousTraitant,
    };

    this.store.dispatch(updateCommentaireContratSousTraitant({ commentaire: updatedComment }));
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
    this.store.dispatch(deleteCommentaireContratSousTraitant({ commentaireId: this.commentToDelete.id }));
    this.cancelDelete();
  }

  scrollToBottom(): void {
    if (this.commentSection) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
