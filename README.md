# comparison-survey

Static, blinded image-comparison surveys for the VIDA-GEO evaluation.

## Survey pages

- `index.html`: original 30-pair VIDA-GEO vs DIFF-usion study.
- `lance.html`: new 8-pair VIDA-GEO vs LANCE study.

When GitHub Pages is enabled for the repository, the new study is available at:

```text
https://hosamgen.github.io/comparison-survey/lance.html
```

If that URL returns 404, open **Repository settings → Pages**, choose
**Deploy from a branch**, select **main** and **/(root)**, then save. Merging
the survey branch into `main` will trigger the Pages build.

The LANCE page randomizes both pair order and left/right model placement. It
submits the selected filename and hidden model identity for the target metric,
realism, and urban-planning questions.

The eight pairs use the highest target-metric-delta VIDA-GEO and LANCE output
for each curated input. Their filenames and deltas are recorded in
[`lance-study/selection_manifest.csv`](lance-study/selection_manifest.csv).

## Google Sheets / Apps Script update

The new study should write to a separate `VIDA_vs_LANCE` sheet so its rows do
not mix with the original experiment.

1. Open the Apps Script project currently used by the survey spreadsheet.
2. Back up its current `Code.gs`.
3. Replace it with [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. If the script is bound to the response spreadsheet, leave
   `SPREADSHEET_ID` blank. For a standalone script, paste the target
   spreadsheet ID into that constant.
5. In Apps Script, choose **Deploy → Manage deployments**, edit the current Web
   App deployment, select **New version**, and deploy it:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Confirm the resulting `/exec` URL matches `GOOGLE_SHEETS_URL` in both HTML
   pages. Editing an existing deployment normally preserves the URL.
7. Open the `/exec` URL in a browser. It should return JSON with
   `"service":"comparison-survey"`.
8. Submit one test response from `lance.html` and confirm that eight rows
   appear under the automatically created `VIDA_vs_LANCE` sheet.

The supplied Apps Script remains backward-compatible with the original page:
payloads without the LANCE study ID continue to use the existing `Sheet1`
13-column format.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/lance.html
```
