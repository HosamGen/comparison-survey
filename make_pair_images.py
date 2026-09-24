"""Combine each blinded pair into one labelled side-by-side image.

Run from the root of the comparison-survey repo after make_blind_images.py:

    python make_pair_images.py                 # every pair in blind/study*/
    python make_pair_images.py blind/study1/p01 out.jpg   # one pair, custom output

For every blind/<study>/pNN_A.jpg + pNN_B.jpg it writes blind/<study>/pNN_AB.jpg,
with "Image A" over the left image and "Image B" over the right one.
"""
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

DPI = 100


def make_pair(prefix: Path, out: Path) -> None:
    a = Image.open(f"{prefix}_A.jpg").convert("RGB")
    b = Image.open(f"{prefix}_B.jpg").convert("RGB")
    w, h = a.size
    # Figure sized so each panel is shown at its native resolution, plus room for the labels.
    fig, axes = plt.subplots(1, 2, figsize=(2 * w / DPI + 0.6, h / DPI + 0.8), dpi=DPI)
    for ax, img, label in zip(axes, (a, b), ("Image A", "Image B")):
        ax.imshow(img)
        ax.set_title(label, fontsize=22, fontweight="bold", pad=10)
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_linewidth(1.5)
    fig.subplots_adjust(left=0.01, right=0.99, bottom=0.01, top=0.88, wspace=0.04)
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=DPI, pil_kwargs={"quality": 95}, facecolor="white")
    plt.close(fig)


def main() -> None:
    if len(sys.argv) == 3:
        make_pair(Path(sys.argv[1]), Path(sys.argv[2]))
        return
    for a_path in sorted(Path("blind").glob("study*/p*_A.jpg")):
        prefix = a_path.with_name(a_path.name[: -len("_A.jpg")])
        make_pair(prefix, prefix.with_name(prefix.name + "_AB.jpg"))
        print(prefix.with_name(prefix.name + "_AB.jpg"))


if __name__ == "__main__":
    main()
