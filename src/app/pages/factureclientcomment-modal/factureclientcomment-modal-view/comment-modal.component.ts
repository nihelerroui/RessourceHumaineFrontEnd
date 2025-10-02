import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CommentaireFactureClient } from "../../../models/CommentaireFactureClient.models";
import * as FactureActions from "src/app/store/commentaire-facture/commentaire-facture.actions";
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
  @Input() token?: string;
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
  role : string ="";

  constructor(public modalRef: BsModalRef, private store: Store) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectCommentairesLoading);

    if (this.isClientMode && this.token) {
      this.store.dispatch(FactureActions.loadCommentairesClient({ factureId: this.factureId, token: this.token }));
    } else {
      this.store.dispatch(FactureActions.loadCommentairesFactureClient({ factureId: this.factureId }));
    }

    this.comments$ = this.store.select(selectCommentairesByFactureId(this.factureId));

    if (!this.isClientMode) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.currentUserEmail = currentUser?.user?.email || 'Admin inconnu';
      this.role=currentUser.user?.role;
    }
    const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
  this.readOnlyMode = user?.user?.role === 'RESPONSABLE_FINANCIER';

  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  addComment(): void {
    if (!this.newComment.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    let auteur = 'Utilisateur inconnu';

    const commentaire: CommentaireFactureClient = {
      contenu: this.newComment.trim(),
      auteurCommentaire: '',
      factureClient: { factureClientId: this.factureId },
    };

    if (this.isClientMode) {
      if (!this.token) {
        console.error("⛔ Token introuvable !");
        this.isSubmitting = false;
        return;
      }
      commentaire.auteurCommentaire = this.currentUserEmail || 'Client inconnu';
      this.store.dispatch(FactureActions.addCommentClient({ commentaire, token: this.token }));
    } else {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      commentaire.auteurCommentaire = currentUser?.user?.email || 'Admin inconnu';
      this.store.dispatch(FactureActions.addCommentaireFactureClient({ commentaire }));
    }

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

    const updatedComment: CommentaireFactureClient = {
      commentaireId: comment.commentaireId,
      contenu: comment.editContent.trim(),
      auteurCommentaire: this.currentUserEmail || 'Utilisateur inconnu',
      dateCommentaire: comment.dateCommentaire,
      factureClient: { factureClientId: this.factureId },
    };

    if (this.isClientMode && this.token) {
      this.store.dispatch(FactureActions.updateCommentClient({ commentaire: updatedComment, token: this.token }));
    } else {
      this.store.dispatch(FactureActions.updateCommentaireFactureClient({ commentaire: updatedComment }));
    }

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

    if (this.isClientMode && this.token) {
      this.store.dispatch(FactureActions.deleteCommentClient({
        commentaireId: this.commentToDelete.id,
        token: this.token
      }));

      setTimeout(() => {
        this.store.dispatch(FactureActions.loadCommentairesClient({ factureId: this.factureId, token: this.token }));
      }, 200);

    } else {
      this.store.dispatch(FactureActions.deleteCommentaireFactureClient({
        commentaireId: this.commentToDelete.id
      }));

      setTimeout(() => {
        this.store.dispatch(FactureActions.loadCommentairesFactureClient({ factureId: this.factureId }));
      }, 200);
    }

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
