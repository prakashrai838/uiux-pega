import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-frame">
      <aside class="sidebar">
        <a class="brand" routerLink="/" aria-label="Northstar home">
          <span class="brand-mark">N</span><span class="brand-copy"><strong>northstar</strong><small>ENTERPRISE ASSISTANT</small></span>
        </a>
        <div class="nav-label">WORKSPACE</div>
        <nav class="main-nav" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><span class="nav-icon">⌂</span> My work</a>
          <a routerLink="/request/new" routerLinkActive="active"><span class="nav-icon">＋</span> New request</a>
          <a routerLink="/approvals" routerLinkActive="active"><span class="nav-icon">✓</span> Approvals<span class="nav-count">3</span></a>
        </nav>
        <div class="sidebar-bottom">
          <div class="secure-note"><span class="secure-dot"></span><span><strong>Secure workspace</strong><small>Enterprise protected</small></span></div>
          <button class="profile-button" type="button"><span class="avatar">AM</span><span class="profile-copy"><strong>Alex Morgan</strong><small>Operations</small></span><span class="more">···</span></button>
        </div>
      </aside>

      <div class="main-column">
        <header class="topbar">
          <div class="breadcrumbs"><span>Northstar</span><span class="crumb-sep">/</span><strong>Assistant workspace</strong></div>
          <div class="topbar-actions"><span class="system-status"><i></i> All systems operational</span><button class="icon-button" aria-label="Help" type="button">?</button><span class="avatar avatar-small">AM</span></div>
        </header>
        <main class="page-shell"><router-outlet /></main>
        <footer class="app-footer"><span>Northstar Enterprise Assistant</span><span><i class="footer-lock">◆</i> Powered by Pega case management</span></footer>
      </div>
    </div>
  `,
})
export class AppComponent {}
