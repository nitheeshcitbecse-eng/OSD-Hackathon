from core.threat_engine import ThreatEngine
from domain.models import BehaviorSignals, ContextSignals, FaceResult, RecognitionStatus, ThreatLevel


def test_authorized_resident_daytime():
    engine = ThreatEngine()
    assessment = engine.assess('Taran', FaceResult(identity='Taran', similarity=0.8, face_detected=True, recognition_status=RecognitionStatus.AUTHORIZED), BehaviorSignals(), ContextSignals(is_restricted_hour=False, night_mode_active=False))
    assert assessment.level == ThreatLevel.NORMAL


def test_correlated_unknown_signals():
    engine = ThreatEngine()
    assessment = engine.assess('UNKNOWN', FaceResult(identity='UNKNOWN', similarity=0.2, face_detected=True, recognition_status=RecognitionStatus.UNKNOWN), BehaviorSignals(presence_duration=30.0, loitering=True, face_obscured=True), ContextSignals(is_restricted_hour=True, night_mode_active=True))
    assert assessment.level == ThreatLevel.CRITICAL
