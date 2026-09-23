import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailReputationResponse {
  email_address: string;
  suggested_correction: string | null;

  email_deliverability: {
    status: string;
    status_detail: string;
    is_format_valid: boolean;
    is_smtp_valid: boolean;
    is_mx_valid: boolean;
    mx_records: string[];
  }

  email_quality?: {
    score: number;
    is_free_email: boolean;
    is_username_suspicious: boolean;
    is_disposable: boolean;
    is_catchall: boolean;
    is_subaddress: boolean;
    is_role: boolean;
    is_dmarc_enforced: boolean;
    is_spf_strict: boolean;
    minimum_age: number | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EmailReputationService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://emailreputation.abstractapi.com/v1/';

  private readonly apiKey = '03ebc464e9f64c8baaca9826e5d30c61';

  verificar(email: string): Observable<EmailReputationResponse> {
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('email', email);

    return this.http.get<EmailReputationResponse>(
      this.apiUrl,
      { params }
    );
  }
}
