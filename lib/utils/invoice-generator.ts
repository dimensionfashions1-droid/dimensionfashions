import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface InvoiceData {
  orderNumber: string
  date: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  items: {
    title: string
    quantity: number
    price: number
    attributes?: any
  }[]
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF()
  const accentColor = [254, 98, 75] // #FE624B

  // --- HEADER ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.setTextColor(17, 17, 17)
  doc.text("DIMENSION", 20, 25)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("PREMIUM WOMEN'S WEAR", 20, 32)

  // INVOICE LABEL
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 17, 17)
  doc.text("INVOICE", 150, 25)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`#${data.orderNumber}`, 150, 32)
  doc.text(data.date, 150, 37)

  // --- ADDRESSES ---
  doc.setDrawColor(240, 240, 240)
  doc.line(20, 45, 190, 45)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 17, 17)
  doc.text("BILL TO:", 20, 55)
  doc.setFont("helvetica", "normal")
  doc.text(data.customerName, 20, 62)
  doc.setTextColor(100, 100, 100)
  doc.text(data.email, 20, 67)
  doc.text(data.phone, 20, 72)
  
  const addressLines = doc.splitTextToSize(`${data.address}, ${data.city}, ${data.state} - ${data.pincode}`, 80)
  doc.text(addressLines, 20, 77)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 17, 17)
  doc.text("FROM:", 120, 55)
  doc.setFont("helvetica", "normal")
  doc.text("DIMENSION FASHIONS", 120, 62)
  doc.setTextColor(100, 100, 100)
  doc.text("N.M Sungam, Valparai main road", 120, 67)
  doc.text("Pollachi, Tamil Nadu, 642007", 120, 72)
  doc.text("contact@dimensionfashions.com", 120, 77)

  // --- ITEMS TABLE ---
  const tableRows = data.items.map((item, index) => {
    let title = item.title
    if (item.attributes && Object.keys(item.attributes).length > 0) {
      const attrs = Object.entries(item.attributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
      title += ` (${attrs})`
    }
    const qty = Number(item.quantity || 0)
    const price = Number(item.price || 0)
    return [
      index + 1,
      title,
      qty,
      `INR ${price.toLocaleString()}`,
      `INR ${(qty * price).toLocaleString()}`
    ]
  })

  autoTable(doc, {
    startY: 100,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [17, 17, 17],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 },
    }
  })

  // --- TOTALS ---
  const finalY = (doc as any).lastAutoTable.finalY + 10

  doc.setFont("helvetica", "normal")
  doc.text("Subtotal:", 140, finalY)
  doc.text(`INR ${Number(data.subtotal || 0).toLocaleString()}`, 190, finalY, { align: "right" })

  doc.text("Shipping:", 140, finalY + 7)
  doc.text(`INR ${Number(data.shipping || 0).toLocaleString()}`, 190, finalY + 7, { align: "right" })

  if (data.discount > 0) {
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.text("Discount:", 140, finalY + 14)
    doc.text(`- INR ${Number(data.discount || 0).toLocaleString()}`, 190, finalY + 14, { align: "right" })
  }

  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 17, 17)
  doc.setFontSize(12)
  const totalY = finalY + (data.discount > 0 ? 25 : 18)
  doc.text("Grand Total:", 140, totalY)
  doc.text(`INR ${Number(data.total || 0).toLocaleString()}`, 190, totalY, { align: "right" })

  // --- FOOTER ---
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(150, 150, 150)
  doc.text("Thank you for shopping with DIMENSION!", 105, 280, { align: "center" })
  doc.text("This is a computer-generated invoice.", 105, 285, { align: "center" })

  // SAVE
  doc.save(`Invoice-${data.orderNumber}.pdf`)
}
