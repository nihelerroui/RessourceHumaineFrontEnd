import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CommentaireFactureClient } from "../../../models/CommentaireFactureClient.models";
import { addCommentaireFactureClient, deleteCommentaireFactureClient, loadCommentairesFactureClient, updateCommentaireFactureClient } from "src/app/store/commentaire-facture/commentaire-facture.actions";
import { selectCommentairesByFactureId, selectCommentairesLoading } from "src/app/store/commentaire-facture/commentaire-facture.selectors";

type CommentaireWithEdit = CommentaireFactureClient & {
  isEditing?: boolean;
  editContent?: string;
};

@Component({
  selector: "app-comment-modal",
  templateUrl: "./comment-modal.component.html",
  styleUrls: ["./comment-modal.component.scss"],
})
export class CommentModalComponent implements OnInit, AfterViewInit {
  @Input() factureId!: number;
  @Input() isClientMode: boolean = false;
  @Input() currentUserEmail: string | null = null;
  @Input() readOnlyMode: boolean = false;

  @ViewChild("commentSection") commentSection!: ElementRef;

  comments$: Observable<CommentaireWithEdit[]> = new Observable();
  isLoading$: Observable<boolean> = new Observable();

  newComment: string = "";
  isSubmitting: boolean = false;
  isFocused: boolean = false;
  showDeleteConfirmation: boolean = false;
  commentToDelete: { id: number; index: number } | null = null;
  facture: any = null;

  constructor(public modalRef: BsModalRef, private store: Store) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectCommentairesLoading);
    this.store.dispatch(loadCommentairesFactureClient({ factureId: this.factureId }));
    this.comments$ = this.store.select(selectCommentairesByFactureId(this.factureId));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  addComment(): void {
    if (!this.newComment.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    let auteur = 'Utilisateur inconnu';

    if (this.isClientMode && this.currentUserEmail) {
      auteur = this.currentUserEmail;
    } else {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      auteur = currentUser?.user?.email || 'Admin inconnu';

    }

    const commentaire: CommentaireFactureClient = {
      contenu: this.newComment.trim(),
      auteurCommentaire: auteur,
      factureClient: { factureClientId: this.factureId },
    };

    this.store.dispatch(addCommentaireFactureClient({ commentaire }));
    this.newComment = "";
    this.isSubmitting = false;
    setTimeout(() => this.scrollToBottom(), 300);
  }

  startEdit(comment: CommentaireWithEdit): void {
    comment.isEditing = true;
    comment.editContent = comment.contenu;
  }

  cancelEdit(comment: CommentaireWithEdit): void {
    comment.isEditing = false;
  }

  saveEdit(comment: CommentaireWithEdit): void {
    if (!comment.editContent?.trim()) return;

    const auteur = this.isClientMode && this.currentUserEmail ? this.currentUserEmail : 'admin@featway.com';

    const updatedComment: CommentaireFactureClient = {
      commentaireId: comment.commentaireId,
      contenu: comment.editContent.trim(),
      auteurCommentaire: auteur,
      dateCommentaire: comment.dateCommentaire,
      factureClient: { factureClientId: this.factureId },
    };

    this.store.dispatch(updateCommentaireFactureClient({ commentaire: updatedComment }));
    comment.isEditing = false;
  }

  confirmDelete(commentaireId: number, index: number): void {
    this.showDeleteConfirmation = true;
    this.commentToDelete = { id: commentaireId, index };
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.commentToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.commentToDelete) return;
    this.store.dispatch(deleteCommentaireFactureClient({ commentaireId: this.commentToDelete.id }));
    this.cancelDelete();
  }

  scrollToBottom(): void {
    if (this.commentSection?.nativeElement) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  getTimeAgo(dateString: string): string {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - commentDate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "À l'instant";
    else if (diffMins < 60) return `${diffMins} min`;
    else if (diffHours < 24) return `${diffHours} h`;
    else if (diffDays < 7) return `${diffDays} j`;
    else
      return commentDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
  }
}
