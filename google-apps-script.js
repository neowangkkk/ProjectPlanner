/**
 * Google Apps Script — paste this into your Google Sheet's Apps Script editor.
 *
 * Setup:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Deploy > New deployment
 * 5. Select type: Web app
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Click Deploy and copy the URL
 * 9. Paste the URL into the ProjectPlanner app (click "Connect Sheet" button)
 */

const SHEET_NAME = 'Projects';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange('A1').setValue('[]');
  }
  return sheet;
}

function doGet(e) {
  const sheet = getOrCreateSheet();
  const raw = sheet.getRange('A1').getValue();
  let projects = [];
  try {
    projects = JSON.parse(raw || '[]');
  } catch (err) {
    projects = [];
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', projects: projects }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'save' && Array.isArray(body.projects)) {
      const sheet = getOrCreateSheet();
      sheet.getRange('A1').setValue(JSON.stringify(body.projects));
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
