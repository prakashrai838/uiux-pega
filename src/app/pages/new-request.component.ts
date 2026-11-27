import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AssistantApiService } from '../assistant-api.service';

@Component({ selector: 'app-new-request', standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `
  <a class="back-link" routerLink="/">← Back to My work</a>
  <div class="form-page-grid"><section class="request-form-column">
    <p class="eyebrow">NEW CASE</p><h1>What do you need help with?</h1><p class="lead">Describe what you need in your own words. The assistant will find relevant guidance and help move your request forward.</p>
    <form (ngSubmit)="submit()" #requestForm="ngForm">
      <label class="field-label" for="requestText">Your request <span class="required">*</span></label>
      <textarea id="requestText" name="requestText" [(ngModel)]="requestText" required minlength="8" rows="5" placeholder="For example: I need access to the monthly finance reporting workspace for the Q4 forecast review."></textarea>
      <div class="field-meta"><span>Include the goal and any helpful context.</span><span>{{requestText.length}} / 2000</span></div>

      <label class="field-label" for="requestCategory">Request type</label>
      <select id="requestCategory" name="category" [(ngModel)]="category"><option value="">Choose a category</option><option>Policy help</option><option>Access request</option><option>IT service</option><option>Procurement</option><option>Other</option></select>

      <div class="field-label file-label">Attachments <span class="optional">Optional</span></div>
      <label class="upload-box"><input type="file" multiple (change)="onFiles($event)" aria-label="Add attachments"><span class="upload-icon">↑</span><span><strong>Choose files to upload</strong><small>PDF, DOCX, PNG or JPG · up to 20 MB each</small></span><span class="upload-browse">Browse</span></label>
      <div class="file-chips" *ngIf="files.length"><span *ngFor="let file of files">📎 {{file}} <button type="button" (click)="removeFile(file)" aria-label="Remove file">×</button></span></div>

      <div class="privacy-callout"><span>⌑</span><div><strong>Your request is protected</strong><small>Only include information needed to resolve your request. Access follows your company permissions.</small></div></div>
      <div class="form-actions"><a class="button button-secondary" routerLink="/">Cancel</a><button class="button button-primary" type="submit" [disabled]="!requestForm.valid || submitting">{{submitting ? 'Creating case…' : 'Submit request'}} <span>→</span></button></div>
      <p class="error-message" *ngIf="error">{{error}}</p>
    </form>
  </section><aside class="request-aside"><div class="aside-icon">✦</div><h3>One request, a clear path forward.</h3><p>Your assistant can find trusted company guidance, prepare actions, and route approvals through the right people.</p><ul><li><span>✓</span> Answers include source references</li><li><span>✓</span> Sensitive actions require approval</li><li><span>✓</span> Progress stays visible in your case</li></ul><div class="aside-foot"><span class="shield">◆</span> Protected by your enterprise access controls</div></aside></div>
` })
export class NewRequestComponent {
  private readonly api = inject(AssistantApiService);
  private readonly router = inject(Router);
  requestText = '';
  category = '';
  files: string[] = [];
  submitting = false;
  error = '';
  onFiles(event: Event): void { const input = event.target as HTMLInputElement; this.files = [...this.files, ...Array.from(input.files ?? []).map((file) => file.name)]; }
  removeFile(name: string): void { this.files = this.files.filter((file) => file !== name); }
  submit(): void {
    if (!this.requestText.trim() || this.submitting) return;
    this.submitting = true; this.error = '';
    this.api.createRequest({ request: this.requestText.trim(), category: this.category, files: this.files }).subscribe({
      next: (item) => this.router.navigate(['/cases', item.id]),
      error: () => { this.error = 'We couldn’t create the case. Your request is saved here; please try again.'; this.submitting = false; },
    });
  }
}
