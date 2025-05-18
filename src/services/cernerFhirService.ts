interface CernerConfig {
  fhirBaseUrl: string;
  headers?: Record<string, string>;
}

class CernerFhirService {
  private config: CernerConfig;

  constructor(config: Partial<CernerConfig> = {}) {
    this.config = {
      fhirBaseUrl: 'http://localhost:3002',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  // Make a request to the FHIR API
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.fhirBaseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.issue?.[0]?.details?.text || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get patient by ID
  async getPatient(patientId: string): Promise<any> {
    const patients = await this.request('/Patient');
    return Array.isArray(patients) 
      ? patients.find((p: any) => p.id === patientId)
      : patients; // Fallback if not an array
  }

  // Search for patients
  async searchPatients(): Promise<any> {
    return this.request('/Patient');
  }

  // Get patient's observations
  async getPatientObservations(patientId: string): Promise<any> {
    const observations = await this.request('/Observation');
    if (!Array.isArray(observations)) return [];
    
    // Filter by patient ID if needed
    return observations.filter((obs: any) => 
      obs.subject?.reference === `Patient/${patientId}` || 
      obs.subject?.reference === patientId
    );
  }

  // Get patient's conditions
  async getPatientConditions(patientId: string): Promise<any> {
    const conditions = await this.request('/Condition');
    if (!Array.isArray(conditions)) return [];
    
    return conditions.filter((condition: any) => 
      condition.subject?.reference === `Patient/${patientId}` || 
      condition.subject?.reference === patientId
    );
  }

  // Get patient's diagnostic reports
  async getPatientDiagnosticReports(patientId: string): Promise<any> {
    const reports = await this.request('/DiagnosticReport');
    if (!Array.isArray(reports)) return [];
    
    return reports.filter((report: any) => 
      report.subject?.reference === `Patient/${patientId}` || 
      report.subject?.reference === patientId
    );
  }

  // Get patient's medications
  async getPatientMedications(patientId: string): Promise<any> {
    const medications = await this.request('/MedicationRequest');
    if (!Array.isArray(medications)) return [];
    
    return medications.filter((med: any) => 
      med.subject?.reference === `Patient/${patientId}` || 
      med.subject?.reference === patientId
    );
  }
}

// Export a singleton instance
export const cernerFhirService = new CernerFhirService();
