import { useState, useEffect } from 'react';
import { cernerFhirService } from '@/services/cernerFhirService';

// Define TypeScript interfaces for FHIR resources
interface Patient {
  id: string;
  name?: Array<{
    given?: string[];
    family?: string;
  }>;
  gender?: string;
  birthDate?: string;
  address?: Array<{
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
  }>;
}

interface Observation {
  id: string;
  code?: {
    text?: string;
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  valueQuantity?: {
    value?: number;
    unit?: string;
  };
  effectiveDateTime?: string;
  referenceRange?: Array<{
    low?: { value?: number };
    high?: { value?: number };
  }>;
}

interface Condition {
  id: string;
  clinicalStatus?: {
    coding?: Array<{
      code?: string;
      display?: string;
    }>;
  };
  code?: {
    text?: string;
    coding?: Array<{
      display?: string;
    }>;
  };
  onsetDateTime?: string;
  recordedDate?: string;
  severity?: {
    coding?: Array<{
      display?: string;
    }>;
  };
}

interface DiagnosticReport {
  id: string;
  status?: string;
  code?: {
    text?: string;
    coding?: Array<{
      display?: string;
    }>;
  };
  effectiveDateTime?: string;
  issued?: string;
  conclusion?: string;
  result?: Array<{
    reference?: string;
    display?: string;
  }>;
}

const CernerTestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [diagnosticReports, setDiagnosticReports] = useState<DiagnosticReport[]>([]);
  const patientId = '12724066'; // Example Cerner patient ID
  
  // Format patient name
  const getPatientName = (): string => {
    if (!patient) return 'Loading...';
    const name = patient.name?.[0];
    return name ? `${name.given?.[0] || ''} ${name.family || ''}`.trim() || 'Patient' : 'Patient';
  };

  const fetchPatientData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [patientData, observationsData, conditionsData, reportsData] = await Promise.all([
        cernerFhirService.getPatient(patientId) as Promise<Patient>,
        cernerFhirService.getPatientObservations(patientId) as Promise<Observation[]>,
        cernerFhirService.getPatientConditions(patientId) as Promise<Condition[]>,
        cernerFhirService.getPatientDiagnosticReports(patientId) as Promise<DiagnosticReport[]>,
      ]);
      
      setPatient(patientData);
      setObservations(observationsData || []);
      setConditions(conditionsData || []);
      setDiagnosticReports(reportsData || []);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to load patient data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  // Format observation value with reference range
  const formatObservationValue = (obs: Observation): string => {
    if (!obs.valueQuantity?.value) return 'No value';
    
    const value = obs.valueQuantity.value;
    const unit = obs.valueQuantity.unit || '';
    const refRange = obs.referenceRange?.[0];
    
    if (!refRange) {
      return `${value} ${unit}`;
    }
    
    const lowValue = refRange.low?.value;
    const highValue = refRange.high?.value;
    
    let rangeText = '';
    if (lowValue !== undefined && highValue !== undefined) {
      rangeText = ` (Range: ${lowValue} - ${highValue} ${unit})`;
    } else if (lowValue !== undefined) {
      rangeText = ` (Min: ${lowValue} ${unit})`;
    } else if (highValue !== undefined) {
      rangeText = ` (Max: ${highValue} ${unit})`;
    }
    
    return `${value} ${unit}${rangeText}`;
  };

  // Get condition status text
  const getConditionStatus = (condition: Condition): string => {
    const status = condition.clinicalStatus?.coding?.[0]?.code || 'unknown';
    
    if (status === 'active') return 'Active';
    if (status === 'inactive') return 'Inactive';
    if (status === 'resolved') return 'Resolved';
    if (status === 'remission') return 'In Remission';
    
    return 'Unknown';
  };

  // Get condition severity
  const getConditionSeverity = (condition: Condition): string => {
    return condition.severity?.coding?.[0]?.display || 'Unknown severity';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HealthFlow Analytics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <p>Loading patient data...</p>
      ) : (
        <div className="space-y-6">
          {/* Patient Information */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
            {patient ? (
              <div>
                <p><strong>Name:</strong> {getPatientName()}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Birth Date:</strong> {patient.birthDate}</p>
                {patient.address?.[0] && (
                  <p>
                    <strong>Address:</strong> {patient.address[0].line?.join(', ')}, {patient.address[0].city}, {patient.address[0].state} {patient.address[0].postalCode}
                  </p>
                )}
              </div>
            ) : (
              <p>No patient data available</p>
            )}
          </div>

          {/* Conditions */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Conditions & Diagnoses</h2>
            {conditions.length > 0 ? (
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <div key={condition.id} className="border-b pb-2">
                    <h3 className="font-medium">
                      {condition.code?.text || condition.code?.coding?.[0]?.display || 'Unnamed Condition'}
                    </h3>
                    <p>Status: {getConditionStatus(condition)}</p>
                    <p>Severity: {getConditionSeverity(condition)}</p>
                    {condition.onsetDateTime && (
                      <p>Onset: {new Date(condition.onsetDateTime).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No conditions or diagnoses found for this patient.</p>
            )}
          </div>

          {/* Observations */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Observations</h2>
            {observations.length > 0 ? (
              <div className="space-y-2">
                {observations.map((obs) => (
                  <div key={obs.id} className="border-b pb-2">
                    <h3 className="font-medium">{obs.code?.text || obs.code?.coding?.[0]?.display || 'Observation'}</h3>
                    <p>Value: {formatObservationValue(obs)}</p>
                    <p>Date: {obs.effectiveDateTime ? new Date(obs.effectiveDateTime).toLocaleDateString() : 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No observations available for this patient.</p>
            )}
          </div>

          {/* Diagnostic Reports */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Diagnostic Reports</h2>
            {diagnosticReports.length > 0 ? (
              <div className="space-y-2">
                {diagnosticReports.map((report) => (
                  <div key={report.id} className="border-b pb-2">
                    <h3 className="font-medium">
                      {report.code?.text || report.code?.coding?.[0]?.display || 'Diagnostic Report'}
                    </h3>
                    <p>Status: {report.status || 'unknown'}</p>
                    {report.conclusion && (
                      <p>Conclusion: {report.conclusion}</p>
                    )}
                    {report.effectiveDateTime && (
                      <p>Date: {new Date(report.effectiveDateTime).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No diagnostic reports available for this patient.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CernerTestPage;
