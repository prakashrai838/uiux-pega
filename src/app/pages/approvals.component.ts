import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssistantApiService } from '../assistant-api.service';

interface ApprovalRow { id: string; title: string; requester: string; action: string; submitted: string; priority: string; }

@Component({ selector: 'app-approvals', standalone: true, imports: [CommonModule, RouterLink], template: `
  <div class="approval-page-head"><div><p class="eyebrow">WORK QUEUE</p><h1>Approvals</h1><p class="lead">Review actions proposed by the assistant before they’re carried out.</p></div><span class="queue-count"><strong>{{approvals.length}}</strong> waiting for review</span></div>
  <div class="approval-info"><span class="info-icon">i</span><span><strong>You’re in control.</strong> No action runs until an authorized approver confirms it. Your decision is recorded in the case history.</span></div>
  <section class="approval-list"><article class="approval-row" *ngFor="let item of approvals"><div class="approval-initials">{{initials(item.requester)}}</div><div class="approval-main"><div class="approval-title-line"><a [routerLink]="['/cases', item.id]"><strong>{{item.title}}</strong><span>↗</span></a><span class="status-pill needs-approval"><i></i>Needs approval</span></div><p><strong>{{item.requester}}</strong> requested <b>{{item.action}}</b></p><div class="approval-meta"><span>{{item.id}}</span><span>·</span><span>Submitted {{item.submitted}}</span><span>·</span><span class="priority-dot"></span>{{item.priority}} priority</div></div><div class="approval-actions"><button class="button button-secondary" type="button" (click)="decide(item, 'reject')">Reject</button><button class="button button-primary" type="button" (click)="decide(item, 'approve')">Review <span>→</span></button></div></article>
    <div class="empty-state" *ngIf="!approvals.length"><span>✓</span><h3>All caught up</h3><p>There are no approval requests waiting for you.</p></div>
  </section>
  <div class="approval-footnote">Approvals are handled through your organization’s Pega case workflow and access policies.</div>
` })
export class ApprovalsComponent {
  private readonly api = inject(AssistantApiService);
  approvals: ApprovalRow[] = [
    { id: 'PEGA-1042', title: 'Access to finance reporting', requester: 'Alex Morgan', action: 'Finance Reporting viewer access', submitted: '8 min ago', priority: 'High' },
    { id: 'PEGA-1012', title: 'Vendor profile update', requester: 'Maya Patel', action: 'Update remittance contact', submitted: '1 hr ago', priority: 'Standard' },
    { id: 'PEGA-1009', title: 'Travel expense exception', requester: 'Chris Walker', action: 'Approve policy exception', submitted: 'Yesterday', priority: 'Standard' },
  ];
  initials(name: string): string { return name.split(' ').map((part) => part[0]).join(''); }
  decide(item: ApprovalRow, decision: 'approve' | 'reject'): void {
    this.api.decideApproval(item.id, decision).subscribe(() => this.approvals = this.approvals.filter((row) => row.id !== item.id));
  }
}
