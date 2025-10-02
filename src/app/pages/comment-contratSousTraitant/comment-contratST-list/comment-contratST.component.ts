import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { ContratSousTraitant } from "src/app/models/contrat.models";
import { Observable } from "rxjs";
import { CommentaireContratSousTraitant } from "src/app/models/commentaire-contratSousTraitant.model";
import * as CommentaireContratSousTraitantActions from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.actions";
import { selectCommentairesByContratSousTraitantId, selectLoadingCommentairesContratSousTraitant } from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.selectors";

type CommentaireContratSTWithEdit = CommentaireContratSousTraitant & {
    isEditing?: boolean;
    editContent?: string;
};

@Component({
    selector: "app-comment-contrat-modal",
    templateUrl: "./comment-contratST.component.html",
    styleUrls: ["./comment-contratST.component.scss"],
})
export class CommentContratSTComponent implements OnInit, AfterViewInit {
    comments$!: Observable<CommentaireContratSousTraitant[]>;
    isLoading$!: Observable<boolean>;

    newComment = "";
    isSubmitting = false;
    isFocused = false;
    showDeleteConfirmation = false;
    commentToDelete: number | null = null;

    @Input() contrat!: ContratSousTraitant;
    @Input() contratId: number | null = null;
    @Input() currentUserEmail: string | null = null;
    @Input() readOnlyMode: boolean = false;

    @ViewChild("commentSection") commentSection!: ElementRef;

    constructor(public modalRef: BsModalRef, private store: Store) { }

    ngAfterViewInit(): void {
        setTimeout(() => this.scrollToBottom(), 300);
    }
    ngOnInit(): void {
        if (this.contratId != null) {
            this.store.dispatch(CommentaireContratSousTraitantActions.loadCommentairesContratSousTraitant({ contratSTId: this.contratId }));

            this.comments$ = this.store.select(selectCommentairesByContratSousTraitantId(this.contratId));
            this.isLoading$ = this.store.select(selectLoadingCommentairesContratSousTraitant);
        }
        const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
  this.readOnlyMode = user?.user?.role === 'RESPONSABLE_FINANCIER';
    }

    addComment(): void {
        if (!this.newComment.trim() || this.isSubmitting) return;

        this.isSubmitting = true;

        const auteur = this.currentUserEmail || "Utilisateur inconnu";

        const commentaire: CommentaireContratSousTraitant = {
            contenu: this.newComment,
            auteurCommentaire: auteur,
            dateCommentaire: new Date().toISOString(),
            contratSousTraitant: {
                contratId: this.contratId!,
            } as ContratSousTraitant,
        };

        this.store.dispatch(
            CommentaireContratSousTraitantActions.addCommentaireContratSousTraitant({ commentaire })

        );

        this.newComment = "";
        this.isSubmitting = false;
        setTimeout(() => this.scrollToBottom(), 300);
    }

    startEdit(comment: CommentaireContratSTWithEdit): void {
        comment.isEditing = true;
        comment.editContent = comment.contenu;
    }

    cancelEdit(comment: CommentaireContratSTWithEdit): void {
        comment.isEditing = false;
    }

    saveEdit(comment: CommentaireContratSTWithEdit): void {
        if (!comment.editContent?.trim()) return;

        const updated: CommentaireContratSousTraitant = {
            commentaireId: comment.commentaireId,
            contenu: comment.editContent,
            auteurCommentaire: comment.auteurCommentaire,
            dateCommentaire: comment.dateCommentaire,
            contratSousTraitant: {
                contratId: this.contratId!,
            } as ContratSousTraitant,
        };

        this.store.dispatch(
            CommentaireContratSousTraitantActions.updateCommentaireContratSousTraitant({ commentaire: updated })
        );

        comment.isEditing = false;
    }


    confirmDelete(commentaireId: number): void {
        this.showDeleteConfirmation = true;
        this.commentToDelete = commentaireId;
    }

    cancelDelete(): void {
        this.showDeleteConfirmation = false;
        this.commentToDelete = null;
    }

    confirmDeleteAction(): void {
        if (!this.commentToDelete) return;

        const commentaireId = this.commentToDelete!;

        this.store.dispatch(CommentaireContratSousTraitantActions.deleteCommentaireContratSousTraitant({ commentaireId }));

        this.cancelDelete();
    }

    scrollToBottom(): void {
    if (this.commentSection?.nativeElement) {
      const el = this.commentSection.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

}