"use client";

import React, { useState } from "react";
import { Download, FileText, Plus, Trash2, Loader2, Sparkles, User, Briefcase, GraduationCap, Code } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function ResumeBuilderTool() {
  const [fullName, setFullName] = useState("John Doe");
  const [title, setTitle] = useState("Software Engineer / Student");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [location, setLocation] = useState("New York, USA");
  const [summary, setSummary] = useState("Passionate professional with experience in software development and problem solving.");

  const [skills, setSkills] = useState("React, Next.js, TypeScript, Python, Git, Problem Solving");

  const [experiences, setExperiences] = useState([
    { id: "1", role: "Frontend Developer", company: "Tech Corp", period: "2024 - Present", details: "Developed web applications and improved performance." }
  ]);

  const [education, setEducation] = useState([
    { id: "1", degree: "B.S. in Computer Science", school: "University of Technology", period: "2020 - 2024" }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), role: "", company: "", period: "", details: "" }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), degree: "", school: "", period: "" }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const generateResumePDF = async () => {
    try {
      setIsGenerating(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      const margin = 50;
      let currentY = height - margin;

      const drawText = (text: string, x: number, y: number, size: number, isBold = false, color = rgb(0.1, 0.1, 0.1)) => {
        page.drawText(text || "", { x, y, size, font: isBold ? boldFont : font, color });
      };

      // Header Name
      drawText(fullName.toUpperCase(), margin, currentY, 22, true, rgb(0.12, 0.35, 0.8));
      currentY -= 20;

      // Title
      drawText(title, margin, currentY, 12, true, rgb(0.3, 0.3, 0.3));
      currentY -= 20;

      // Contact Line
      const contactInfo = `${email}  |  ${phone}  |  ${location}`;
      drawText(contactInfo, margin, currentY, 9, false, rgb(0.4, 0.4, 0.4));
      currentY -= 15;

      // Separator
      page.drawLine({ start: { x: margin, y: currentY }, end: { x: width - margin, y: currentY }, thickness: 1.5, color: rgb(0.12, 0.35, 0.8) });
      currentY -= 25;

      // Summary
      if (summary) {
        drawText("PROFESSIONAL SUMMARY", margin, currentY, 11, true, rgb(0.12, 0.35, 0.8));
        currentY -= 15;
        drawText(summary, margin, currentY, 10);
        currentY -= 30;
      }

      // Experience Section
      if (experiences.length > 0) {
        drawText("WORK EXPERIENCE", margin, currentY, 11, true, rgb(0.12, 0.35, 0.8));
        currentY -= 15;
        
        experiences.forEach(exp => {
          drawText(`${exp.role} - ${exp.company}`, margin, currentY, 10, true);
          drawText(exp.period, width - margin - 100, currentY, 9, false, rgb(0.4, 0.4, 0.4));
          currentY -= 15;
          if (exp.details) {
            drawText(`• ${exp.details}`, margin + 10, currentY, 9.5);
            currentY -= 20;
          }
        });
        currentY -= 10;
      }

      // Education Section
      if (education.length > 0) {
        drawText("EDUCATION", margin, currentY, 11, true, rgb(0.12, 0.35, 0.8));
        currentY -= 15;

        education.forEach(edu => {
          drawText(`${edu.degree} - ${edu.school}`, margin, currentY, 10, true);
          drawText(edu.period, width - margin - 100, currentY, 9, false, rgb(0.4, 0.4, 0.4));
          currentY -= 20;
        });
        currentY -= 10;
      }

      // Skills Section
      if (skills) {
        drawText("SKILLS & COMPETENCIES", margin, currentY, 11, true, rgb(0.12, 0.35, 0.8));
        currentY -= 15;
        drawText(skills, margin, currentY, 10);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to build PDF resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
      <div className="lg:col-span-8 space-y-6">
        
        {/* Personal Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10 rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary" />
            <input type="text" placeholder="Professional Title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary" />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary" />
          </div>
          <input type="text" placeholder="Location (e.g. New York, USA)" value={location} onChange={(e) => setLocation(e.target.value)} className="h-10 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary" />
          <textarea rows={3} placeholder="Professional Summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-sm outline-none focus:border-primary" />
        </div>

        {/* Experience */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex justify-between items-center">
            <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Work Experience</span>
            <button onClick={addExperience} className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80"><Plus className="h-3.5 w-3.5" /> Add</button>
          </h3>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="space-y-2 border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <div className="flex gap-2">
                <input type="text" placeholder="Role / Job Title" value={exp.role} onChange={(e) => {
                  const updated = [...experiences];
                  updated[idx].role = e.target.value;
                  setExperiences(updated);
                }} className="flex-1 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => {
                  const updated = [...experiences];
                  updated[idx].company = e.target.value;
                  setExperiences(updated);
                }} className="flex-1 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
                <input type="text" placeholder="Period" value={exp.period} onChange={(e) => {
                  const updated = [...experiences];
                  updated[idx].period = e.target.value;
                  setExperiences(updated);
                }} className="w-28 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
                <button onClick={() => removeExperience(exp.id)} className="text-destructive p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
              <input type="text" placeholder="Key Achievement / Responsibilities" value={exp.details} onChange={(e) => {
                const updated = [...experiences];
                updated[idx].details = e.target.value;
                setExperiences(updated);
              }} className="w-full h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex justify-between items-center">
            <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Education</span>
            <button onClick={addEducation} className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80"><Plus className="h-3.5 w-3.5" /> Add</button>
          </h3>
          {education.map((edu, idx) => (
            <div key={edu.id} className="flex gap-2 items-center">
              <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => {
                const updated = [...education];
                updated[idx].degree = e.target.value;
                setEducation(updated);
              }} className="flex-1 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
              <input type="text" placeholder="School / University" value={edu.school} onChange={(e) => {
                const updated = [...education];
                updated[idx].school = e.target.value;
                setEducation(updated);
              }} className="flex-1 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
              <input type="text" placeholder="Year" value={edu.period} onChange={(e) => {
                const updated = [...education];
                updated[idx].period = e.target.value;
                setEducation(updated);
              }} className="w-28 h-9 rounded-lg border border-border bg-muted/20 px-3 text-xs outline-none focus:border-primary" />
              <button onClick={() => removeEducation(edu.id)} className="text-destructive p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" /> Skills & Competencies
          </h3>
          <textarea rows={2} placeholder="e.g. JavaScript, Python, Management, Communication" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-sm outline-none focus:border-primary" />
        </div>

      </div>

      {/* Live Action & Download Box */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Download Resume PDF
          </h3>
          <p className="text-xs text-muted-foreground">
            Generate an A4 professional PDF resume formatted cleanly client-side in 1-click.
          </p>

          <button
            onClick={generateResumePDF}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isGenerating ? "Building PDF..." : "Download Resume PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
