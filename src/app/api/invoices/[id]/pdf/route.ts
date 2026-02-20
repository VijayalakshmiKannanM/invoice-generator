import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
      include: {
        customer: true,
        lineItems: true,
        user: {
          select: { name: true, email: true, company: true, address: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(28).fillColor('#1e40af').text('INVOICE', 50, 50);
    doc.fontSize(12).fillColor('#666').text(invoice.invoiceNumber, 50, 85);

    // Company Info (right side)
    const companyName = invoice.user.company || invoice.user.name || 'Your Company';
    doc.fontSize(14).fillColor('#111').text(companyName, 350, 50, { align: 'right' });
    doc.fontSize(10).fillColor('#666').text(invoice.user.email, 350, 70, { align: 'right' });
    if (invoice.user.address) {
      doc.text(invoice.user.address, 350, 85, { align: 'right' });
    }

    // Bill To
    doc.fontSize(10).fillColor('#666').text('BILL TO', 50, 140);
    doc.fontSize(12).fillColor('#111').text(invoice.customer.name, 50, 155);
    if (invoice.customer.company) {
      doc.fontSize(10).fillColor('#666').text(invoice.customer.company, 50, 172);
    }
    doc.fontSize(10).fillColor('#666').text(invoice.customer.email, 50, 187);
    if (invoice.customer.address) {
      doc.text(invoice.customer.address, 50, 202);
    }

    // Dates
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    doc.fontSize(10).fillColor('#666').text('Issue Date:', 400, 140);
    doc.fillColor('#111').text(formatDate(invoice.issueDate), 470, 140);
    doc.fillColor('#666').text('Due Date:', 400, 157);
    doc.fillColor('#111').text(formatDate(invoice.dueDate), 470, 157);

    // Status badge
    const statusColors: Record<string, string> = {
      DRAFT: '#9ca3af',
      SENT: '#3b82f6',
      PAID: '#22c55e',
      OVERDUE: '#ef4444',
      CANCELLED: '#6b7280',
    };
    doc.roundedRect(400, 175, 80, 20, 3)
      .fill(statusColors[invoice.status] || '#9ca3af');
    doc.fontSize(10).fillColor('#fff').text(invoice.status, 410, 180);

    // Line Items Table Header
    const tableTop = 250;
    doc.fillColor('#f3f4f6').rect(50, tableTop, 500, 25).fill();
    doc.fontSize(10).fillColor('#374151');
    doc.text('Description', 60, tableTop + 8);
    doc.text('Qty', 320, tableTop + 8);
    doc.text('Unit Price', 380, tableTop + 8);
    doc.text('Amount', 480, tableTop + 8);

    // Line Items
    let yPosition = tableTop + 30;
    doc.fillColor('#111');

    for (const item of invoice.lineItems) {
      doc.fontSize(10).fillColor('#111').text(item.description, 60, yPosition, { width: 250 });
      doc.text(item.quantity.toString(), 320, yPosition);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 380, yPosition);
      doc.text(`$${item.amount.toFixed(2)}`, 480, yPosition);
      yPosition += 25;
    }

    // Separator line
    doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke('#e5e7eb');

    // Summary
    yPosition += 30;
    const summaryX = 380;

    doc.fontSize(10).fillColor('#666').text('Subtotal:', summaryX, yPosition);
    doc.fillColor('#111').text(`$${invoice.subtotal.toFixed(2)}`, 480, yPosition);
    yPosition += 18;

    if (invoice.discount > 0) {
      doc.fillColor('#666').text('Discount:', summaryX, yPosition);
      doc.fillColor('#ef4444').text(`-$${invoice.discount.toFixed(2)}`, 480, yPosition);
      yPosition += 18;
    }

    if (invoice.taxRate > 0) {
      doc.fillColor('#666').text(`Tax (${invoice.taxRate}%):`, summaryX, yPosition);
      doc.fillColor('#111').text(`$${invoice.taxAmount.toFixed(2)}`, 480, yPosition);
      yPosition += 18;
    }

    // Total
    doc.moveTo(summaryX, yPosition + 5).lineTo(550, yPosition + 5).stroke('#e5e7eb');
    yPosition += 15;
    doc.fontSize(14).fillColor('#111').text('Total:', summaryX, yPosition);
    doc.fillColor('#1e40af').text(`$${invoice.total.toFixed(2)}`, 480, yPosition);

    // Notes
    if (invoice.notes) {
      yPosition += 50;
      doc.fontSize(10).fillColor('#666').text('Notes:', 50, yPosition);
      doc.fontSize(10).fillColor('#374151').text(invoice.notes, 50, yPosition + 15, { width: 500 });
    }

    // Footer
    doc.fontSize(8).fillColor('#9ca3af')
      .text('Generated by Invoice Generator', 50, 750, { align: 'center' });

    doc.end();

    // Wait for PDF to finish
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
