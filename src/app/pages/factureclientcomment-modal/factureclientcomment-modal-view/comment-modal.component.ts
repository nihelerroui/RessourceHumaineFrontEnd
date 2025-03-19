import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { CommentaireFactureClient } from "../../../shared/models/commentairefactureclient.model";
import { FactureClientService } from "../../../core/services/factureclient.service";
import { CommentaireFactureClientService } from "../../../core/services/commentaire-facture-client.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-comment-modal",
  templateUrl: "./comment-modal.component.html",
  styleUrls: ["./comment-modal.component.scss"],
})
export class CommentModalComponent implements OnInit, AfterViewChecked {
  @Input() factureId: number | null = null;
  @ViewChild("commentSection") commentSection: ElementRef;

  facture: any = null;
  comments: CommentaireFactureClient[] = [];
  newComment: string = "";
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  isInputFocused: boolean = false;
  showDeleteConfirmation: boolean = false;
  isFocused: boolean = false;

  constructor(
    private factureClientService: FactureClientService,
    private commentaireService: CommentaireFactureClientService,
    public modalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    if (this.factureId) {
      this.loadData();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadData(): void {
    this.isLoading = true;

    // Fetch facture details
    this.factureClientService.getFacturePreview(this.factureId).subscribe(
      (response) => {
        this.facture = response;
        this.fetchComments();
      },
      (error) => {
        console.error("Error fetching facture details", error);
        this.isLoading = false;
      }
    );
  }

  fetchComments(): void {
    if (this.factureId) {
      this.commentaireService
        .getCommentairesByFacture(this.factureId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (response) => {
            // Use the response as is, no need to add like features
            this.comments = response;
            setTimeout(() => this.scrollToBottom(), 100);
          },
          (error) => {
            console.error("Error fetching comments", error);
          }
        );
    }
  }

  addComment(): void {
    if (this.newComment.trim() && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log("Adding comment", this.newComment);
      console.log("Facture ID", this.factureId);
      // Get user info from a service (replace with your actual user service)
      const userName = "Utilisateur"; // Replace with actual user name from your auth service
      const comment: CommentaireFactureClient = {
        contenu: this.newComment,
        auteurCommentaire: userName,
        factureClientId: this.factureId!,
      };

      this.commentaireService
        .createCommentaire(comment)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe(
          (response) => {
            this.comments.push(response);
            this.newComment = "";
            setTimeout(() => this.scrollToBottom(), 100);
          },
          (error) => {
            console.error("Error adding comment", error);
          }
        );
    }
  }

  scrollToBottom(): void {
    if (this.commentSection && this.comments.length > 0) {
      const element = this.commentSection.nativeElement;
      element.scrollTop = element.scrollHeight;
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

    if (diffSecs < 60) {
      return "À l'instant";
    } else if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffHours < 24) {
      return `${diffHours} h`;
    } else if (diffDays < 7) {
      return `${diffDays} j`;
    } else {
      // Format date for older comments
      return commentDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  }

  // Called when the user clicks the "edit" button on a comment
  // Called when the user clicks the "edit" button on a comment
  startEdit(index: number): void {
    const comment = this.comments[index] as any;
    comment.isEditing = true;
    comment.editContent = comment.contenu; // Initialize with the current comment text
  }

  // Cancel the edit mode
  cancelEdit(index: number): void {
    (this.comments[index] as any).isEditing = false;
  }

  // Save the edited comment
  saveEdit(index: number): void {
    const comment = this.comments[index] as any;
    if (comment.editContent && comment.editContent.trim()) {
      const userName = "Utilisateur";
      this.commentaireService
        .updateCommentaire(comment.commentaireId, {
          contenu: comment.editContent,
          auteurCommentaire: userName,
          // Optionally, dateCommentaire can be left null to let the backend handle it
          dateCommentaire: null,
          factureClientId: this.factureId,
        })
        .subscribe(
          (updatedComment) => {
            // Optionally re-add extra properties to the updated comment
            (updatedComment as any).isEditing = false;
            this.comments[index] = updatedComment;
          },
          (error) => {
            console.error("Error updating comment", error);
          }
        );
    }
  }

  // Delete a comment
  deleteComment(commentaireId: number, index: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      this.commentaireService.deleteCommentaire(commentaireId).subscribe(
        () => {
          this.comments.splice(index, 1);
        },
        (error) => {
          console.error("Error deleting comment", error);
        }
      );
    }
  }
  commentToDelete: {
    id: number;
    index: number;
  } | null = null;

  // Modified delete method to show confirmation dialog
  confirmDelete(commentaireId: number, index: number): void {
    this.showDeleteConfirmation = true;
    this.commentToDelete = { id: commentaireId, index: index };
  }

  // Cancel delete action
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.commentToDelete = null;
  }

  // Confirm delete action
  confirmDeleteAction(): void {
    if (this.commentToDelete) {
      this.commentaireService
        .deleteCommentaire(this.commentToDelete.id)
        .subscribe(
          () => {
            this.comments.splice(this.commentToDelete!.index, 1);
            this.showDeleteConfirmation = false;
            this.commentToDelete = null;
          },
          (error) => {
            console.error("Error deleting comment", error);
            this.showDeleteConfirmation = false;
            this.commentToDelete = null;
          }
        );
    }
  }
}
