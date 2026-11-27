import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssistantApiService } from '../assistant-api.service';
import { CaseEvent, ChatMessage, EnterpriseCase } from '../models';

@Component({ selector: 'app-workspace', standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `
  <div class="case-topline"><div><a class="back-link" routerLink="/">← My work</a><div class="case-heading"><span class="case-id-large">{{caseItem?.id || caseId}}</span><span class="status-pill" [ngClass]="caseItem?.status?.toLowerCase()?.replaceAll(' ', '-') || 'in-progress'"><i></i>{{caseItem?.status || 'In progress'}}</span></div><h1>{{caseItem?.title || 'Your request'}}</h1></div><a class="button button-secondary" [routerLink]="['/cases', caseId, 'details']">Case details <span>↗</span></a></div>
  <div class="workspace-grid"><section class="conversation-card">
    <div class="conversation-header"><div class="assistant-avatar">✦</div><div><strong>Northstar assistant</strong><small><i class="online-dot"></i> Here to help</small></div><button class="icon-button more-button" aria-label="More options">···</button></div>
    <div class="conversation-scroll">
      <div class="date-divider"><span>Today · 10:02 AM</span></div>
      <article class="message-row" *ngFor="let message of messages" [ngClass]="message.role">
        <div class="message-avatar" *ngIf="message.role === 'assistant'">✦</div>
        <div class="message-content"><div class="message-bubble"><p>{{message.text}}</p></div>
          <div class="citation-list" *ngIf="message.citations?.length"><div class="citation-heading">SOURCES USED <span>· {{message.citations?.length}}</span></div><article class="citation-card" *ngFor="let citation of message.citations"><div class="citation-mark">▤</div><div><strong>{{citation.title}}</strong><small>{{citation.section}}</small><p>{{citation.excerpt}}</p></div><span class="external-mark">↗</span></article><p class="source-disclaimer">You can view sources you have permission to access.</p></div>
          <time>{{message.time}}</time>
        </div>
      </article>
      <section class="proposed-action"><div class="action-top"><span class="action-icon">↗</span><div><strong>Proposed action</strong><small>Review before anything is submitted</small></div><span class="approval-chip">APPROVAL REQUIRED</span></div><div class="action-body"><strong>Request access to Finance Reporting</strong><p>Workspace role: Monthly reporting viewer</p><p>Business purpose: Q4 forecast review</p></div><div class="action-footer"><span>Manager approval is required by policy.</span><a routerLink="/approvals">Review action <span>→</span></a></div></section>
      <div class="async-status"><span class="pulse-dot"></span><span><strong>Waiting for manager approval</strong><small>Your case will update as soon as there’s progress.</small></span><button type="button" (click)="refresh()">↻</button></div>
    </div>
    <form class="composer" (ngSubmit)="send()"><textarea name="reply" [(ngModel)]="reply" rows="1" placeholder="Ask a follow-up or add context…" [disabled]="sending"></textarea><div class="composer-bottom"><span><span class="composer-lock">◆</span> Case updates are securely recorded</span><button type="submit" class="send-button" [disabled]="!reply.trim() || sending" aria-label="Send message">{{sending ? '…' : '↑'}}</button></div></form>
  </section>
  <aside class="context-column"><section class="context-card"><div class="context-title"><h3>Request details</h3><button class="icon-button" aria-label="More request details">···</button></div><dl><div><dt>Request type</dt><dd>{{caseItem?.category || 'Access request'}}</dd></div><div><dt>Requested by</dt><dd><span class="mini-avatar">AM</span> {{caseItem?.owner || 'Alex Morgan'}}</dd></div><div><dt>Priority</dt><dd><span class="priority-dot"></span>{{caseItem?.priority || 'Standard'}}</dd></div><div><dt>Created</dt><dd>Today, 10:02 AM</dd></div></dl><a class="context-link" [routerLink]="['/cases', caseId, 'details']">View full case details <span>→</span></a></section>
    <section class="context-card activity-card"><div class="context-title"><h3>Activity</h3><a [routerLink]="['/cases', caseId, 'details']">View all</a></div><div class="mini-timeline"><div class="mini-event" *ngFor="let event of events" [ngClass]="event.state"><span class="timeline-dot">{{event.state === 'done' ? '✓' : ''}}</span><div><strong>{{event.label}}</strong><small>{{event.detail}}</small><time>{{event.time}}</time></div></div></div></section>
    <section class="help-card"><span>⌑</span><div><strong>Need a person?</strong><p>Your case can be routed to the right team at any time.</p><button type="button" (click)="requestHuman()">Ask for human help <span>→</span></button></div></section>
  </aside></div>
` })
export class WorkspaceComponent implements OnInit {
  private readonly api = inject(AssistantApiService);
  private readonly route = inject(ActivatedRoute);
  caseId = '';
  caseItem?: EnterpriseCase;
  messages: ChatMessage[] = [];
  events: CaseEvent[] = [];
  reply = '';
  sending = false;
  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('id') ?? 'PEGA-1042';
    this.api.getCase(this.caseId).subscribe((item) => this.caseItem = item);
    this.api.getMessages(this.caseId).subscribe((items) => this.messages = items);
    this.api.getEvents(this.caseId).subscribe((items) => this.events = items);
  }
  send(): void {
    const text = this.reply.trim(); if (!text || this.sending) return;
    this.messages = [...this.messages, { id: crypto.randomUUID(), role: 'user', text, time: 'Just now' }];
    this.reply = ''; this.sending = true;
    this.api.sendMessage(this.caseId, text).subscribe({ next: (message) => { this.messages = [...this.messages, message]; this.sending = false; }, error: () => { this.sending = false; } });
  }
  refresh(): void { this.api.getEvents(this.caseId).subscribe((items) => this.events = items); }
  requestHuman(): void { this.reply = 'Please route this case to a person for help.'; }
}
