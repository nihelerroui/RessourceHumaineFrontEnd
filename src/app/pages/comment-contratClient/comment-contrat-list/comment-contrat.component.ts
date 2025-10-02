import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as CommentaireContratClientActions from "src/app/store/commentaire-contratClient/commentaire-contratClient.actions";
import { selectCommentairesByContratClientId, selectLoadingCommentairesContratClient } from "src/app/store/commentaire-contratClient/commentaire-contratClient.selectors";
import { CommentaireContratClient } from "src/app/models/commentaire-contratClient.model";
import { ContratClient } from "src/app/models/contratClient.models";



type CommentaireContratWithEdit = CommentaireContratClient & {
  isEditing?: boolean;
  editContent?: string;
};

@Component({
  selector: "app-comment-contrat-modal",
  templateUrl: "./comment-contrat.component.html",
  styleUrls: ["./comment-contrat.component.scss"],
})
export class CommentContratComponent implements OnInit, AfterViewInit {
  @Input() readOnlyMode: boolean = false;
  @Input() contrat!: ContratClient;
  @Input() contratClientId: number | null = null;
  @Input() token: string | null = null;
  @Input() isClientMode: boolean = false;
  @Input() currentUserEmail: string | null = null;

  @ViewChild("commentSection") commentSection!: ElementRef;

  comments$: Observable<CommentaireContratWithEdit[]>;
  isLoading$: Observable<boolean>;

  newComment = "";
  isSubmitting = false;
  isFocused = false;
  showDeleteConfirmation = false;
  commentToDeleteId: number | null = null;

  constructor(public modalRef: BsModalRef, private store: Store) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectLoadingCommentairesContratClient);
    this.comments$ = this.store.select(selectCommentairesByContratClientId(this.contratClientId));
    this.loadCommentaires();
    const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
  this.readOnlyMode = user?.user?.role === 'RESPONSABLE_FINANCIER';
  }
  

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  private loadCommentaires(): void {
    if (this.isClientMode && this.token) {
      this.store.dispatch(CommentaireContratClientActions.loadCommentairesClientContrat({ contratClientId: this.contratClientId!, token: this.token }));
    } else {
      this.store.dispatch(CommentaireContratClientActions.loadCommentairesContratClient({ contratClientId: this.contratClientId! }));
    }
  }

  addComment(): void {
    if (!this.newComment.trim() || this.isSubmitting) return;

    this.isSubmitting = true;

    const commentaire: CommentaireContratClient = {
      contenu: this.newComment,
      auteurCommentaire: this.currentUserEmail || "Utilisateur inconnu",
      dateCommentaire: new Date().toISOString(),
      contratClient: { contratClientId: this.contratClientId! } as ContratClient,
    };

    if (this.isClientMode && this.token) {
      this.store.dispatch(CommentaireContratClientActions.addCommentClientContrat({ commentaire, token: this.token }));
    } else {
      this.store.dispatch(CommentaireContratClientActions.addCommentaireContratClient({ commentaire }));
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

    const updated: CommentaireContratClient = {
      commentaireId: comment.commentaireId,
      contenu: comment.editContent,
      auteurCommentaire: comment.auteurCommentaire,
      dateCommentaire: comment.dateCommentaire,
      contratClient: { contratClientId: this.contratClientId! } as ContratClient,
    };

    if (this.isClientMode && this.token) {
      this.store.dispatch(CommentaireContratClientActions.updateCommentClientContrat({ commentaire: updated, token: this.token }));
    } else {
      this.store.dispatch(CommentaireContratClientActions.updateCommentaireContratClient({ commentaire: updated }));
    }

    comment.isEditing = false;
  }

  confirmDelete(commentaireId: number): void {
    this.commentToDeleteId = commentaireId;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.commentToDeleteId = null;
    this.showDeleteConfirmation = false;
  }

  confirmDeleteAction(): void {
    if (!this.commentToDeleteId) return;

    const id = this.commentToDeleteId;

    if (this.isClientMode && this.token) {
      this.store.dispatch(CommentaireContratClientActions.deleteCommentClientContrat({ commentaireId: id, token: this.token }));
    } else {
      this.store.dispatch(CommentaireContratClientActions.deleteCommentaireContratClient({ commentaireId: id }));
    }

    setTimeout(() => {
      this.loadCommentaires();
      this.scrollToBottom();
    }, 300);

    this.cancelDelete();
  }

  scrollToBottom(): void {
    if (this.commentSection?.nativeElement) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}