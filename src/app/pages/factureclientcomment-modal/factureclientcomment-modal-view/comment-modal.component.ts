import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommentaireFactureClient } from '../../../shared/models/commentairefactureclient.model';
import { FactureClientService } from '../../../core/services/factureclient.service';
import { CommentaireFactureClientService } from '../../../core/services/commentaire-facture-client.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit, AfterViewChecked {
  @Input() factureId: number | null = null;
  @ViewChild('commentSection') commentSection: ElementRef;
  
  facture: any = null;
  comments: CommentaireFactureClient[] = [];
  newComment: string = '';
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  isInputFocused: boolean = false;
  
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
        console.error('Error fetching facture details', error);
        this.isLoading = false;
      }
    );
  }

  fetchComments(): void {
    if (this.factureId) {
      this.commentaireService.getCommentairesByFacture(this.factureId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response) => {
            // Use the response as is, no need to add like features
            this.comments = response;
            setTimeout(() => this.scrollToBottom(), 100);
          },
          (error) => {
            console.error('Error fetching comments', error);
          }
        );
    }
  }

  addComment(): void {
    if (this.newComment.trim() && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Adding comment', this.newComment);
      console.log('Facture ID', this.factureId);
      // Get user info from a service (replace with your actual user service)
      const userName = 'Utilisateur'; // Replace with actual user name from your auth service
      const comment: CommentaireFactureClient = {
        contenu: this.newComment,
        dateCommentaire: new Date().toISOString(),
        auteurCommentaire: userName,
        factureClientId: this.factureId!
      };

      this.commentaireService.createCommentaire(comment)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe(
          (response) => {
            this.comments.push(response);
            this.newComment = '';
            setTimeout(() => this.scrollToBottom(), 100);
          },
          (error) => {
            console.error('Error adding comment', error);
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
      return 'À l\'instant';
    } else if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffHours < 24) {
      return `${diffHours} h`;
    } else if (diffDays < 7) {
      return `${diffDays} j`;
    } else {
      // Format date for older comments
      return commentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  }
}
