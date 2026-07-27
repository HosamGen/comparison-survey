/*
 * Google Apps Script receiver for both surveys in this repository.
 *
 * Setup:
 * 1. If this script is bound to the response spreadsheet, leave
 *    SPREADSHEET_ID blank. Otherwise paste the spreadsheet ID below.
 * 2. Deploy as a Web App: execute as yourself, access "Anyone".
 * 3. Put the deployment /exec URL in index.html and lance.html.
 *
 * The legacy survey continues writing its original 13-column schema to
 * LEGACY_SHEET_NAME. The VIDA-GEO vs LANCE study writes to LANCE_SHEET_NAME.
 */

const SPREADSHEET_ID = "";
const LEGACY_SHEET_NAME = "Sheet1";
const LANCE_SHEET_NAME = "VIDA_vs_LANCE";
const LANCE_STUDY_ID = "vida_geo_vs_lance_v1";

const LEGACY_HEADERS = [
  "Timestamp",
  "Respondent_ID",
  "Question_Number",
  "Folder",
  "Metric",
  "Image_A_File",
  "Image_B_File",
  "Q1_Metric_Choice",
  "Q1_Metric_ChosenFile",
  "Q2_Realism_Choice",
  "Q2_Realism_ChosenFile",
  "Q3_Planning_Choice",
  "Q3_Planning_ChosenFile"
];

const LANCE_HEADERS = [
  "Timestamp",
  "Respondent_ID",
  "Study",
  "Question_Number",
  "Folder",
  "Metric",
  "Image_A_File",
  "Image_A_Model",
  "Image_B_File",
  "Image_B_Model",
  "Q1_Metric_Choice",
  "Q1_Metric_ChosenFile",
  "Q1_Metric_ChosenModel",
  "Q2_Realism_Choice",
  "Q2_Realism_ChosenFile",
  "Q2_Realism_ChosenModel",
  "Q3_Planning_Choice",
  "Q3_Planning_ChosenFile",
  "Q3_Planning_ChosenModel"
];

function spreadsheet_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function sheetWithHeaders_(name, headers) {
  const spreadsheet = spreadsheet_();
  if (!spreadsheet) {
    throw new Error(
      "No active spreadsheet. Bind this script to a Google Sheet or set SPREADSHEET_ID."
    );
  }
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else {
    const existing = sheet
      .getRange(1, 1, 1, headers.length)
      .getValues()[0]
      .map(String);
    if (existing.join("\u001f") !== headers.join("\u001f")) {
      throw new Error(
        `Sheet "${name}" has an incompatible header. Use a new sheet name or fix row 1.`
      );
    }
  }
  return sheet;
}

function respondentId_(payload) {
  if (payload.respondentId) return String(payload.respondentId);
  const token = Utilities.getUuid().replace(/-/g, "").slice(0, 12);
  return `R_${Date.now().toString(36)}_${token}`;
}

function legacyRows_(payload, respondentId) {
  return payload.responses.map((response, index) => [
    payload.timestamp || new Date().toISOString(),
    respondentId,
    response.questionNumber || index + 1,
    response.folder || "",
    response.metric || "",
    response.imageA_file || "",
    response.imageB_file || "",
    response.q1_metric_choice || "",
    response.q1_metric_chosenFile || "",
    response.q2_realism_choice || "",
    response.q2_realism_chosenFile || "",
    response.q3_planning_choice || "",
    response.q3_planning_chosenFile || ""
  ]);
}

function lanceRows_(payload, respondentId) {
  return payload.responses.map((response, index) => [
    payload.timestamp || new Date().toISOString(),
    respondentId,
    payload.study,
    response.questionNumber || index + 1,
    response.folder || "",
    response.metric || "",
    response.imageA_file || "",
    response.imageA_model || "",
    response.imageB_file || "",
    response.imageB_model || "",
    response.q1_metric_choice || "",
    response.q1_metric_chosenFile || "",
    response.q1_metric_chosenModel || "",
    response.q2_realism_choice || "",
    response.q2_realism_chosenFile || "",
    response.q2_realism_chosenModel || "",
    response.q3_planning_choice || "",
    response.q3_planning_chosenFile || "",
    response.q3_planning_chosenModel || ""
  ]);
}

function appendRows_(sheet, rows) {
  if (!rows.length) throw new Error("The payload contains no responses.");
  sheet
    .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
    .setValues(rows);
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (!event || !event.postData || !event.postData.contents) {
      throw new Error("Missing JSON request body.");
    }
    const payload = JSON.parse(event.postData.contents);
    if (!Array.isArray(payload.responses)) {
      throw new Error("payload.responses must be an array.");
    }

    const respondentId = respondentId_(payload);
    let sheet;
    let rows;
    if (payload.study === LANCE_STUDY_ID) {
      sheet = sheetWithHeaders_(LANCE_SHEET_NAME, LANCE_HEADERS);
      rows = lanceRows_(payload, respondentId);
    } else {
      sheet = sheetWithHeaders_(LEGACY_SHEET_NAME, LEGACY_HEADERS);
      rows = legacyRows_(payload, respondentId);
    }
    appendRows_(sheet, rows);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        respondentId,
        sheet: sheet.getName(),
        rowsWritten: rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: String(error && error.message ? error.message : error)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      service: "comparison-survey",
      studies: ["legacy", LANCE_STUDY_ID]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
