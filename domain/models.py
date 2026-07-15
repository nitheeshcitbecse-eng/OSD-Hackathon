from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class PersonDetection:
    track_id: Optional[int]
    bbox: Tuple[float, float, float, float]
    confidence: float
    center_point: Tuple[float, float]


class RecognitionStatus(str, Enum):
    AUTHORIZED = "AUTHORIZED"
    UNKNOWN = "UNKNOWN"
    IDENTITY_UNCERTAIN = "IDENTITY_UNCERTAIN"
    NO_FACE = "NO_FACE"


@dataclass
class FaceResult:
    identity: Optional[str]
    similarity: float
    face_detected: bool
    recognition_status: RecognitionStatus


@dataclass
class PersonState:
    track_id: int
    first_seen: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    last_seen: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    total_visible_duration: float = 0.0
    identity_history: List[str] = field(default_factory=list)
    similarity_history: List[float] = field(default_factory=list)
    face_status_history: List[RecognitionStatus] = field(default_factory=list)
    face_visible_frames: int = 0
    face_missing_frames: int = 0
    consecutive_face_missing_frames: int = 0
    position_history: List[Tuple[float, float]] = field(default_factory=list)
    risk_history: List[float] = field(default_factory=list)
    last_alert_time: Optional[datetime] = None


@dataclass
class BehaviorSignals:
    presence_duration: float = 0.0
    loitering: bool = False
    stationary_duration: float = 0.0
    repeated_movement: bool = False
    face_obscured: bool = False
    face_missing_ratio: float = 0.0


@dataclass
class ContextSignals:
    is_restricted_hour: bool = False
    night_mode_active: bool = False
    camera_zone: str = "GENERIC"
    sensitivity_multiplier: float = 1.0


class ThreatLevel(str, Enum):
    NORMAL = "NORMAL"
    SUSPICIOUS = "SUSPICIOUS"
    CRITICAL = "CRITICAL"


@dataclass
class ThreatAssessment:
    score: float
    level: ThreatLevel
    reasons: List[str]
    signal_contributions: Dict[str, float]
    assessment_timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class IncidentSummary:
    title: str
    short_summary: str
    detailed_summary: str


class EventState(str, Enum):
    OBSERVING = "OBSERVING"
    SUSPICIOUS = "SUSPICIOUS"
    CRITICAL = "CRITICAL"
    ALERTED = "ALERTED"
    COOLDOWN = "COOLDOWN"
    RESOLVED = "RESOLVED"


@dataclass
class CameraConfig:
    camera_id: str
    name: str
    zone: str
    stream_url: str
    enabled: bool = True


@dataclass
class VisionQuality:
    frame_brightness: float = 0.0
    low_light: bool = False
    blur_score: float = 0.0
    blur_detected: bool = False
    person_crop_size: int = 0
    face_crop_size: int = 0
    face_too_small: bool = False
    overall_quality_score: float = 1.0
    quality_level: str = "GOOD"
