import { SaleDueRecord, ManagerCustomer } from '../types';

/**
 * Universal print helper for ERP reports, vouchers, and statements.
 * Opens a clean printable document with pre-injected styles to ensure
 * pixel-perfect rendering across iFrames, mobile, and desktop.
 */

export const fmt = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('en-US');
};

function getCustomLogoImgTag(): string {
  try {
    const logo = localStorage.getItem('samura_custom_logo');
    if (logo) {
      return `<div style="text-align: center; margin-bottom: 8px;"><img src="${logo}" alt="Company Logo" style="max-height: 48px; max-width: 180px; object-fit: contain;" /></div>`;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return '';
}

function buildDocumentHtml(
  title: string,
  bodyContent: string,
  orientation: 'portrait' | 'landscape',
  isPopup: boolean = false
): string {
  const logoHeader = getCustomLogoImgTag();
  const cleanTitle = title.replace(/_/g, ' ');
  const isLandscape = orientation === 'landscape';

  const topBarHtml = isPopup
    ? `
    <div class="no-print" style="position: sticky; top: 0; z-index: 99999; background: #073F37; color: #ffffff; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.18); font-family: 'Inter', -apple-system, sans-serif;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-weight: 800; font-size: 13px; letter-spacing: 0.5px; color: #E6F4EA;">AL SAMURA GROUP</div>
        <span style="font-size: 11px; color: #D1FAE5; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px; font-weight: 600;">${cleanTitle}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="direct-print-btn" onclick="window.focus(); window.print();" style="background: #22A06B; color: #ffffff; border: none; padding: 7px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          🖨️ Open Print Dialog
        </button>
        <button onclick="window.close()" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
          ✕ Close
        </button>
      </div>
    </div>
    `
    : '';

  const autoPrintScript = isPopup
    ? `
    <script>
      (function() {
        var triggerPrint = function() {
          setTimeout(function() {
            try {
              window.focus();
              window.print();
            } catch(err) {
              console.error('Auto print trigger error:', err);
            }
          }, 250);
        };
        if (document.readyState === 'complete') {
          triggerPrint();
        } else {
          window.addEventListener('load', triggerPrint);
        }
      })();
    </script>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${cleanTitle}</title>
  <style>
    @page {
      size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
      margin: ${isLandscape ? '8mm 10mm' : '10mm 12mm'};
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      color: #0F172A !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5px;
      line-height: 1.4;
    }
    .samura-print-doc-container {
      width: 100%;
      max-width: ${isLandscape ? '1100px' : '820px'};
      margin: 0 auto;
      padding: 16px 20px;
      background: #ffffff;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      .samura-print-doc-container {
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
    .mono {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-variant-numeric: tabular-nums;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0E5A4F;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .enterprise-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #0E5A4F;
      font-weight: 800;
    }
    .gold-divider {
      height: 2px;
      width: 120px;
      background: linear-gradient(90deg, #0E5A4F, #D9A441, #0E5A4F);
      margin: 4px auto 6px;
    }
    .business-title {
      font-size: 20px;
      font-weight: 800;
      color: #073F37;
      margin: 2px 0;
      letter-spacing: -0.02em;
    }
    .sub-title {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-bar {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 10px;
      color: #475569;
      border-top: 1px dashed #CBD5E1;
      padding-top: 6px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 8px 10px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .card-stat {
      text-align: center;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 6px 8px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .card-stat .label {
      font-size: 9px;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .card-stat .value {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
      table-layout: fixed;
    }
    th {
      background-color: #0E5A4F !important;
      color: #ffffff !important;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #0E5A4F;
    }
    th.text-right, td.text-right {
      text-align: right;
    }
    th.text-center, td.text-center {
      text-align: center;
    }
    td {
      padding: 5px 8px;
      border: 1px solid #E2E8F0;
      vertical-align: middle;
      font-size: 10px;
      line-height: 1.3;
      word-wrap: break-word;
    }
    tr:nth-child(even) {
      background-color: #F8FAFC !important;
    }
    .badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-paid {
      background-color: #DCFCE7 !important;
      color: #15803D !important;
      border: 1px solid #86EFAC;
    }
    .badge-due {
      background-color: #FEF3C7 !important;
      color: #B45309 !important;
      border: 1px solid #FCD34D;
    }
    .badge-overdue {
      background-color: #FEE2E2 !important;
      color: #B91C1C !important;
      border: 1px solid #FCA5A5;
    }
    .calc-box {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 10.5px;
    }
    .calc-row.total {
      border-top: 1px solid #CBD5E1;
      margin-top: 4px;
      padding-top: 5px;
      font-weight: 700;
      font-size: 11px;
    }
    .calc-row.due {
      border-top: 2px solid #0E5A4F;
      margin-top: 4px;
      padding-top: 6px;
      font-weight: 800;
      font-size: 13px;
      color: #B91C1C;
    }
    .signatures {
      margin-top: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      text-align: center;
      font-size: 10px;
      color: #475569;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .sign-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .sign-gap {
      height: 38px;
    }
    .sign-line {
      border-top: 1px dashed #64748B;
      width: 80%;
      padding-top: 5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 9px;
      color: #94A3B8;
      border-top: 1px solid #E2E8F0;
      padding-top: 6px;
      page-break-inside: avoid !important;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  </style>
</head>
<body>
  ${topBarHtml}
  <div class="samura-print-doc-container">
    ${logoHeader}
    ${bodyContent}
    <div class="doc-footer">
      Printed at: ${new Date().toLocaleString('en-US')} · AL SAMURA GROUP ERP · System Generated Report
    </div>
  </div>
  ${autoPrintScript}
</body>
</html>`;
}

function triggerPrintOnHtml(
  title: string,
  bodyContent: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
) {
  try {
    const isLandscape = orientation === 'landscape';
    const cleanTitle = title.replace(/_/g, ' ');

    // 1. Build document HTML with full printable stylesheets
    const fullHtml = buildDocumentHtml(cleanTitle, bodyContent, orientation, true);

    // 2. Generate a valid local Blob URL
    let blobUrl = '';
    try {
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      blobUrl = URL.createObjectURL(blob);
    } catch (e) {
      console.warn('Blob URL creation error:', e);
    }

    // 3. Dispatch an in-app event so the on-screen Print & Document System modal immediately opens!
    // This provides 100% reliability, zero blank screens, and full inspection & export tools.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('samura:open-print-preview', {
          detail: {
            title: cleanTitle,
            html: fullHtml,
            orientation,
            blobUrl
          }
        })
      );
    }

    // 4. In addition, attempt to open in a popup or new tab if the environment allows
    try {
      const targetUrl = blobUrl || 'about:blank';
      const printWin = window.open(
        targetUrl,
        '_blank',
        `width=${isLandscape ? '1180' : '900'},height=850,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
      );
      if (printWin && !blobUrl) {
        printWin.document.open();
        printWin.document.write(fullHtml);
        printWin.document.close();
      }
    } catch (popErr) {
      // Popups may be blocked by sandboxed iframes or browser popup blockers.
      // The on-screen UniversalPrintModal is already visible and handling the action!
      console.log('Popup window blocked, displaying via on-screen print system modal:', popErr);
    }
  } catch (err) {
    console.error('Universal print error:', err);
  }
}

/**
 * 1. Print Single Sale Voucher / Money Receipt
 */
export function printSaleVoucher(record: SaleDueRecord, businessName: string) {
  const exDue = Number(record.exDue) || 0;
  const amount = Number(record.amount) || 0;
  const sacrifice = Number(record.sacrifice) || 0;
  const paid = Number(record.paid) || 0;
  const payableDue = record.payableDue !== undefined && !isNaN(Number(record.payableDue))
    ? Number(record.payableDue)
    : (exDue + amount - sacrifice);
  const runningDue = record.runningDue !== undefined && !isNaN(Number(record.runningDue))
    ? Number(record.runningDue)
    : (payableDue - paid);

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="gold-divider"></div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Sales Invoice & Money Receipt Voucher</div>
      <div class="info-bar">
        <span><strong>Invoice No:</strong> <span class="mono" style="font-weight: 700; color: #0E5A4F;">${record.invoiceNo}</span></span>
        <span><strong>Issue Date:</strong> ${record.date}</span>
        <span><strong>Status:</strong> <span class="badge ${runningDue === 0 ? 'badge-paid' : 'badge-due'}">${record.status || (runningDue === 0 ? 'Full Paid' : 'Due')}</span></span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div style="font-size: 9px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Customer Details</div>
        <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-top: 2px;">${record.customerName}</div>
        <div style="color: #475569; font-size: 10.5px; margin-top: 2px;">${record.address}</div>
      </div>
      <div class="card" style="text-align: right;">
        <div style="font-size: 9px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Market / Cluster</div>
        <div style="font-size: 13px; font-weight: 700; color: #0E5A4F; margin-top: 2px;">${record.customerOf}</div>
        <div style="color: #475569; font-size: 10px; margin-top: 2px;">
          Due Commitment: <strong>${record.duePaymentDate || 'N/A'}</strong>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 44%;">Product Description</th>
          <th class="text-center" style="width: 14%;">Unit</th>
          <th class="text-center" style="width: 14%;">Quantity</th>
          <th class="text-right" style="width: 14%;">Unit Rate</th>
          <th class="text-right" style="width: 14%;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 700; color: #0F172A;">${record.productName}</td>
          <td class="text-center">${record.productUnit}</td>
          <td class="text-center font-bold mono" style="font-size: 11px; font-weight: 700;">${record.quantity}</td>
          <td class="text-right mono">৳ ${fmt(record.unitPrice)}</td>
          <td class="text-right mono" style="font-weight: 800; color: #0F172A;">৳ ${fmt(amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="calc-box">
      <div class="calc-row">
        <span>1. Previous Due (Ex-Due):</span>
        <span class="mono">৳ ${fmt(exDue)}</span>
      </div>
      <div class="calc-row">
        <span>2. Current Sale Amount:</span>
        <span class="mono">৳ ${fmt(amount)}</span>
      </div>
      ${
        sacrifice > 0
          ? `<div class="calc-row" style="color: #B45309; font-weight: 600;">
              <span>3. Special Discount / ছাড়:</span>
              <span class="mono">- ৳ ${fmt(sacrifice)}</span>
            </div>`
          : ''
      }
      <div class="calc-row total">
        <span>Total Payable Due:</span>
        <span class="mono">৳ ${fmt(payableDue)}</span>
      </div>
      <div class="calc-row" style="color: #15803D; font-weight: 700;">
        <span>Cash Paid / Received:</span>
        <span class="mono">- ৳ ${fmt(paid)}</span>
      </div>
      <div class="calc-row due">
        <span>Remaining Due Balance:</span>
        <span class="mono">৳ ${fmt(runningDue)}</span>
      </div>
    </div>

    ${
      record.notes
        ? `<div class="card" style="margin-bottom: 14px; font-size: 10.5px;">
            <strong style="color: #0E5A4F;">Voucher Notes:</strong> ${record.notes}
          </div>`
        : ''
    }

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Customer Signature</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Prepared By (Accounts)</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Manager Authorized</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Invoice_${record.invoiceNo}`, content, 'portrait');
}

/**
 * 2. Print Customer Full Statement & Ledger (A4 Portrait)
 */
export function printCustomerStatement(
  customer: ManagerCustomer,
  records: SaleDueRecord[],
  businessName: string
) {
  const customerRecords = records.filter(
    (r) =>
      r.customerName.toLowerCase().trim() === customer.name.toLowerCase().trim() ||
      (customer.phone && r.address.toLowerCase().includes(customer.phone.toLowerCase()))
  );

  const totalBilled = customerRecords.reduce((acc, curr) => acc + (curr.amount || 0), 0) || (customer.totalSales || 0);
  const totalPaid = customerRecords.reduce((acc, curr) => acc + (curr.paid || 0), 0) || (customer.totalPaid || 0);
  const runningDue = customer.dueAmount !== undefined ? customer.dueAmount : Math.max(0, totalBilled - totalPaid);

  const rows = customerRecords.map((r) => `
    <tr>
      <td>
        <div style="font-weight: 700; color: #0F172A;">${r.date}</div>
        <div class="mono" style="font-size: 8.5px; color: #64748B;">${r.invoiceNo}</div>
      </td>
      <td>
        <div style="font-weight: 600; color: #0E5A4F;">${r.productName}</div>
        <div style="font-size: 9.5px; color: #64748B;">${r.quantity} ${r.productUnit} @ ৳${fmt(r.unitPrice)}</div>
      </td>
      <td class="text-right mono">৳ ${fmt(r.amount)}</td>
      <td class="text-right mono" style="color: #15803D; font-weight: 700;">৳ ${fmt(r.paid)}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 800;">৳ ${fmt(r.runningDue)}</td>
      <td class="text-center">
        <span class="badge ${(r.runningDue || 0) === 0 ? 'badge-paid' : 'badge-due'}">
          ${(r.runningDue || 0) === 0 ? 'Paid' : 'Due'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="gold-divider"></div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Customer Ledger & Account Statement</div>
      <div class="info-bar">
        <span><strong>Statement Date:</strong> ${new Date().toISOString().split('T')[0]}</span>
        <span><strong>Operating Unit:</strong> ${businessName}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div style="font-size: 9px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Customer Profile</div>
        <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-top: 2px;">${customer.name}</div>
        <div style="font-size: 10.5px; color: #475569; margin-top: 2px;">
          Phone: <span class="mono">${customer.phone || 'N/A'}</span> · Address: ${customer.address || 'N/A'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">
          Market Ref: <strong>${customer.reference || 'N/A'}</strong>
        </div>
      </div>

      <div class="card" style="text-align: right; background: #FEF2F2; border-color: #FECACA;">
        <div style="font-size: 9px; color: #991B1B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current Due Balance</div>
        <div class="mono" style="font-size: 20px; font-weight: 800; color: #B91C1C; margin-top: 2px;">
          ৳ ${fmt(runningDue)}
        </div>
        <div style="font-size: 9.5px; color: #991B1B; font-weight: 600;">
          ${runningDue > 0 ? 'Outstanding Unpaid Balance' : 'Fully Settled / Clear'}
        </div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card-stat">
        <div class="label">Total Invoiced</div>
        <div class="value mono">৳ ${fmt(totalBilled)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Paid</div>
        <div class="value mono" style="color: #15803D;">৳ ${fmt(totalPaid)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${fmt(runningDue)}</div>
      </div>
    </div>

    <div style="font-size: 11px; font-weight: 800; color: #0E5A4F; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Transaction History (${customerRecords.length} Invoices)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 17%;">Date & Invoice</th>
          <th style="width: 27%;">Product & Rate</th>
          <th class="text-right" style="width: 14%;">Sale Amount</th>
          <th class="text-right" style="width: 14%;">Paid Amount</th>
          <th class="text-right" style="width: 15%;">Remaining Due</th>
          <th class="text-center" style="width: 13%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="6" class="text-center" style="padding: 16px; color: #64748B;">No transaction records found for this customer</td></tr>'}
      </tbody>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Customer Signature</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Accountant</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Manager Approval</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Statement_${customer.name}`, content, 'portrait');
}

/**
 * 3. Print Sales & Due Full Table Ledger (A4 Landscape)
 */
export function printSalesDueLedger(
  records: SaleDueRecord[],
  businessName: string,
  filterInfo: string = 'All Records'
) {
  const totalSales = records.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPaid = records.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalDue = records.reduce((acc, curr) => acc + (curr.runningDue || 0), 0);
  const totalSacrifice = records.reduce((acc, curr) => acc + (curr.sacrifice || 0), 0);

  const rows = records.map((r, idx) => {
    const exDue = Number(r.exDue) || 0;
    const amount = Number(r.amount) || 0;
    const sacrifice = Number(r.sacrifice) || 0;
    const payableDue = r.payableDue !== undefined && !isNaN(Number(r.payableDue))
      ? Number(r.payableDue)
      : (exDue + amount - sacrifice);
    const runningDue = Number(r.runningDue) || 0;

    return `
    <tr>
      <td class="text-center mono" style="font-weight: 700;">${idx + 1}</td>
      <td>
        <div style="font-weight: 700; color: #0F172A;">${r.date || 'N/A'}</div>
        <div class="mono" style="font-size: 8.5px; color: #64748B;">${r.invoiceNo || 'N/A'}</div>
      </td>
      <td>
        <div style="font-weight: 700; color: #0F172A;">${r.customerName || 'N/A'}</div>
        <div style="font-size: 9.5px; color: #64748B;">${r.customerOf || ''} · ${r.address || ''}</div>
      </td>
      <td>
        <div style="font-weight: 600; color: #0E5A4F;">${r.productName || 'N/A'}</div>
        <div style="font-size: 9.5px; color: #64748B;">${r.quantity || 0} ${r.productUnit || ''} @ ৳${fmt(r.unitPrice)}</div>
      </td>
      <td class="text-right mono">৳ ${fmt(amount)}</td>
      <td class="text-right mono">৳ ${fmt(payableDue)}</td>
      <td class="text-right mono" style="color: #15803D; font-weight: 700;">৳ ${fmt(r.paid)}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 800;">৳ ${fmt(runningDue)}</td>
      <td class="text-center">
        <span class="badge ${runningDue === 0 ? 'badge-paid' : 'badge-due'}">
          ${runningDue === 0 ? 'Paid' : 'Due'}
        </span>
      </td>
    </tr>
  `;
  }).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="gold-divider"></div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Sales & Due Comprehensive Audit Ledger</div>
      <div class="info-bar">
        <span><strong>Report Period:</strong> ${filterInfo}</span>
        <span><strong>Total Invoices:</strong> ${records.length} Transactions</span>
        <span><strong>Audit Date:</strong> ${new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>

    <div class="grid-4">
      <div class="card-stat">
        <div class="label">Total Billed Sales</div>
        <div class="value mono">৳ ${fmt(totalSales)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Cash Collected</div>
        <div class="value mono" style="color: #15803D;">৳ ${fmt(totalPaid)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${fmt(totalDue)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Special Discount / ছাড়</div>
        <div class="value mono" style="color: #B45309;">৳ ${fmt(totalSacrifice)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 32px;">#</th>
          <th style="width: 100px;">Date & Invoice</th>
          <th style="width: 170px;">Customer & Market</th>
          <th style="width: 150px;">Product & Details</th>
          <th class="text-right" style="width: 95px;">Sale Amount</th>
          <th class="text-right" style="width: 95px;">Payable Due</th>
          <th class="text-right" style="width: 95px;">Collected Paid</th>
          <th class="text-right" style="width: 95px;">Remaining Due</th>
          <th class="text-center" style="width: 65px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="9" class="text-center" style="padding: 16px; color: #64748B;">No ledger records found</td></tr>'}
      </tbody>
      <tfoot>
        <tr style="background: #E6F4EA !important; font-weight: 800; border-top: 2px solid #0E5A4F;">
          <td colspan="4" class="text-right" style="font-size: 10.5px; text-transform: uppercase; color: #073F37;">Grand Total Summary:</td>
          <td class="text-right mono" style="color: #0F172A;">৳ ${fmt(totalSales)}</td>
          <td class="text-right mono">-</td>
          <td class="text-right mono" style="color: #15803D;">৳ ${fmt(totalPaid)}</td>
          <td class="text-right mono" style="color: #B91C1C;">৳ ${fmt(totalDue)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Prepared By</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Auditor / Accountant</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Unit Manager Approval</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Sales_Ledger_${businessName}`, content, 'landscape');
}

/**
 * 4. Print Customers List & Due Balances (A4 Landscape)
 */
export function printCustomerList(
  customers: ManagerCustomer[],
  businessName: string
) {
  const totalDue = customers.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
  const totalSales = customers.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
  const totalPaid = customers.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);

  const rows = customers.map((c, idx) => `
    <tr>
      <td class="text-center mono" style="font-weight: 700;">${idx + 1}</td>
      <td>
        <div style="font-weight: 700; color: #0F172A;">${c.name}</div>
        <div style="font-size: 9px; color: #64748B;">Ref: ${c.reference || 'N/A'}</div>
      </td>
      <td class="mono">${c.phone || 'N/A'}</td>
      <td>${c.address || 'N/A'}</td>
      <td class="text-right mono">৳ ${fmt(c.totalSales)}</td>
      <td class="text-right mono" style="color: #15803D; font-weight: 700;">৳ ${fmt(c.totalPaid)}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 800;">৳ ${fmt(c.dueAmount)}</td>
      <td class="text-center">
        <span class="badge ${(c.dueAmount || 0) === 0 ? 'badge-paid' : 'badge-due'}">
          ${(c.dueAmount || 0) === 0 ? 'Clear' : 'Active'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="gold-divider"></div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Customer Directory & Outstanding Due Ledger</div>
      <div class="info-bar">
        <span><strong>Total Customers:</strong> ${customers.length} Parties</span>
        <span><strong>Total Outstanding Dues:</strong> ৳ ${fmt(totalDue)}</span>
        <span><strong>Report Date:</strong> ${new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>

    <div class="grid-3">
      <div class="card-stat">
        <div class="label">Total Registered Customers</div>
        <div class="value mono">${customers.length} Parties</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Collected</div>
        <div class="value mono" style="color: #15803D;">৳ ${fmt(totalPaid)}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${fmt(totalDue)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 32px;">#</th>
          <th style="width: 170px;">Customer Name & Ref</th>
          <th style="width: 110px;">Phone</th>
          <th>Address / Market Location</th>
          <th class="text-right" style="width: 110px;">Total Sales</th>
          <th class="text-right" style="width: 110px;">Total Paid</th>
          <th class="text-right" style="width: 110px;">Current Due</th>
          <th class="text-center" style="width: 70px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="8" class="text-center" style="padding: 16px; color: #64748B;">No customers found</td></tr>'}
      </tbody>
      <tfoot>
        <tr style="background: #E6F4EA !important; font-weight: 800; border-top: 2px solid #0E5A4F;">
          <td colspan="4" class="text-right" style="font-size: 10.5px; text-transform: uppercase; color: #073F37;">Grand Total Summary:</td>
          <td class="text-right mono">৳ ${fmt(totalSales)}</td>
          <td class="text-right mono" style="color: #15803D;">৳ ${fmt(totalPaid)}</td>
          <td class="text-right mono" style="color: #B91C1C;">৳ ${fmt(totalDue)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Prepared By</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Auditor / Accountant</div>
      </div>
      <div class="sign-box">
        <div class="sign-gap"></div>
        <div class="sign-line">Unit Manager Approval</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Customers_List_${businessName}`, content, 'landscape');
}
