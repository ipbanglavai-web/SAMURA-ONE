import { SaleDueRecord, ManagerCustomer } from '../types';

/**
 * Universal print helper for ERP reports, vouchers, and statements.
 * Opens a clean printable document with pre-injected styles to ensure
 * pixel-perfect rendering across iFrames, mobile, and desktop.
 */

function triggerPrintOnHtml(title: string, bodyContent: string) {
  // Try opening a popup window first for clean isolated printing
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 12mm 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          color: #111827;
          background: #ffffff;
          font-size: 12px;
          line-height: 1.4;
          padding: 10px;
        }
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0E5A4F;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .enterprise-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #0E5A4F;
          font-weight: 700;
        }
        .business-title {
          font-size: 20px;
          font-weight: 800;
          color: #073F37;
          margin: 3px 0;
        }
        .sub-title {
          font-size: 12px;
          color: #4B5563;
        }
        .info-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #4B5563;
          border-top: 1px dashed #D1D5DB;
          padding-top: 6px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .card {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .card-stat {
          text-align: center;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 8px;
        }
        .card-stat .label {
          font-size: 10px;
          color: #6B7280;
          text-transform: uppercase;
          font-weight: 600;
        }
        .card-stat .value {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin-top: 2px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          font-size: 11px;
        }
        th {
          background-color: #0E5A4F;
          color: #ffffff;
          text-align: left;
          padding: 7px 10px;
          font-weight: 600;
          border: 1px solid #0E5A4F;
        }
        th.text-right, td.text-right {
          text-align: right;
        }
        th.text-center, td.text-center {
          text-align: center;
        }
        td {
          padding: 7px 10px;
          border: 1px solid #E5E7EB;
          vertical-align: middle;
        }
        tr:nth-child(even) {
          background-color: #F9FAFB;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .badge-paid {
          background-color: #DCFCE7;
          color: #15803D;
        }
        .badge-due {
          background-color: #FEF3C7;
          color: #B45309;
        }
        .badge-overdue {
          background-color: #FEE2E2;
          color: #B91C1C;
        }
        .calc-box {
          background: #F9FAFB;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .calc-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          font-size: 11px;
        }
        .calc-row.total {
          border-top: 1px solid #D1D5DB;
          margin-top: 4px;
          padding-top: 6px;
          font-weight: 700;
          font-size: 12px;
        }
        .calc-row.due {
          border-top: 2px solid #0E5A4F;
          margin-top: 4px;
          padding-top: 6px;
          font-weight: 800;
          font-size: 14px;
          color: #B91C1C;
        }
        .signatures {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          text-align: center;
          font-size: 11px;
          color: #4B5563;
        }
        .sign-line {
          border-top: 1px dashed #6B7280;
          padding-top: 6px;
          font-weight: 600;
        }
        .footer {
          margin-top: 24px;
          text-align: center;
          font-size: 10px;
          color: #9CA3AF;
          border-top: 1px solid #E5E7EB;
          padding-top: 8px;
        }
      </style>
    </head>
    <body>
      ${bodyContent}
      <div class="footer">
        Printed at: ${new Date().toLocaleString('en-US')} · AL SAMURA GROUP ERP · System Generated Report
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // If pop-up is blocked by browser/iframe, use a hidden iframe to print
    const hiddenIframe = document.createElement('iframe');
    hiddenIframe.style.position = 'fixed';
    hiddenIframe.style.top = '-9999px';
    hiddenIframe.style.left = '-9999px';
    hiddenIframe.style.width = '0';
    hiddenIframe.style.height = '0';
    hiddenIframe.style.border = '0';
    document.body.appendChild(hiddenIframe);

    const doc = hiddenIframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        hiddenIframe.contentWindow?.focus();
        hiddenIframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(hiddenIframe);
        }, 3000);
      }, 500);
    }
  }
}

/**
 * 1. Print Single Sale Voucher / Money Receipt
 */
export function printSaleVoucher(record: SaleDueRecord, businessName: string) {
  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Sales Invoice & Money Receipt Voucher</div>
      <div class="info-bar">
        <span><strong>Invoice No:</strong> <span class="mono">${record.invoiceNo}</span></span>
        <span><strong>Date:</strong> ${record.date}</span>
        <span><strong>Status:</strong> ${record.status || (record.runningDue === 0 ? 'Full Paid' : 'Due')}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div style="font-size: 10px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Customer Information</div>
        <div style="font-size: 14px; font-weight: 700; margin-top: 2px;">${record.customerName}</div>
        <div style="color: #4B5563; font-size: 11px; margin-top: 2px;">${record.address}</div>
      </div>
      <div class="card" style="text-align: right;">
        <div style="font-size: 10px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Market / Cluster (Customer Of)</div>
        <div style="font-size: 13px; font-weight: 700; color: #0E5A4F; margin-top: 2px;">${record.customerOf}</div>
        <div style="color: #4B5563; font-size: 11px; margin-top: 2px;">
          Due Commitment: <strong>${record.duePaymentDate || 'N/A'}</strong>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product Description</th>
          <th class="text-center">Unit</th>
          <th class="text-center">Quantity</th>
          <th class="text-right">Unit Rate</th>
          <th class="text-right">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 600;">${record.productName}</td>
          <td class="text-center">${record.productUnit}</td>
          <td class="text-center font-bold mono">${record.quantity}</td>
          <td class="text-right mono">৳ ${record.unitPrice.toLocaleString()}</td>
          <td class="text-right mono" style="font-weight: 700;">৳ ${record.amount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="calc-box">
      <div class="calc-row">
        <span>1. Previous Due (Ex-Due):</span>
        <span class="mono">৳ ${record.exDue.toLocaleString()}</span>
      </div>
      <div class="calc-row">
        <span>2. Current Sale Amount:</span>
        <span class="mono">৳ ${record.amount.toLocaleString()}</span>
      </div>
      ${
        record.sacrifice > 0
          ? `<div class="calc-row" style="color: #D97706;">
              <span>3. Sacrifice / Discount:</span>
              <span class="mono">- ৳ ${record.sacrifice.toLocaleString()}</span>
            </div>`
          : ''
      }
      <div class="calc-row total">
        <span>Total Payable Due:</span>
        <span class="mono">৳ ${record.payableDue.toLocaleString()}</span>
      </div>
      <div class="calc-row" style="color: #15803D; font-weight: 700;">
        <span>Cash Paid Amount:</span>
        <span class="mono">- ৳ ${record.paid.toLocaleString()}</span>
      </div>
      <div class="calc-row due">
        <span>Remaining Due Balance:</span>
        <span class="mono">৳ ${record.runningDue.toLocaleString()}</span>
      </div>
    </div>

    ${
      record.notes
        ? `<div class="card" style="margin-bottom: 16px; font-size: 11px;">
            <strong>Notes:</strong> ${record.notes}
          </div>`
        : ''
    }

    <div class="signatures">
      <div>
        <div class="sign-line">Customer Signature</div>
      </div>
      <div>
        <div class="sign-line">Accountant</div>
      </div>
      <div>
        <div class="sign-line">Manager / In-Charge</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Invoice_${record.invoiceNo}`, content);
}

/**
 * 2. Print Customer Ledger Statement
 */
export function printCustomerStatement(
  customer: ManagerCustomer,
  records: SaleDueRecord[],
  businessName: string
) {
  const customerRecords = records.filter(
    (r) =>
      r.customerName.toLowerCase().trim() === customer.name.toLowerCase().trim() ||
      r.address.toLowerCase().includes(customer.phone.toLowerCase())
  );

  const totalBilled = customerRecords.reduce((acc, curr) => acc + curr.amount, 0) || customer.totalSales || 0;
  const totalPaid = customerRecords.reduce((acc, curr) => acc + curr.paid, 0) || customer.totalPaid || 0;
  const runningDue = customer.dueAmount;

  const rows = customerRecords.map((r) => `
    <tr>
      <td>
        <div style="font-weight: 600;">${r.date}</div>
        <div class="mono" style="font-size: 9px; color: #6B7280;">${r.invoiceNo}</div>
      </td>
      <td>
        <div style="font-weight: 600; color: #0E5A4F;">${r.productName}</div>
        <div style="font-size: 10px; color: #6B7280;">${r.quantity} ${r.productUnit} @ ৳${r.unitPrice}</div>
      </td>
      <td class="text-right mono">৳ ${r.amount.toLocaleString()}</td>
      <td class="text-right mono" style="color: #15803D; font-weight: 600;">৳ ${r.paid.toLocaleString()}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 700;">৳ ${r.runningDue.toLocaleString()}</td>
      <td class="text-center">
        <span class="badge ${r.runningDue === 0 ? 'badge-paid' : 'badge-due'}">
          ${r.runningDue === 0 ? 'Paid' : 'Due'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Customer Ledger & Account Statement</div>
      <div class="info-bar">
        <span><strong>Statement Date:</strong> ${new Date().toISOString().split('T')[0]}</span>
        <span><strong>Branch / Unit:</strong> ${businessName}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div style="font-size: 10px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Customer Profile</div>
        <div style="font-size: 16px; font-weight: 700; margin-top: 2px;">${customer.name}</div>
        <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">
          Phone: <span class="mono">${customer.phone}</span> · Address: ${customer.address}
        </div>
        <div style="font-size: 11px; color: #4B5563;">
          Reference: <strong>${customer.reference || 'N/A'}</strong>
        </div>
      </div>

      <div class="card" style="text-align: right; background: #FEF2F2; border-color: #FECACA;">
        <div style="font-size: 10px; color: #991B1B; font-weight: 700; text-transform: uppercase;">Current Due Balance</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #B91C1C; margin-top: 2px;">
          ৳ ${runningDue.toLocaleString()}
        </div>
        <div style="font-size: 10px; color: #991B1B;">
          ${runningDue > 0 ? 'Outstanding Unpaid Balance' : 'Fully Settled / Clear'}
        </div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card-stat">
        <div class="label">Total Billed</div>
        <div class="value mono">৳ ${totalBilled.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Paid</div>
        <div class="value mono" style="color: #15803D;">৳ ${totalPaid.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${runningDue.toLocaleString()}</div>
      </div>
    </div>

    <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">Invoice & Transaction History</div>
    <table>
      <thead>
        <tr>
          <th>Date & Invoice</th>
          <th>Product & Rate</th>
          <th class="text-right">Sale Amount</th>
          <th class="text-right">Paid Amount</th>
          <th class="text-right">Remaining Due</th>
          <th class="text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="6" class="text-center">No transaction records found</td></tr>'}
      </tbody>
    </table>

    <div class="signatures" style="margin-top: 50px;">
      <div>
        <div class="sign-line">Customer Signature</div>
      </div>
      <div>
        <div class="sign-line">Accountant</div>
      </div>
      <div>
        <div class="sign-line">Manager Approval</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Statement_${customer.name}`, content);
}

/**
 * 3. Print Sales & Due Full Table Ledger
 */
export function printSalesDueLedger(
  records: SaleDueRecord[],
  businessName: string,
  filterInfo: string = 'All Records'
) {
  const totalSales = records.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = records.reduce((acc, curr) => acc + curr.paid, 0);
  const totalDue = records.reduce((acc, curr) => acc + curr.runningDue, 0);
  const totalSacrifice = records.reduce((acc, curr) => acc + curr.sacrifice, 0);

  const rows = records.map((r, idx) => `
    <tr>
      <td class="text-center mono">${idx + 1}</td>
      <td>
        <div style="font-weight: 600;">${r.date}</div>
        <div class="mono" style="font-size: 9px; color: #6B7280;">${r.invoiceNo}</div>
      </td>
      <td>
        <div style="font-weight: 700;">${r.customerName}</div>
        <div style="font-size: 10px; color: #6B7280;">${r.customerOf} · ${r.address}</div>
      </td>
      <td>
        <div>${r.productName}</div>
        <div style="font-size: 10px; color: #6B7280;">${r.quantity} ${r.productUnit} @ ৳${r.unitPrice}</div>
      </td>
      <td class="text-right mono">৳ ${r.amount.toLocaleString()}</td>
      <td class="text-right mono">৳ ${r.payableDue.toLocaleString()}</td>
      <td class="text-right mono" style="color: #15803D; font-weight: 600;">৳ ${r.paid.toLocaleString()}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 700;">৳ ${r.runningDue.toLocaleString()}</td>
      <td class="text-center">
        <span class="badge ${r.runningDue === 0 ? 'badge-paid' : 'badge-due'}">
          ${r.runningDue === 0 ? 'Paid' : 'Due'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Sales & Due Comprehensive Audit Ledger</div>
      <div class="info-bar">
        <span><strong>Report Period:</strong> ${filterInfo}</span>
        <span><strong>Total Records:</strong> ${records.length} Invoices</span>
        <span><strong>Print Date:</strong> ${new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>

    <div class="grid-4">
      <div class="card-stat">
        <div class="label">Total Sales</div>
        <div class="value mono">৳ ${totalSales.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Collected</div>
        <div class="value mono" style="color: #15803D;">৳ ${totalPaid.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${totalDue.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Discount</div>
        <div class="value mono" style="color: #D97706;">৳ ${totalSacrifice.toLocaleString()}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 30px;">#</th>
          <th>Date & Invoice</th>
          <th>Customer & Market</th>
          <th>Product & Rate</th>
          <th class="text-right">Sale Amount</th>
          <th class="text-right">Payable Due</th>
          <th class="text-right">Collected Paid</th>
          <th class="text-right">Remaining Due</th>
          <th class="text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="background: #F3F4F6; font-weight: 700;">
          <td colspan="4" class="text-right">Total:</td>
          <td class="text-right mono">৳ ${totalSales.toLocaleString()}</td>
          <td class="text-right mono">-</td>
          <td class="text-right mono" style="color: #15803D;">৳ ${totalPaid.toLocaleString()}</td>
          <td class="text-right mono" style="color: #B91C1C;">৳ ${totalDue.toLocaleString()}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="signatures" style="margin-top: 40px;">
      <div>
        <div class="sign-line">Prepared By</div>
      </div>
      <div>
        <div class="sign-line">Accountant</div>
      </div>
      <div>
        <div class="sign-line">Unit Manager Signature</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Sales_Ledger_${businessName}`, content);
}

/**
 * 4. Print Customers List & Due Balances
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
      <td class="text-center mono">${idx + 1}</td>
      <td>
        <div style="font-weight: 700;">${c.name}</div>
        <div style="font-size: 10px; color: #6B7280;">Ref: ${c.reference || 'N/A'}</div>
      </td>
      <td class="mono">${c.phone}</td>
      <td>${c.address}</td>
      <td class="text-right mono">৳ ${(c.totalSales || 0).toLocaleString()}</td>
      <td class="text-right mono" style="color: #15803D;">৳ ${(c.totalPaid || 0).toLocaleString()}</td>
      <td class="text-right mono" style="color: #B91C1C; font-weight: 700;">৳ ${(c.dueAmount || 0).toLocaleString()}</td>
      <td class="text-center">
        <span class="badge ${c.dueAmount === 0 ? 'badge-paid' : 'badge-due'}">
          ${c.dueAmount === 0 ? 'Clear' : 'Active'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="enterprise-title">AL SAMURA GROUP OF COMPANIES</div>
      <div class="business-title">${businessName}</div>
      <div class="sub-title">Customer Directory & Outstanding Due Ledger</div>
      <div class="info-bar">
        <span><strong>Total Customers:</strong> ${customers.length} Parties</span>
        <span><strong>Total Outstanding Dues:</strong> ৳ ${totalDue.toLocaleString()}</span>
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
        <div class="value mono" style="color: #15803D;">৳ ${totalPaid.toLocaleString()}</div>
      </div>
      <div class="card-stat">
        <div class="label">Total Outstanding Due</div>
        <div class="value mono" style="color: #B91C1C;">৳ ${totalDue.toLocaleString()}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 30px;">#</th>
          <th>Customer Name & Ref</th>
          <th>Phone</th>
          <th>Address</th>
          <th class="text-right">Total Sales</th>
          <th class="text-right">Total Paid</th>
          <th class="text-right">Current Due</th>
          <th class="text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="background: #F3F4F6; font-weight: 700;">
          <td colspan="4" class="text-right">Total:</td>
          <td class="text-right mono">৳ ${totalSales.toLocaleString()}</td>
          <td class="text-right mono" style="color: #15803D;">৳ ${totalPaid.toLocaleString()}</td>
          <td class="text-right mono" style="color: #B91C1C;">৳ ${totalDue.toLocaleString()}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="signatures" style="margin-top: 40px;">
      <div>
        <div class="sign-line">Prepared By</div>
      </div>
      <div>
        <div class="sign-line">Auditor / Accountant</div>
      </div>
      <div>
        <div class="sign-line">Unit Manager Approval</div>
      </div>
    </div>
  `;

  triggerPrintOnHtml(`Customers_List_${businessName}`, content);
}
