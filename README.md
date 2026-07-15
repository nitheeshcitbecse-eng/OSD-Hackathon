# AI Guardian ML

AI Guardian is a privacy-first, on-device AI home intrusion intelligence engine. It performs camera capture, person detection, multi-person tracking, face analysis, temporal memory, behavioral analysis, context analysis, explainable threat fusion, evidence management, and alert dispatch.

## Architecture

The core pipeline is modular and CPU-friendly:

1. Camera input
2. Person detection and tracking
3. Face recognition
4. Temporal memory
5. Behavior analysis
6. Context analysis
7. Threat fusion
8. Event lifecycle and evidence capture
9. Alert dispatch

## Installation

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Enrollment

```bash
python -m enrollment.enroll --family-dir data/family
```

## Run

```bash
python main.py
```

## Tests

```bash
pytest -v
```

> AI Guardian produces risk assessments from configured and observed signals. It does not determine criminal intent.
