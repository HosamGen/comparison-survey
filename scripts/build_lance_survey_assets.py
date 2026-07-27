#!/usr/bin/env python3
"""Build the 30-pair VIDA-GEO vs LANCE survey assets.

The original ``images/<metric>_<n>`` folders supply the established input and
VIDA-GEO output used by the VIDA-GEO vs DIFF-usion survey. For each matching
input coordinate, this script selects the best of the ten scored LANCE
candidates and copies it into the same folder.

For beautiful, lively, safety, and wealthy, "best" means the largest target
metric delta. For boring and depressing, it means the largest reduction in
that metric, matching the LANCE evaluation convention.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path, PurePosixPath
import re
import shutil
from typing import Any
from xml.etree import ElementTree as ET
from zipfile import ZipFile


REPO_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = REPO_ROOT.parent.parent
DEFAULT_RESULTS = (
    WORKSPACE_ROOT
    / "eccv_to_neurips_submission_10outputs"
    / "results_formatting"
    / "FIXED_lance_gsv_results.xlsx"
)
DEFAULT_LANCE_IMAGES = (
    WORKSPACE_ROOT
    / "LANCE"
    / "final_benchmark_outputs"
    / "images"
)

POSITIVE_METRICS = {"beautiful", "lively", "safety", "wealthy"}
NEGATIVE_METRICS = {"boring", "depressing"}
SUPPORTED_METRICS = POSITIVE_METRICS | NEGATIVE_METRICS

MANIFEST_FIELDS = [
    "folder",
    "target_metric",
    "input_file",
    "vida_file",
    "lance_file",
    "lance_edit_type",
    "lance_original_metric_score",
    "lance_edited_metric_score",
    "lance_raw_delta",
    "lance_objective_improvement",
]


def column_index(column: str) -> int:
    output = 0
    for character in column:
        output = output * 26 + ord(character) - 64
    return output


def split_cell_reference(reference: str) -> tuple[int, int]:
    match = re.match(r"([A-Z]+)([0-9]+)", reference or "")
    if not match:
        return 0, 0
    return int(match.group(2)), column_index(match.group(1))


def xml_text(node: ET.Element) -> str:
    return "".join(node.itertext())


def shared_strings(archive: ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return [xml_text(node) for node in root if node.tag.endswith("si")]


def normalized_target(target: str) -> str:
    if target.startswith("/"):
        return target.lstrip("/")
    if target.startswith("xl/"):
        return target
    return str(PurePosixPath("xl") / target)


def workbook_sheets(archive: ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(
        archive.read("xl/_rels/workbook.xml.rels")
    )
    relationship_namespace = (
        "{http://schemas.openxmlformats.org/package/2006/relationships}"
    )
    paths = {
        relationship.attrib.get("Id", ""): normalized_target(
            relationship.attrib.get("Target", "")
        )
        for relationship in relationships
        if relationship.tag.startswith(relationship_namespace)
    }
    relationship_id = (
        "{http://schemas.openxmlformats.org/"
        "officeDocument/2006/relationships}id"
    )
    return {
        node.attrib["name"]: paths[node.attrib[relationship_id]]
        for node in workbook.iter()
        if node.tag.endswith("sheet")
        and node.attrib.get("name")
        and paths.get(node.attrib.get(relationship_id, ""))
    }


def worksheet_rows(
    archive: ZipFile,
    path: str,
    strings: list[str],
) -> dict[int, dict[int, str]]:
    root = ET.fromstring(archive.read(path))
    rows: dict[int, dict[int, str]] = {}
    for cell in root.iter():
        if not cell.tag.endswith("c"):
            continue
        row_index, column = split_cell_reference(cell.attrib.get("r", ""))
        if row_index <= 0 or column <= 0:
            continue
        cell_type = cell.attrib.get("t")
        if cell_type == "inlineStr":
            value = xml_text(cell)
        else:
            value = ""
            for child in cell:
                if child.tag.endswith("v") and child.text is not None:
                    value = child.text
                    if cell_type == "s":
                        value = strings[int(value)]
                    break
        rows.setdefault(row_index, {})[column] = value
    return rows


def read_results(path: Path) -> dict[str, list[dict[str, str]]]:
    with ZipFile(path) as archive:
        strings = shared_strings(archive)
        sheets = workbook_sheets(archive)
        output: dict[str, list[dict[str, str]]] = {}
        for metric in sorted(SUPPORTED_METRICS):
            sheet_name = f"all_{metric}"
            cells = worksheet_rows(
                archive,
                sheets[sheet_name],
                strings,
            )
            headers = {
                value: column for column, value in cells[1].items()
            }
            output[metric] = [
                {
                    name: cells[row_number].get(column, "")
                    for name, column in headers.items()
                }
                for row_number in sorted(cells)
                if row_number > 1
            ]
    return output


def objective_improvement(metric: str, raw_delta: float) -> float:
    return -raw_delta if metric in NEGATIVE_METRICS else raw_delta


def resolve_source(
    images_root: Path,
    metric: str,
    coordinate: str,
    edit_type: str,
) -> Path:
    matches = list(
        (images_root / metric).glob(f"*{coordinate}_{edit_type}.png")
    )
    if len(matches) != 1:
        raise RuntimeError(
            f"{metric}/{coordinate}/{edit_type}: expected one image, "
            f"found {len(matches)}"
        )
    return matches[0]


def survey_folders(images_root: Path) -> list[Path]:
    folders = [
        path
        for path in images_root.iterdir()
        if path.is_dir()
        and path.name.rsplit("_", 1)[0] in SUPPORTED_METRICS
    ]
    return sorted(folders, key=lambda path: path.name)


def coordinate_from_diffusion(folder: Path) -> str:
    diffusion = [
        path
        for path in folder.iterdir()
        if path.is_file() and path.name.startswith("000")
    ]
    if len(diffusion) != 1:
        raise RuntimeError(
            f"{folder.name}: expected one DIFF-usion output, "
            f"found {len(diffusion)}"
        )
    parts = diffusion[0].stem.removesuffix("_best").split("_")
    return "_".join(parts[-2:])


def vida_output(folder: Path) -> Path:
    matches = [
        path
        for path in folder.iterdir()
        if path.is_file()
        and path.name not in {"input.jpg", ".DS_Store"}
        and not path.name.startswith("000")
        and not path.name.startswith("LANCE__")
    ]
    if len(matches) != 1:
        raise RuntimeError(
            f"{folder.name}: expected one VIDA-GEO output, found {len(matches)}"
        )
    return matches[0]


def delta_tag(value: float) -> str:
    return (
        f"{value:+.3f}"
        .replace("+", "plus")
        .replace("-", "minus")
    )


def build(
    images_root: Path,
    results_path: Path,
    lance_images_root: Path,
    manifest_path: Path,
    pairs_path: Path,
) -> None:
    results = read_results(results_path)
    folders = survey_folders(images_root)
    if len(folders) != 30:
        raise RuntimeError(f"Expected 30 survey folders, found {len(folders)}")

    counts: dict[str, int] = {}
    manifest: list[dict[str, Any]] = []
    pairs: list[dict[str, Any]] = []

    for folder in folders:
        metric = folder.name.rsplit("_", 1)[0]
        counts[metric] = counts.get(metric, 0) + 1
        coordinate = coordinate_from_diffusion(folder)
        candidates = [
            row
            for row in results[metric]
            if coordinate in row.get("Input Path", "")
        ]
        if len(candidates) != 10:
            raise RuntimeError(
                f"{folder.name}: expected 10 LANCE candidates, "
                f"found {len(candidates)}"
            )

        raw_delta_field = f"delta_{metric}"
        best = max(
            candidates,
            key=lambda row: objective_improvement(
                metric, float(row[raw_delta_field])
            ),
        )
        raw_delta = float(best[raw_delta_field])
        source = resolve_source(
            lance_images_root,
            metric,
            coordinate,
            best["edit_type"],
        )
        lance_name = (
            f"LANCE__best__{best['edit_type']}__"
            f"delta_{delta_tag(raw_delta)}__{source.name}"
        )
        lance_target = folder / lance_name
        if lance_target.exists() and lance_target.read_bytes() != source.read_bytes():
            raise RuntimeError(f"Refusing to overwrite different file: {lance_target}")
        if not lance_target.exists():
            shutil.copy2(source, lance_target)

        vida = vida_output(folder)
        manifest.append(
            {
                "folder": folder.name,
                "target_metric": metric,
                "input_file": "input.jpg",
                "vida_file": vida.name,
                "lance_file": lance_name,
                "lance_edit_type": best["edit_type"],
                "lance_original_metric_score": round(
                    float(best[f"orig_{metric}"]), 3
                ),
                "lance_edited_metric_score": round(
                    float(best[f"edit_{metric}"]), 3
                ),
                "lance_raw_delta": round(raw_delta, 3),
                "lance_objective_improvement": round(
                    objective_improvement(metric, raw_delta), 3
                ),
            }
        )
        pairs.append(
            {
                "folder": folder.name,
                "metric": "safe" if metric == "safety" else metric,
                "input": "input.jpg",
                "outputs": [
                    {"model": "VIDA-GEO", "file": vida.name},
                    {"model": "LANCE", "file": lance_name},
                ],
            }
        )

    if counts != {metric: 5 for metric in SUPPORTED_METRICS}:
        raise RuntimeError(f"Expected five examples per metric, found {counts}")

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=MANIFEST_FIELDS,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(manifest)

    pairs_path.parent.mkdir(parents=True, exist_ok=True)
    pairs_path.write_text(
        "const PAIRS = "
        + json.dumps(pairs, indent=2, ensure_ascii=True)
        + ";\n",
        encoding="utf-8",
    )

    print(f"Built {len(pairs)} pairs: {counts}")
    print(f"Manifest: {manifest_path}")
    print(f"Survey data: {pairs_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--images-root",
        type=Path,
        default=REPO_ROOT / "images",
    )
    parser.add_argument(
        "--results",
        type=Path,
        default=DEFAULT_RESULTS,
    )
    parser.add_argument(
        "--lance-images-root",
        type=Path,
        default=DEFAULT_LANCE_IMAGES,
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=REPO_ROOT / "lance-study" / "selection_manifest.csv",
    )
    parser.add_argument(
        "--pairs",
        type=Path,
        default=REPO_ROOT / "lance-study" / "pairs.js",
    )
    args = parser.parse_args()
    build(
        args.images_root,
        args.results,
        args.lance_images_root,
        args.manifest,
        args.pairs,
    )


if __name__ == "__main__":
    main()
