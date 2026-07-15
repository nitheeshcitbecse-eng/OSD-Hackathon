from __future__ import annotations

import json
import os
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import cv2
import numpy as np

from domain.models import IncidentSummary, ThreatAssessment, ThreatLevel
from utils.config_loader import ConfigLoader


class EvidenceManager:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('evidence', {})
        self.output_dir = Path(self.config.get('critical_output_directory', 'outputs/alerts'))
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.retention_hours = int(self.config.get('retention_hours', 24))
        self._buffer: list[np.ndarray] = []

    def save_suspicious_frame(self, frame: Optional[np.ndarray], track_id: int, threat_assessment: ThreatAssessment) -> Optional[str]:
        if frame is None:
            return None
        if threat_assessment.level == ThreatLevel.NORMAL:
            return None
        self._buffer.append(frame)
        if len(self._buffer) > int(self.config.get('suspicious_buffer_size', 60)):
            self._buffer.pop(0)
        return None

    def save_critical_evidence(self, frame: Optional[np.ndarray], track_id: int, threat_assessment: ThreatAssessment, reasons: list[str], camera_id: str = 'CAM_01') -> Optional[Dict[str, Any]]:
        if frame is None or threat_assessment.level != ThreatLevel.CRITICAL:
            return None
        event_id = f'event-{track_id}-{int(datetime.now(timezone.utc).timestamp())}'
        evidence_path = self.output_dir / f'{event_id}.jpg'
        success = cv2.imwrite(str(evidence_path), frame)
        if not success:
            return None
        metadata = {
            'event_id': event_id,
            'track_id': track_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'risk_score': threat_assessment.score,
            'risk_level': threat_assessment.level.value,
            'reasons': reasons,
            'camera_id': camera_id,
            'evidence_path': str(evidence_path),
        }
        metadata_path = self.output_dir / f'{event_id}.json'
        metadata_path.write_text(json.dumps(metadata, indent=2), encoding='utf-8')
        return metadata

    def cleanup_retention(self) -> None:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=self.retention_hours)
        for path in self.output_dir.glob('*'):
            if path.is_file() and path.stat().st_mtime < cutoff.timestamp():
                path.unlink(missing_ok=True)
