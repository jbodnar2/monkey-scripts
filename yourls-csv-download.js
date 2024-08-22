// ==UserScript==
// @name        Yourls Download CSV
// @namespace   https://github.com/jbodnar2/
// @author      jbodnar2@gsu.edu
// @license     GPLv3
// @version     1.0.0
// @description Adds a Download CSV button to footer of the YOURLS admin page.
// @match       https://lib.gsu.edu/admin/*
// @grant       none
// @downloadURL https://raw.githubusercontent.com/jbodnar2/monkey-scripts/main/yourls-csv-download.js
// @updateURL   https://raw.githubusercontent.com/jbodnar2/monkey-scripts/main/yourls-csv-download.js
// @homepageURL https://github.com/jbodnar2/monkey-scripts
// @supportURL  https://github.com/jbodnar2/monkey-scripts/issues
// ==/UserScript==

function downloadCsvReport() {
  let csvData = "Short URL, Original URL, Date, User, Clicks\r\n";
  csvData += Array.from(document.querySelectorAll("#main_table tbody tr"))
    .map((row) => {
      const shortUrl = row.querySelector("td[id|=keyword]")?.innerText || " ";
      const originalUrl =
        row.querySelector("td[id|=url] a")?.href.replace(/,/g, "%2C") || " ";
      const date =
        row
          .querySelector("td[id|=timestamp]")
          ?.innerText.replace(/,/g, "\u002C") || " ";
      const user = row.querySelector("td[id|=user] ")?.innerText || " ";
      const clicks =
        row.querySelector("td[id|=clicks] ")?.innerText.replace(/,/g, "") ||
        " ";
      return `"${shortUrl}","${originalUrl}","${date}","${user}","${clicks}"`;
    })
    .join("\r\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const postfix = new Date().toISOString().replace(/:/g, "-");
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `yourls_report-${postfix}.csv`;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

const createDownloadButton = () => {
  const button = document.createElement("button");
  button.textContent = "Download CSV Report";
  button.id = "download-csv-report";
  button.onclick = downloadCsvReport;
  button.style.cssText = `
    display: block;
    margin: 0 auto;
    margin-block-start: 1em;
    padding: 0.25em 0.75em;
    background: white;
    cursor: pointer;
  `;
  return button;
};

const appendDownloadButtonToFooter = () => {
  const footer = document.querySelector("footer p");
  const button = createDownloadButton();
  footer.appendChild(button);
};

appendDownloadButtonToFooter();
