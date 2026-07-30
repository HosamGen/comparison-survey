#!/usr/bin/env python3
"""Score VIDA-GEO vs LANCE survey responses.

Participants are always asked which image looks *more* like the target metric.
For boring and depressing, lower is better, so the unselected image is the
objective-preferred image. All raw response columns are preserved.
"""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path
from typing import Iterable


LOWER_IS_BETTER = {"boring", "depressing"}
ADDED_FIELDS = [
    "Q1_Objective_Scoring_Inverted",
    "Q1_Objective_Preferred_Choice",
    "Q1_Objective_Preferred_File",
    "Q1_Objective_Preferred_Model",
]
REQUIRED_FIELDS = {
    "Metric",
    "Image_A_File",
    "Image_A_Model",
    "Image_B_File",
    "Image_B_Model",
    "Q1_Metric_Choice",
}


def normalized_metric(value: str) -> str:
    return value.strip().lower().replace("-", "_").replace(" ", "_")


def opposite(choice: str) -> str:
    if choice == "A":
        return "B"
    if choice == "B":
        return "A"
    return ""


def score_row(row: dict[str, str]) -> dict[str, str]:
    scored = dict(row)
    metric = normalized_metric(row.get("Metric", ""))
    raw_choice = row.get("Q1_Metric_Choice", "").strip().upper()
    invert = metric in LOWER_IS_BETTER
    preferred_choice = opposite(raw_choice) if invert else raw_choice

    if preferred_choice in {"A", "B"}:
        preferred_file = row.get(f"Image_{preferred_choice}_File", "")
        preferred_model = row.get(f"Image_{preferred_choice}_Model", "")
    else:
        preferred_file = ""
        preferred_model = ""

    scored.update(
        {
            "Q1_Objective_Scoring_Inverted": str(invert).lower(),
            "Q1_Objective_Preferred_Choice": preferred_choice,
            "Q1_Objective_Preferred_File": preferred_file,
            "Q1_Objective_Preferred_Model": preferred_model,
        }
    )
    return scored


def validate_fields(fieldnames: Iterable[str] | None) -> list[str]:
    fields = list(fieldnames or [])
    missing = sorted(REQUIRED_FIELDS - set(fields))
    if missing:
        raise ValueError(
            "Input CSV is missing required column(s): " + ", ".join(missing)
        )
    return fields


def write_summary(rows: list[dict[str, str]], output: Path) -> None:
    counts: dict[tuple[str, str], int] = defaultdict(int)
    totals: dict[str, int] = defaultdict(int)
    for row in rows:
        metric = normalized_metric(row.get("Metric", ""))
        model = row.get("Q1_Objective_Preferred_Model", "").strip()
        if not metric or not model:
            continue
        counts[(metric, model)] += 1
        totals[metric] += 1

    models = sorted({model for _, model in counts})
    fields = ["Metric", "Responses"] + [
        item
        for model in models
        for item in (f"{model}_Wins", f"{model}_Win_Rate")
    ]
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for metric in sorted(totals):
            total = totals[metric]
            summary_row: dict[str, str | int] = {
                "Metric": metric,
                "Responses": total,
            }
            for model in models:
                wins = counts[(metric, model)]
                summary_row[f"{model}_Wins"] = wins
                summary_row[f"{model}_Win_Rate"] = (
                    f"{wins / total:.6f}" if total else ""
                )
            writer.writerow(summary_row)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Preserve literal survey answers and invert objective preference "
            "for boring and depressing."
        )
    )
    parser.add_argument("input", type=Path, help="Downloaded VIDA_vs_LANCE CSV")
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Row-level scored CSV",
    )
    parser.add_argument(
        "--summary",
        type=Path,
        required=True,
        help="Per-metric model win summary CSV",
    )
    args = parser.parse_args()

    with args.input.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        original_fields = validate_fields(reader.fieldnames)
        scored_rows = [score_row(row) for row in reader]

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=original_fields + ADDED_FIELDS,
            extrasaction="ignore",
        )
        writer.writeheader()
        writer.writerows(scored_rows)

    write_summary(scored_rows, args.summary)
    inverted = sum(
        row["Q1_Objective_Scoring_Inverted"] == "true"
        for row in scored_rows
    )
    print(
        f"Scored {len(scored_rows)} responses; "
        f"inverted {inverted} boring/depressing responses."
    )
    print(f"Rows: {args.output}")
    print(f"Summary: {args.summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
