"use client";

import React, { useState } from "react";
import { Download, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGeneratorTool() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  
  // From details
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");

  // To details
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Web Development Services", quantity: 1, price: 500 }
  ]);

  const [taxRate, setTaxRate] = useState(0);

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (subtotal * (taxRate / 100));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      const margin = 50;
      let currentY = height - margin;

      const drawText = (text: string, x: number, y: number, size: number, isBold = false) => {
        page.drawText(text || "", { x, y, size, font: isBold ? boldFont : font, color: rgb(0.1, 0.1, 0.1) });
      };

      // Header
      drawText("INVOICE", margin, currentY, 24, true);
      drawText(`Invoice #: ${invoiceNumber}`, width - margin - 150, currentY, 10, true);
      drawText(`Date: ${date}`, width - margin - 150, currentY - 15, 10);
      if (dueDate) drawText(`Due Date: ${dueDate}`, width - margin - 150, currentY - 30, 10);

      currentY -= 60;

      // Addresses
      drawText("From:", margin, currentY, 12, true);
      drawText(fromName || "Sender Name", margin, currentY - 15, 10);
      drawText(fromEmail || "sender@email.com", margin, currentY - 30, 10);
      drawText(fromAddress || "Address line 1\nAddress line 2", margin, currentY - 45, 10);

      const toX = width / 2;
      drawText("Bill To:", toX, currentY, 12, true);
      drawText(toName || "Client Name", toX, currentY - 15, 10);
      drawText(toEmail || "client@email.com", toX, currentY - 30, 10);
      drawText(toAddress || "Address line 1\nAddress line 2", toX, currentY - 45, 10);

      currentY -= 100;

      // Table Header
      page.drawLine({ start: { x: margin, y: currentY }, end: { x: width - margin, y: currentY }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      currentY -= 20;
      
      drawText("Description", margin, currentY, 10, true);
      drawText("Qty", width - margin - 180, currentY, 10, true);
      drawText("Price", width - margin - 100, currentY, 10, true);
      drawText("Amount", width - margin - 50, currentY, 10, true);
      
      currentY -= 10;
      page.drawLine({ start: { x: margin, y: currentY }, end: { x: width - margin, y: currentY }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      
      currentY -= 20;

      // Items
      items.forEach((item) => {
        drawText(item.description || "Item", margin, currentY, 10);
        drawText(item.quantity.toString(), width - margin - 180, currentY, 10);
        drawText(`$${item.price.toFixed(2)}`, width - margin - 100, currentY, 10);
        drawText(`$${(item.quantity * item.price).toFixed(2)}`, width - margin - 50, currentY, 10);
        currentY -= 20;
      });

      currentY -= 10;
      page.drawLine({ start: { x: margin, y: currentY }, end: { x: width - margin, y: currentY }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      currentY -= 30;

      // Totals
      const subtotal = calculateSubtotal();
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;

      drawText("Subtotal:", width - margin - 150, currentY, 10, true);
      drawText(`$${subtotal.toFixed(2)}`, width - margin - 50, currentY, 10);
      currentY -= 20;

      if (taxRate > 0) {
        drawText(`Tax (${taxRate}%):`, width - margin - 150, currentY, 10, true);
        drawText(`$${taxAmount.toFixed(2)}`, width - margin - 50, currentY, 10);
        currentY -= 20;
      }

      drawText("Total:", width - margin - 150, currentY, 12, true);
      drawText(`$${total.toFixed(2)}`, width - margin - 50, currentY, 12, true);

      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = new Uint8Array(pdfBytes).buffer as ArrayBuffer;
      const blob = new Blob([pdfBuffer.slice(0, pdfBuffer.byteLength)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceNumber}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Document Settings */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground">Document Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Invoice Number</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Due Date (Optional)</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground">From</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Your Name / Company" value={fromName} onChange={(e) => setFromName(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
              <input type="email" placeholder="Email Address" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
              <textarea rows={2} placeholder="Street Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground">Bill To</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Client Name / Company" value={toName} onChange={(e) => setToName(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
              <input type="email" placeholder="Email Address" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" />
              <textarea rows={2} placeholder="Street Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} className="w-full rounded-lg border border-border bg-muted/20 p-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex justify-between items-center">
            Line Items
            <button onClick={addItem} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </h3>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-start">
                <input 
                  type="text" 
                  placeholder="Item description" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" 
                />
                <input 
                  type="number" 
                  min="1" 
                  placeholder="Qty" 
                  value={item.quantity || ''} 
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 h-10 rounded-lg border border-border bg-muted/20 px-3 text-sm outline-none focus:border-primary" 
                />
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                  <input 
                    type="number" 
                    min="0" 
                    placeholder="Price" 
                    value={item.price || ''} 
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-28 h-10 rounded-lg border border-border bg-muted/20 pl-7 pr-3 text-sm outline-none focus:border-primary" 
                  />
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  disabled={items.length === 1}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border border-transparent text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Summary Column */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground">Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-2">
                Tax %
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 h-8 rounded border border-border bg-muted/20 px-2 text-xs outline-none focus:border-primary" 
                />
              </span>
              <span className="font-semibold text-foreground">${(calculateSubtotal() * (taxRate / 100)).toFixed(2)}</span>
            </div>
            
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Download className="h-4 w-4" /> Download PDF</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
