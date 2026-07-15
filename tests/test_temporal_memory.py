from datetime import datetime, timedelta, timezone

from core.temporal_memory import TemporalMemory
from domain.models import FaceResult, RecognitionStatus


def test_stable_authorized_identity_and_cleanup():
    memory = TemporalMemory()
    now = datetime.now(timezone.utc)
    for _ in range(6):
        memory.update_person(
            track_id=1,
            face_result=FaceResult(identity='Taran', similarity=0.8, face_detected=True, recognition_status=RecognitionStatus.AUTHORIZED),
            bbox=(0, 0, 20, 20),
            timestamp=now,
            position=(10, 10),
        )
    state = memory.get_state(1)
    assert memory.get_stable_identity(1) == 'Taran'
    assert state.face_visible_frames >= 1

    stale = TemporalMemory(stale_timeout_seconds=0)
    stale.update_person(track_id=2, face_result=FaceResult(identity='Unknown', similarity=0.2, face_detected=True, recognition_status=RecognitionStatus.UNKNOWN), bbox=(0, 0, 20, 20), timestamp=now - timedelta(seconds=10), position=(10, 10))
    stale.cleanup_stale_tracks(now)
    assert 2 not in stale.states
