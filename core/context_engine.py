from __future__ import annotations

from datetime import datetime
from typing import Optional

from domain.models import ContextSignals
from utils.config_loader import ConfigLoader


class ContextEngine:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('context', {})
        self.restricted_hours = self.config.get('restricted_hours', {})
        self.night_mode_active = bool(self.config.get('night_mode', True))
        self.camera_zone = self.config.get('camera_zone', 'GENERIC')
        self.sensitivity_multiplier = float(self.config.get('sensitivity_multiplier', 1.0))

    def analyze(self, timestamp: Optional[datetime] = None) -> ContextSignals:
        now = timestamp or datetime.now()
        restricted_hour = self._is_restricted_hour(now)
        return ContextSignals(
            is_restricted_hour=restricted_hour,
            night_mode_active=self.night_mode_active,
            camera_zone=self.camera_zone,
            sensitivity_multiplier=self.sensitivity_multiplier,
        )

    def _is_restricted_hour(self, timestamp: datetime) -> bool:
        start_str = self.restricted_hours.get('start', '23:00')
        end_str = self.restricted_hours.get('end', '05:00')
        start_hour, start_minute = map(int, start_str.split(':'))
        end_hour, end_minute = map(int, end_str.split(':'))
        current = timestamp.hour * 60 + timestamp.minute
        start = start_hour * 60 + start_minute
        end = end_hour * 60 + end_minute
        if start < end:
            return start <= current < end
        return current >= start or current < end
