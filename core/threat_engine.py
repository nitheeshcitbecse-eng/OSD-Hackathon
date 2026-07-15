from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List, Optional

from domain.models import BehaviorSignals, ContextSignals, FaceResult, PersonState, ThreatAssessment, ThreatLevel
from utils.config_loader import ConfigLoader


class ThreatEngine:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('threat', {})
        self.normal_max_score = float(self.config.get('normal_max_score', 39))
        self.suspicious_max_score = float(self.config.get('suspicious_max_score', 69))
        self.weights = self.config.get('weights', {})
        self.authorized_risk_reduction = float(self.config.get('authorized_risk_reduction', 50))

    def assess(self, stable_identity: Optional[str], face_result: FaceResult, behavior: BehaviorSignals, context: ContextSignals, suspicious_object_signal: Optional[dict] = None) -> ThreatAssessment:
        score = 0.0
        reasons: List[str] = []
        contributions: Dict[str, float] = {}

        if stable_identity and stable_identity != 'UNKNOWN' and face_result.recognition_status == 'AUTHORIZED':
            score -= self.authorized_risk_reduction
            reasons.append('Authorized identity reduces risk')
            contributions['authorized_identity'] = -self.authorized_risk_reduction

        if face_result.recognition_status == 'UNKNOWN' and stable_identity == 'UNKNOWN':
            score += float(self.weights.get('persistent_unknown_identity', 25))
            reasons.append('Persistent unknown identity')
            contributions['unknown_identity'] = float(self.weights.get('persistent_unknown_identity', 25))
        elif face_result.recognition_status == 'IDENTITY_UNCERTAIN':
            score += float(self.weights.get('identity_uncertainty', 8))
            reasons.append('Identity uncertainty')
            contributions['identity_uncertainty'] = float(self.weights.get('identity_uncertainty', 8))

        if behavior.presence_duration >= 15:
            score += float(self.weights.get('prolonged_presence', 10))
            reasons.append('Prolonged presence near monitored area')
            contributions['prolonged_presence'] = float(self.weights.get('prolonged_presence', 10))

        if behavior.loitering:
            score += float(self.weights.get('loitering', 20))
            reasons.append('Loitering pattern observed')
            contributions['loitering'] = float(self.weights.get('loitering', 20))

        if behavior.repeated_movement:
            score += float(self.weights.get('repeated_movement', 8))
            reasons.append('Repeated movement pattern')
            contributions['repeated_movement'] = float(self.weights.get('repeated_movement', 8))

        if behavior.face_obscured:
            score += float(self.weights.get('persistent_face_obscuration', 15))
            reasons.append('Face unavailable across temporal observation window')
            contributions['face_obscuration'] = float(self.weights.get('persistent_face_obscuration', 15))

        if context.is_restricted_hour:
            score += float(self.weights.get('restricted_hours', 10))
            reasons.append('Activity occurred during configured restricted hours')
            contributions['restricted_hours'] = float(self.weights.get('restricted_hours', 10))

        if suspicious_object_signal and suspicious_object_signal.get('detected', False):
            score += float(self.weights.get('suspicious_object', 35))
            reasons.append('Validated suspicious object evidence')
            contributions['suspicious_object'] = float(self.weights.get('suspicious_object', 35))

        meaningfully_active = sum(1 for signal in [stable_identity == 'UNKNOWN', behavior.loitering, behavior.face_obscured, context.is_restricted_hour] if signal)
        if meaningfully_active >= 3:
            score += float(self.weights.get('multi_signal_correlation', 12))
            reasons.append('Correlated threat signals')
            contributions['multi_signal_correlation'] = float(self.weights.get('multi_signal_correlation', 12))

        score = max(0.0, min(100.0, score))
        if score >= self.suspicious_max_score:
            level = ThreatLevel.CRITICAL
        elif score >= self.normal_max_score:
            level = ThreatLevel.SUSPICIOUS
        else:
            level = ThreatLevel.NORMAL
        return ThreatAssessment(score=score, level=level, reasons=reasons, signal_contributions=contributions, assessment_timestamp=datetime.now(timezone.utc))
