from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

from domain.models import EventState, ThreatAssessment, ThreatLevel
from utils.config_loader import ConfigLoader


class EventManager:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('events', {})
        self.cooldown_seconds = int(self.config.get('critical_alert_cooldown_seconds', 60))
        self.resolution_timeout_seconds = int(self.config.get('resolution_timeout_seconds', 10))
        self.events: Dict[int, dict] = {}

    def update_event(self, track_id: int, threat_assessment: ThreatAssessment) -> dict:
        if track_id not in self.events:
            self.events[track_id] = {'state': EventState.OBSERVING, 'event_id': None, 'last_alert': None, 'last_seen': datetime.now(timezone.utc)}
        event = self.events[track_id]
        event['last_seen'] = datetime.now(timezone.utc)
        if threat_assessment.level == ThreatLevel.CRITICAL:
            if event['state'] in (EventState.OBSERVING, EventState.SUSPICIOUS):
                event['state'] = EventState.CRITICAL
            elif event['state'] == EventState.ALERTED:
                if event['last_alert'] and (datetime.now(timezone.utc) - event['last_alert']).total_seconds() > self.cooldown_seconds:
                    event['state'] = EventState.COOLDOWN
            if event['event_id'] is None:
                event['event_id'] = f'event-{track_id}-{int(datetime.now(timezone.utc).timestamp())}'
        elif threat_assessment.level == ThreatLevel.SUSPICIOUS:
            event['state'] = EventState.SUSPICIOUS
        else:
            event['state'] = EventState.OBSERVING
        return event

    def should_alert(self, track_id: int) -> bool:
        event = self.events.get(track_id)
        if not event:
            return True
        if event['state'] != EventState.CRITICAL:
            return False
        if event['last_alert'] is None:
            return True
        return (datetime.now(timezone.utc) - event['last_alert']).total_seconds() > self.cooldown_seconds

    def mark_alerted(self, track_id: int) -> None:
        event = self.events.get(track_id)
        if event:
            event['state'] = EventState.ALERTED
            event['last_alert'] = datetime.now(timezone.utc)

    def resolve_stale_events(self, now: Optional[datetime] = None) -> None:
        current_time = now or datetime.now(timezone.utc)
        for track_id, event in list(self.events.items()):
            if event.get('last_seen') and (current_time - event['last_seen']).total_seconds() > self.resolution_timeout_seconds:
                event['state'] = EventState.RESOLVED
