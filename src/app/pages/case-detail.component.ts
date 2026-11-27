import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssistantApiService } from '../assistant-api.service';
import { CaseEvent, EnterpriseCase } from '../models';

@Component({ selector: 'app-case-detail', standalone: true, imports: [CommonModule, RouterLink], template: `
  <a class="back-link" [routerLink]="['/cases', caseId]">← Back to assistant</a>
  <div class="detail-header"><div><p class="eyebrow">CASE RECORD</p><div class="case-heading"><span class="case-id-large">{{caseItem()?.id || caseId}}</span><span class="status-pill needs-approval"><i></i>{{caseItem()?.status || 'Needs approval'}}</span></div><h1>{{caseItem()?.title || 'Access to finance reporting'}}</h1></div><button class="button button-secondary" type="button">··· <span>More</span></button></div>
  <nav class="detail-tabs"><a class="selected">Overview</a><a [routerLink]="['/cases', caseId]">Conversation</a><a class="disabled-tab">Related work <span class="tab-count">0</span></a></nav>
  <div class="detail-layout"><section class="detail-main"><article class="detail-card"><div class="detail-card-head"><h2>Request summary</h2><span class="subtle-label">Submitted today</span></div><p class="detail-summary">{{caseItem()?.summary || 'Request access to the monthly finance reporting workspace for the Q4 forecast review.'}}</p><div class="detail-fields"><div><small>Request type</small><strong>{{caseItem()?.category || 'Access request'}}</strong></div><div><small>Requested by</small><strong><span class="mini-avatar">AM</span> {{caseItem()?.owner || 'Alex Morgan'}}</strong></div><div><small>Priority</small><strong><span class="priority-dot"></span>{{caseItem()?.priority || 'High'}}</strong></div><div><small>Case owner</small><strong>Finance Systems</strong></div></div></article>
    <article class="detail-card"><div class="detail-card-head"><div><h2>Activity history</h2><p>Every important case event, in one place.</p></div><button class="button button-secondary small-button">Export history ↓</button></div><div class="full-timeline"><div class="full-event" *ngFor="let event of events()" [ngClass]="event.state"><span class="full-timeline-dot">{{event.state === 'done' ? '✓' : ''}}</span><div><strong>{{event.label}}</strong><p>{{event.detail}}</p></div><time>{{event.time}}</time></div></div></article>
    <article class="detail-card source-detail"><div class="detail-card-head"><div><h2>Knowledge sources</h2><p>References used to answer this request.</p></div><span class="source-count">2 sources</span></div><div class="source-row"><span class="citation-mark">▤</span><div><strong>Finance Systems Access Standard</strong><small>Section 3.2 · Requesting access</small></div><span class="source-access">Accessible</span></div><div class="source-row"><span class="citation-mark">▤</span><div><strong>Finance Reporting Workspace Guide</strong><small>Access and roles</small></div><span class="source-access">Accessible</span></div></article>
  </section><aside class="detail-side"><article class="detail-card"><h3>Case metadata</h3><dl><div><dt>Created</dt><dd>Nov 27, 2026 · 10:02 AM</dd></div><div><dt>Last updated</dt><dd>{{caseItem()?.updatedAt || '8 min ago'}}</dd></div><div><dt>Channel</dt><dd>Enterprise Assistant</dd></div><div><dt>Correlation ID</dt><dd class="mono">ai-7f3a…1042</dd></div></dl></article><article class="audit-note"><span>⌑</span><div><strong>Audited and protected</strong><p>Sources, approvals, and action outcomes are retained with this case.</p></div></article></aside></div>
` })
export class CaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AssistantApiService);
  caseId = '';
  caseItem = signal<EnterpriseCase | undefined>(undefined);
  events = signal<CaseEvent[]>([]);
  ngOnInit(): void { this.caseId = this.route.snapshot.paramMap.get('id') ?? 'PEGA-1042'; this.api.getCase(this.caseId).subscribe((item) => this.caseItem.set(item)); this.api.getEvents(this.caseId).subscribe((items) => this.events.set(items)); }
}

