import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssistantApiService } from '../assistant-api.service';
import { EnterpriseCase } from '../models';

@Component({ selector: 'app-home', standalone: true, imports: [CommonModule, RouterLink], template: `
  <section class="welcome-row">
    <div><p class="eyebrow">THURSDAY, NOVEMBER 27</p><h1>Good morning, Alex <span class="wave">✳</span></h1><p class="lead">What can we help you move forward today?</p></div>
    <a routerLink="/request/new" class="button button-primary"><span>＋</span> New request</a>
  </section>

  <section class="prompt-banner">
    <div class="banner-orb">✦</div><div class="banner-copy"><strong>Start with a question. We’ll take it from there.</strong><span>Get answers from trusted company knowledge or ask us to take action.</span></div>
    <a routerLink="/request/new" class="banner-cta">Ask the assistant <span>→</span></a>
  </section>

  <section class="metrics-grid" aria-label="Request summary">
    <article class="metric-card"><div class="metric-head"><span>In progress</span><span class="metric-icon blue">◷</span></div><strong>4</strong><small>Requests being worked on</small></article>
    <article class="metric-card"><div class="metric-head"><span>Needs your attention</span><span class="metric-icon amber">!</span></div><strong>2</strong><small>Information or action needed</small></article>
    <article class="metric-card"><div class="metric-head"><span>Completed this month</span><span class="metric-icon green">✓</span></div><strong>18</strong><small>Resolved requests</small></article>
  </section>

  <section class="section-heading"><div><h2>Your requests</h2><p>Track progress and pick up where you left off.</p></div><a class="text-link" routerLink="/approvals">View approvals <span>→</span></a></section>
  <section class="table-card">
    <div class="table-toolbar"><div class="search-box"><span>⌕</span><input aria-label="Search requests" placeholder="Search your requests"></div><button class="filter-button">All requests <span>⌄</span></button></div>
    <div class="table-scroll"><table><thead><tr><th>REQUEST</th><th>TYPE</th><th>STATUS</th><th>LAST UPDATED</th><th></th></tr></thead><tbody>
      <tr *ngFor="let item of cases()"><td><a class="case-title" [routerLink]="['/cases', item.id]"><span class="case-id">{{item.id}}</span><strong>{{item.title}}</strong></a></td><td>{{item.category}}</td><td><span class="status-pill" [ngClass]="statusClass(item.status)"><i></i>{{item.status}}</span></td><td class="muted">{{item.updatedAt}}</td><td><a class="row-arrow" [routerLink]="['/cases', item.id]" [attr.aria-label]="'Open ' + item.id">↗</a></td></tr>
    </tbody></table></div>
    <div class="table-foot"><span>Showing {{cases().length}} recent requests</span><a routerLink="/">View all requests <span>→</span></a></div>
  </section>
  <section class="trust-note"><span class="trust-icon">⌑</span><span><strong>Your information stays protected.</strong> Responses use sources you’re permitted to access, and actions are recorded in your case history.</span><a routerLink="/cases/PEGA-1042/details">How it works</a></section>
` })
export class HomeComponent implements OnInit {
  private readonly api = inject(AssistantApiService);
  cases = signal<EnterpriseCase[]>([]);
  ngOnInit(): void { this.api.listCases().subscribe((items) => this.cases.set(items)); }
  statusClass(status: string): string { return status.toLowerCase().replaceAll(' ', '-'); }
}

