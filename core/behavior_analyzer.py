from __future__ import annotations

from typing import List, Tuple

from domain.models import BehaviorSignals, PersonState
from utils.config_loader import ConfigLoader


class BehaviorAnalyzer:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('behavior', {})
        self.prolonged_presence_seconds = float(self.config.get('prolonged_presence_seconds', 15))
        self.loitering_seconds = float(self.config.get('loitering_seconds', 20))
        self.stationary_seconds = float(self.config.get('stationary_seconds', 10))
        self.stationary_distance_threshold = float(self.config.get('stationary_distance_threshold', 35))
        self.face_obscured_min_consecutive_frames = int(self.config.get('face_obscured_min_consecutive_frames', 15))
        self.face_missing_ratio_threshold = float(self.config.get('face_missing_ratio_threshold', 0.70))

    def analyze(self, state: PersonState) -> BehaviorSignals:
        presence_duration = max(0.0, state.total_visible_duration)
        loitering = presence_duration >= self.loitering_seconds and self._is_spatially_stable(state.position_history)
        stationary_duration = self._stationary_duration(state.position_history)
        repeated_movement = self._repeated_movement(state.position_history)
        face_missing_ratio = 0.0 if state.face_visible_frames + state.face_missing_frames == 0 else state.face_missing_frames / float(state.face_visible_frames + state.face_missing_frames)
        face_obscured = state.consecutive_face_missing_frames >= self.face_obscured_min_consecutive_frames or face_missing_ratio >= self.face_missing_ratio_threshold
        return BehaviorSignals(
            presence_duration=presence_duration,
            loitering=loitering,
            stationary_duration=stationary_duration,
            repeated_movement=repeated_movement,
            face_obscured=face_obscured,
            face_missing_ratio=face_missing_ratio,
        )

    def _is_spatially_stable(self, positions: List[Tuple[float, float]]) -> bool:
        if len(positions) < 3:
            return False
        centroid_x = sum(x for x, _ in positions) / len(positions)
        centroid_y = sum(y for _, y in positions) / len(positions)
        spread = sum(((x - centroid_x) ** 2 + (y - centroid_y) ** 2) ** 0.5 for x, y in positions) / len(positions)
        return spread < 60.0

    def _stationary_duration(self, positions: List[Tuple[float, float]]) -> float:
        if len(positions) < 2:
            return 0.0
        ref = positions[0]
        for pos in positions[1:]:
            distance = ((pos[0] - ref[0]) ** 2 + (pos[1] - ref[1]) ** 2) ** 0.5
            if distance > self.stationary_distance_threshold:
                return self.stationary_seconds
        return self.stationary_seconds

    def _repeated_movement(self, positions: List[Tuple[float, float]]) -> bool:
        if len(positions) < 4:
            return False
        changes = []
        for idx in range(1, len(positions)):
            prev = positions[idx - 1]
            curr = positions[idx]
            changes.append((curr[0] - prev[0], curr[1] - prev[1]))
        return sum(1 for change in changes if abs(change[0]) + abs(change[1]) > 0) >= 4
