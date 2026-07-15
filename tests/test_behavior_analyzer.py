from datetime import datetime, timezone, timedelta

from core.behavior_analyzer import BehaviorAnalyzer
from core.temporal_memory import TemporalMemory
from domain.models import FaceResult, RecognitionStatus


def test_loitering_and_face_obscuration():
    analyzer = BehaviorAnalyzer()
    memory = TemporalMemory()
    now = datetime.now(timezone.utc)
    for idx in range(5):
        memory.update_person(track_id=7, face_result=FaceResult(identity='Unknown', similarity=0.2, face_detected=False, recognition_status=RecognitionStatus.NO_FACE), bbox=(0, 0, 20, 20), timestamp=now + timedelta(seconds=idx), position=(10, 10))
    state = memory.get_state(7)
    signals = analyzer.analyze(state)
    assert signals.face_obscured is True
    assert signals.face_missing_ratio > 0.0
