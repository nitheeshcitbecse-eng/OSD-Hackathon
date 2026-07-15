from __future__ import annotations

from domain.models import BehaviorSignals, ContextSignals, IncidentSummary, PersonState, ThreatAssessment


class IncidentGenerator:
    def generate(self, person_state: PersonState, behavior: BehaviorSignals, context: ContextSignals, assessment: ThreatAssessment) -> IncidentSummary:
        title = 'Suspicious Presence Detected' if assessment.level != 'NORMAL' else 'Observation Recorded'
        short_summary = 'An unidentified person remained near the monitored area.' if assessment.level != 'NORMAL' else 'A person was observed near the monitored area.'
        detailed_summary = (
            f"An unidentified individual was observed near the monitored area for {behavior.presence_duration:.1f} seconds. "
            f"Temporal tracking indicated prolonged presence and persistent face unavailability. "
            f"The event occurred during configured restricted hours. "
            f"The combined evidence produced a {assessment.level.lower()} threat assessment."
            if assessment.level != 'NORMAL' else
            f"A person was observed near the monitored area for {behavior.presence_duration:.1f} seconds."
        )
        return IncidentSummary(title=title, short_summary=short_summary, detailed_summary=detailed_summary)
