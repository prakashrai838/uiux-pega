import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { environment } from '../environments/environment';
import { CaseEvent, ChatMessage, EnterpriseCase, NewRequest } from './models';

const DEMO_CASES: EnterpriseCase[] = [
  { id: 'PEGA-1042', title: 'Access to finance reporting', category: 'Access request', status: 'Needs approval', owner: 'Alex Morgan', updatedAt: '8 min ago', priority: 'High', summary: 'Request access to the monthly finance reporting workspace.' },
  { id: 'PEGA-1038', title: 'Travel policy question', category: 'Policy help', status: 'In progress', owner: 'Alex Morgan', updatedAt: '32 min ago', priority: 'Standard', summary: 'Clarify hotel limits for a customer visit in Singapore.' },
  { id: 'PEGA-1029', title: 'Laptop replacement request', category: 'IT service', status: 'Completed', owner: 'Alex Morgan', updatedAt: 'Yesterday', priority: 'Standard', summary: 'Replacement request submitted for a damaged laptop.' },
  { id: 'PEGA-1024', title: 'Update vendor details', category: 'Procurement', status: 'Needs information', owner: 'Alex Morgan', updatedAt: 'Yesterday', priority: 'Standard', summary: 'Update remittance details for an approved vendor.' },
  { id: 'PEGA-1017', title: 'Expense policy exception', category: 'Policy help', status: 'Completed', owner: 'Alex Morgan', updatedAt: 'Nov 24', priority: 'Standard', summary: 'Check whether a client dinner is within policy.' },
];

const DEMO_MESSAGES: ChatMessage[] = [
  { id: 'm1', role: 'user', text: 'How do I request access to the monthly finance reporting workspace?', time: '10:02 AM' },
  { id: 'm2', role: 'assistant', text: 'I found the access process. You need your manager’s approval and a business justification. I can prepare the access request for you to review.', time: '10:02 AM', citations: [{ title: 'Finance Systems Access Standard', section: 'Section 3.2 · Requesting access', excerpt: 'Access requests must include a business purpose and be approved by the user’s manager and the data owner.' }, { title: 'Finance Reporting Workspace Guide', section: 'Access and roles', excerpt: 'The Finance Reporting workspace is provisioned through the standard access request workflow.' }] },
  { id: 'm3', role: 'system', text: 'A proposed action is ready for your review.', time: '10:03 AM' },
];

const DEMO_EVENTS: CaseEvent[] = [
  { label: 'Request submitted', detail: 'Submitted by Alex Morgan', time: '10:02 AM', state: 'done' },
  { label: 'Knowledge sources checked', detail: '2 permitted sources matched', time: '10:02 AM', state: 'done' },
  { label: 'Approval requested', detail: 'Waiting for manager review', time: '10:03 AM', state: 'active' },
  { label: 'Access provisioned', detail: 'Runs after approval', time: '—', state: 'pending' },
];

@Injectable({ providedIn: 'root' })
export class AssistantApiService {
  private readonly http = inject(HttpClient);

  listCases(): Observable<EnterpriseCase[]> {
    return environment.demoMode ? of(DEMO_CASES).pipe(delay(180)) : this.http.get<EnterpriseCase[]>(`${environment.apiBaseUrl}/cases`);
  }

  getCase(id: string): Observable<EnterpriseCase> {
    return environment.demoMode
      ? of(DEMO_CASES.find((item) => item.id === id) ?? DEMO_CASES[0]).pipe(delay(120))
      : this.http.get<EnterpriseCase>(`${environment.apiBaseUrl}/cases/${encodeURIComponent(id)}`);
  }

  createRequest(request: NewRequest): Observable<EnterpriseCase> {
    if (!environment.demoMode) return this.http.post<EnterpriseCase>(`${environment.apiBaseUrl}/cases`, request);
    const created: EnterpriseCase = {
      id: `PEGA-${Math.floor(1100 + Math.random() * 800)}`,
      title: request.request.length > 56 ? `${request.request.slice(0, 53)}…` : request.request,
      category: request.category || 'General request',
      status: 'In progress', owner: 'Alex Morgan', updatedAt: 'Just now', priority: 'Standard', summary: request.request,
    };
    return of(created).pipe(delay(350));
  }

  getMessages(id: string): Observable<ChatMessage[]> {
    return environment.demoMode ? of(DEMO_MESSAGES).pipe(delay(100)) : this.http.get<ChatMessage[]>(`${environment.apiBaseUrl}/cases/${encodeURIComponent(id)}/messages`);
  }

  sendMessage(id: string, text: string): Observable<ChatMessage> {
    if (!environment.demoMode) return this.http.post<ChatMessage>(`${environment.apiBaseUrl}/cases/${encodeURIComponent(id)}/messages`, { text });
    return of({ id: crypto.randomUUID(), role: 'assistant' as const, text: 'I’ve added that context to the case. I’m checking the permitted enterprise sources and will update this case when the result is ready.', time: 'Just now' }).pipe(delay(900));
  }

  getEvents(id: string): Observable<CaseEvent[]> {
    return environment.demoMode ? of(DEMO_EVENTS).pipe(delay(100)) : this.http.get<CaseEvent[]>(`${environment.apiBaseUrl}/cases/${encodeURIComponent(id)}/events`);
  }

  decideApproval(id: string, decision: 'approve' | 'reject'): Observable<{ status: string }> {
    if (!environment.demoMode) return this.http.post<{ status: string }>(`${environment.apiBaseUrl}/cases/${encodeURIComponent(id)}/approval`, { decision });
    return of({ status: decision === 'approve' ? 'Approved · action queued' : 'Rejected · case returned to requester' }).pipe(delay(400));
  }
}
