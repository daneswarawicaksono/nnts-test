import React, { useState } from 'react';
import type { PatientRecord } from '../../types';
import { soundFX } from '../../services/audioSynth';
import { X, Copy, Check, FileJson, ShieldCheck } from 'lucide-react';

interface FhirExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
}

export const FhirExportModal: React.FC<FhirExportModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Construct valid FHIR R4 Bundle / openEHR Observation payload
  const fhirPayload = {
    resourceType: "Bundle",
    id: `nnts-bundle-${patient.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    meta: {
      profile: [
        "https://fhir.kemkes.go.id/r4/StructureDefinition/ClinicalDecisionSupportBundle",
        "http://openehr.org/fhir/4.0/StructureDefinition/PediatricNutritionTriage"
      ],
      lastUpdated: new Date().toISOString()
    },
    type: "collection",
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            {
              system: "https://fhir.kemkes.go.id/id/satusehat-anonymous-child-id",
              value: patient.id
            }
          ],
          gender: patient.gender === 'P' ? 'female' : 'male',
          extension: [
            {
              url: "https://fhir.kemkes.go.id/StructureDefinition/administrative-age-months",
              valueInteger: patient.ageMonths
            },
            {
              url: "https://fhir.kemkes.go.id/StructureDefinition/posyandu-origin",
              valueString: patient.posyandu
            }
          ]
        }
      },
      {
        fullUrl: `urn:uuid:obs-neuro-latency-${patient.id}`,
        resource: {
          resourceType: "Observation",
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "exam",
                  display: "Exam"
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "98234-8",
                display: "Simple visual reaction time motor latency test"
              }
            ],
            text: "Latensi Motorik Reaksi Sederhana (Dopamin Basal)"
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          effectiveDateTime: `${patient.examDate}T08:30:00+07:00`,
          valueQuantity: {
            value: patient.reactionTime.avgLatency,
            unit: "ms",
            system: "http://unitsofmeasure.org",
            code: "ms"
          },
          referenceRange: [
            {
              low: { value: 350, unit: "ms" },
              high: { value: 420, unit: "ms" },
              type: { text: "Pediatric Normal Range (3-5 Years)" }
            }
          ]
        }
      },
      {
        fullUrl: `urn:uuid:cdss-risk-fe-${patient.id}`,
        resource: {
          resourceType: "RiskAssessment",
          status: "final",
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          occurrenceDateTime: `${patient.examDate}T08:30:00+07:00`,
          basis: [
            { reference: `urn:uuid:obs-neuro-latency-${patient.id}` }
          ],
          prediction: [
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "43952003",
                    display: "Iron deficiency (disorder)"
                  }
                ],
                text: "Defisiensi Zat Besi Pra-Anemia Laten"
              },
              probabilityDecimal: patient.feDeficiencyRisk / 100,
              qualitativeRisk: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/risk-probability",
                    code: patient.feDeficiencyRisk >= 80 ? "high" : patient.feDeficiencyRisk >= 50 ? "moderate" : "low"
                  }
                ]
              }
            },
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "240097008",
                    display: "Zinc deficiency (disorder)"
                  }
                ],
                text: "Defisiensi Seng Subklinis"
              },
              probabilityDecimal: patient.znDeficiencyRisk / 100
            },
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "238128005",
                    display: "Vitamin B12 deficiency"
                  }
                ],
                text: "Defisiensi Vitamin B12"
              },
              probabilityDecimal: patient.b12DeficiencyRisk / 100
            }
          ],
          note: patient.clinicalRationale.map(text => ({ text }))
        }
      },
      {
        fullUrl: `urn:uuid:nutrition-order-${patient.id}`,
        resource: {
          resourceType: "NutritionOrder",
          status: patient.prescriptions.isPrescribed ? "active" : "draft",
          patient: { reference: `urn:uuid:patient-${patient.id}` },
          dateTime: patient.prescriptions.prescribedAt || `${patient.examDate}T09:00:00+07:00`,
          oralDiet: {
            instruction: patient.prescriptions.customNotes
          },
          supplement: [
            ...(patient.prescriptions.ironSyrup ? [{ schedule: [{ asNeededBoolean: false }], instruction: "Sirup Besi Elemental 3 mg/kgBB/hari" }] : []),
            ...(patient.prescriptions.zincSupplement ? [{ schedule: [{ asNeededBoolean: false }], instruction: "Tablet Seng 20 mg/hari (14 hari)" }] : []),
            ...(patient.prescriptions.taburiaMNP ? [{ schedule: [{ asNeededBoolean: false }], instruction: "Bubuk Multi-Mikronutrien (Taburia / MNP)" }] : [])
          ]
        }
      }
    ]
  };

  const jsonString = JSON.stringify(fhirPayload, null, 2);

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in font-clinical">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Ekspor Standar Interoperabilitas HL7 FHIR R4 & openEHR
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> SATUSEHAT Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">Payload rekam medis elektronik (RME) Puskesmas FKTP anonim</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Box */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-teal-300">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-800 px-6 py-3 border-t border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Resource: Bundle (Patient, Observation, RiskAssessment, NutritionOrder)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Tersalin ke Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Salin JSON FHIR
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
