# Prompt for Claude in Chrome: build Study 3 (VIDA-GEO vs NB2.5)

Paste the block below into Claude in Chrome with the survey-builder tab open. It
mirrors Study 1 (vs DIFFusion) and Study 2 (vs LANCE) exactly; only the dataset
changes. Nothing in the dataset reveals which system made which image.

---

I am building a blinded image-comparison study in this survey tool, identical in
structure to my two earlier studies ("Street-view image comparison (Set A)" and
"Set B"). Please create it as a new collection named
**"Street-view image comparison (Set C)"**.

**Dataset (30 items).** Import this CSV; each row is one item:
https://raw.githubusercontent.com/HosamGen/comparison-survey/main/prolific_aitb/dataset_study3.csv

Columns and how to map them (schema file:
https://raw.githubusercontent.com/HosamGen/comparison-survey/main/prolific_aitb/dataset_schema.json):
- `comparison_image` -> image shown to the participant, labelled "Image A and Image B"
  (it is one side-by-side picture with "Image A" on the left and "Image B" on the right).
- `original_image` -> second image shown to the participant, labelled "Original input image".
- `metric_question` -> the text of Question 1 for that item (it varies per item, e.g.
  "Which image looks more lively?", "Which image looks more boring?"). Use it verbatim.
- `META_study`, `META_pair_id`, `META_metric` -> metadata only; store them with each
  response but never display them.

**Questions per item (exactly three, in this order, each a single-choice with the two
options "Image A" and "Image B"):**
1. Q1: the text from `metric_question` for that item.
2. Q2: "Which image looks more real?"
3. Q3: "Given the original input image, which of the two changes (Image A or Image B)
   would be easier to implement in urban planning?"

The exact option labels/values are in
https://raw.githubusercontent.com/HosamGen/comparison-survey/main/prolific_aitb/batch_instructions.json
(labels "Image A" / "Image B", values "A" / "B", answer_limit 1). Do not add "both" or
"neither" options and do not add free-text fields.

**Settings to match the earlier studies:**
- 5 evaluators per item; every item must be answered by 5 different participants.
- Show items in a randomized order per participant.
- Keep the question wording for lower-is-better metrics as written ("more boring",
  "more depressing"); the scoring script inverts those afterwards, the participant
  wording must not change.
- Two attention-check items, inserted at positions 11 and 22 of each participant's
  sequence, using the tool's standard attention-check format with the same two
  "Image A" / "Image B" options. Attention check 1 has correct answer "Image B";
  attention check 2 has correct answer "Image A". If the tool cannot position them
  deterministically, placing them randomly is acceptable.
- Participant instructions (shown once at the start): "You will see pairs of edited
  street-view images (Image A and Image B) together with the original photo. For each
  pair, answer three short questions by choosing Image A or Image B. There are no right
  or wrong answers except for two attention checks; please look at both images before
  answering."
- Export format: same as before (one JSON record per submission, responses keyed by
  instruction ID, plus a collection.json with the instruction descriptions).

Before launching, show me a preview of one item so I can confirm the two images and three
questions render correctly, and tell me the total number of items (should be 30 plus 2
attention checks) and the number of participant slots (should be 5 per item). Do not
publish or recruit until I confirm.

---

## Where things are

| Asset | Path / URL |
|---|---|
| Dataset CSV | `prolific_aitb/dataset_study3.csv` (raw URL above) |
| Blinded pairs | `blind_AB/study3/pNN_AB.jpg`, originals `blind/study3/pNN_original.jpg` |
| Selection of the NB2.5 image per input | `nb25-study/selection_manifest.csv` |
| Answer key (A/B identity per pair) | `PRIVATE_answer_key.csv`, rows with `study = study3` (local only, never pushed) |
| Scoring | reuse `scripts/analyze_prolific_responses.py` / `scripts/score_lance_responses.py` with the study3 key rows |

Study 3 uses the same 30 inputs and the same VIDA-GEO outputs as Studies 1 and 2. The
NB2.5 image is the best of its 10 zero-shot candidates by indicator delta
(`nb25-study/selection_manifest.csv`). A/B sides are balanced: VIDA-GEO is Image A in 15
pairs and Image B in 15.
