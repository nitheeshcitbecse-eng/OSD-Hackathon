from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple

from domain.models import FaceResult, PersonState, RecognitionStatus
from utils.config_loader import ConfigLoader


class TemporalMemory:
    def __init__(self, config_path: str | None = None, stale_timeout_seconds: Optional[float] = None) -> None:
        self.config = ConfigLoader(config_path).get('temporal', {})
        self.stale_timeout_seconds = float(stale_timeout_seconds if stale_timeout_seconds is not None else self.config.get('stale_track_timeout_seconds', 5))
        self.max_position_history = int(self.config.get('max_position_history', 120))
        self.max_identity_history = int(self.config.get('max_identity_history', 20))
        self.max_risk_history = int(self.config.get('max_risk_history', 50))
        self.states: Dict[int, PersonState] = {}

    def update_person(self, track_id: int, face_result: FaceResult, bbox: Tuple[float, float, float, float], timestamp: Optional[datetime] = None, position: Optional[Tuple[float, float]] = None) -> PersonState:
        now = timestamp or datetime.now(timezone.utc)
        if track_id not in self.states:
            self.states[track_id] = PersonState(track_id=track_id, first_seen=now, last_seen=now)
        state = self.states[track_id]
        state.last_seen = now
        state.total_visible_duration += 1.0
        if face_result.face_detected:
            state.face_visible_frames += 1
            state.consecutive_face_missing_frames = 0
            if face_result.recognition_status != RecognitionStatus.NO_FACE:
                state.face_missing_frames = max(0, state.face_missing_frames - 1)
        else:
            state.face_missing_frames += 1
            state.consecutive_face_missing_frames += 1
        state.identity_history.append(face_result.identity or 'UNKNOWN')
        state.similarity_history.append(face_result.similarity)
        state.face_status_history.append(face_result.recognition_status)
        if len(state.identity_history) > self.max_identity_history:
            state.identity_history = state.identity_history[-self.max_identity_history:]
        if len(state.similarity_history) > self.max_identity_history:
            state.similarity_history = state.similarity_history[-self.max_identity_history:]
        if len(state.face_status_history) > self.max_identity_history:
            state.face_status_history = state.face_status_history[-self.max_identity_history:]
        if position is not None:
            state.position_history.append(position)
            if len(state.position_history) > self.max_position_history:
                state.position_history = state.position_history[-self.max_position_history:]
        return state

    def get_state(self, track_id: int) -> Optional[PersonState]:
        return self.states.get(track_id)

    def get_stable_identity(self, track_id: int) -> Optional[str]:
        state = self.states.get(track_id)
        if not state:
            return None
        counts: Dict[str, int] = {}
        for name in state.identity_history[-10:]:
            counts[name] = counts.get(name, 0) + 1
        top_name, top_votes = '', -1
        for name, votes in counts.items():
            if votes > top_votes:
                top_name, top_votes = name, votes
        if top_votes >= 3:
            return top_name
        return state.identity_history[-1] if state.identity_history else None

    def cleanup_stale_tracks(self, now: Optional[datetime] = None) -> None:
        current_time = now or datetime.now(timezone.utc)
        stale_ids = [track_id for track_id, state in self.states.items() if (current_time - state.last_seen).total_seconds() > self.stale_timeout_seconds]
        for track_id in stale_ids:
            del self.states[track_id]
