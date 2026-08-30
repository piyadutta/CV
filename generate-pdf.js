import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('Generating Piya Dutta CV PDF fitted strictly onto 1 SINGLE A4 PAGE...');
  
  const publicDir = path.join(__dirname, '../public/assets');
  const pdfPath = path.join(publicDir, 'Piya_Dutta_CV.pdf');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const profileImgPath = path.join(publicDir, 'profile.jpg');
  let profileBase64 = '';
  if (fs.existsSync(profileImgPath)) {
    const imgBuf = fs.readFileSync(profileImgPath);
    profileBase64 = `data:image/jpeg;base64,${imgBuf.toString('base64')}`;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PIYA DUTTA - CV</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html, body {
      width: 210mm;
      height: 297mm;
      font-family: 'Inter', sans-serif;
      background-color: #8B5CF6; /* Lavender Outer Frame */
      padding: 10px;
      color: #1E293B;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      overflow: hidden;
    }
    
    .cv-page {
      background: #FFFFFF;
      width: 100%;
      height: 100%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    
    /* Top Right Header Banner */
    .top-header {
      background: #2C384E; /* Dark Slate Navy Header */
      color: #FFFFFF;
      padding: 18px 25px 18px 240px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 110px;
      position: relative;
    }
    
    .top-header h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: #FFFFFF;
    }
    
    .top-header p {
      font-size: 13px;
      font-weight: 500;
      color: #E2E8F0;
      letter-spacing: 0.5px;
    }
    
    /* Main Layout Grid */
    .cv-body {
      display: flex;
      flex: 1;
      position: relative;
      height: calc(100% - 110px);
    }
    
    /* Left Sidebar */
    .sidebar {
      width: 225px;
      background: #E9ECEF; /* Soft light gray sidebar */
      padding: 95px 16px 20px 18px;
      border-right: 1px solid #CBD5E1;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 10;
    }
    
    /* Circular Avatar Overlapping Header & Sidebar */
    .avatar-container {
      position: absolute;
      top: -88px;
      left: 45px;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 5px solid #FFFFFF;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      overflow: hidden;
      background: #CBD5E1;
      z-index: 20;
    }
    
    .avatar-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .sidebar-section {
      margin-bottom: 16px;
    }
    
    .sidebar-title {
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #1E293B;
      padding-bottom: 4px;
      border-bottom: 2px solid #94A3B8;
      margin-bottom: 8px;
    }
    
    .sidebar-list {
      list-style: none;
      font-size: 11px;
      color: #334155;
      line-height: 1.55;
    }
    
    .sidebar-list li {
      margin-bottom: 6px;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .sidebar-list i {
      color: #2C384E;
      font-size: 11px;
      margin-top: 2px;
      width: 12px;
      text-align: center;
    }
    
    .sidebar-list strong {
      color: #0F172A;
      font-weight: 700;
    }
    
    /* Right Main Content */
    .content {
      flex: 1;
      padding: 16px 25px 15px 32px;
      position: relative;
    }
    
    .section-block {
      position: relative;
      padding-left: 28px;
      margin-bottom: 12px;
    }
    
    /* Timeline track vertical line */
    .section-block::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 22px;
      bottom: -10px;
      width: 2px;
      background: #CBD5E1;
    }
    
    .section-block:last-child::before {
      display: none;
    }
    
    /* Timeline icon badge */
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
      position: relative;
    }
    
    .timeline-dot {
      position: absolute;
      left: -28px;
      top: 0px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2C384E;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9.5px;
      box-shadow: 0 0 0 2px #FFFFFF, 0 1px 4px rgba(0,0,0,0.15);
      z-index: 5;
    }
    
    .section-title {
      font-size: 13.5px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #1E293B;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 2px;
      width: 100%;
    }
    
    .section-content {
      font-size: 11.2px;
      color: #334155;
      line-height: 1.48;
    }
    
    .item-title {
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
    }
    
    .item-sub {
      font-size: 10.8px;
      font-weight: 600;
      color: #2563EB;
      margin-bottom: 2px;
    }
    
    ul.bullet-list {
      padding-left: 14px;
      margin-top: 2px;
    }
    
    ul.bullet-list li {
      margin-bottom: 2px;
    }
    
    .footer-credit {
      text-align: right;
      font-size: 9.5px;
      color: #64748B;
      padding: 6px 25px 8px;
      margin-top: auto;
    }
  </style>
</head>
<body>
  <div class="cv-page">
    
    <!-- Top Navy Header Banner -->
    <div class="top-header">
      <h1>PIYA DUTTA</h1>
      <p>B.Tech in CS (Appearing) | Civil Engineering & Computer Professional</p>
    </div>
    
    <div class="cv-body">
      
      <!-- Left Sidebar -->
      <div class="sidebar">
        <!-- Avatar Photo Overlapping Header & Sidebar -->
        <div class="avatar-container">
          <img src="${profileBase64}" alt="Piya Dutta Profile" />
        </div>
        
        <!-- CONTACT Section -->
        <div class="sidebar-section">
          <div class="sidebar-title">CONTACT</div>
          <ul class="sidebar-list">
            <li><i class="fa-solid fa-phone"></i> <div><strong>Phone:</strong> +91-7319471738</div></li>
            <li><i class="fa-solid fa-envelope"></i> <div><strong>Email:</strong> piudutta2707@gmail.com</div></li>
            <li><i class="fa-solid fa-location-dot"></i> <div><strong>Location:</strong> Bongaon, North 24 Parganas, WB</div></li>
            <li><i class="fa-brands fa-linkedin"></i> <div><strong>LinkedIn:</strong> linkedin.com/in/piyadutta</div></li>
          </ul>
        </div>
        
        <!-- CERTIFICATIONS Section -->
        <div class="sidebar-section">
          <div class="sidebar-title">CERTIFICATIONS</div>
          <ul class="sidebar-list">
            <li><i class="fa-solid fa-award"></i> <div><strong>ADCA:</strong> Advanced Diploma in Computer Applications</div></li>
            <li><i class="fa-solid fa-receipt"></i> <div><strong>Tally GST:</strong> Certified Accounting & GST Specialist</div></li>
          </ul>
        </div>

        <!-- DETAILS Section -->
        <div class="sidebar-section">
          <div class="sidebar-title">DETAILS</div>
          <ul class="sidebar-list">
            <li><strong>Degree:</strong> B.Tech CS (Appearing)</li>
            <li><strong>Engineering:</strong> Diploma Civil Engg</li>
            <li><strong>Marital Status:</strong> Single</li>
          </ul>
        </div>
        
        <!-- LANGUAGES Section -->
        <div class="sidebar-section">
          <div class="sidebar-title">LANGUAGES</div>
          <ul class="sidebar-list">
            <li>• Bengali (Native)</li>
            <li>• Hindi (Fluent)</li>
            <li>• English (Professional)</li>
          </ul>
        </div>
      </div>
      
      <!-- Right Main Content -->
      <div class="content">
        
        <!-- CAREER OBJECTIVE -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-user"></i></div>
            <div class="section-title">CAREER OBJECTIVE</div>
          </div>
          <div class="section-content">
            Motivated computer science and civil engineering professional with 2 years of computer teaching experience. Skilled in Tally Prime with GST, MS Office Suite, Graphic Design, and Web Development. Dedicated to applying technical accuracy and teaching expertise in a progressive organization.
          </div>
        </div>
        
        <!-- EDUCATION -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-graduation-cap"></i></div>
            <div class="section-title">EDUCATION</div>
          </div>
          <div class="section-content">
            <div style="margin-bottom: 6px;">
              <div class="item-title">B.Tech in Computer Science & Engineering (Appearing)</div>
              <div class="item-sub">Camellia Institute of Technology (MAKAUT)</div>
              <ul class="bullet-list">
                <li>Relevant Coursework: Software Engineering, Data Structures, Web Technologies, Database Systems.</li>
              </ul>
            </div>
            <div style="margin-bottom: 6px;">
              <div class="item-title">Diploma in Civil Engineering</div>
              <div class="item-sub">Gaighata Government Polytechnic (WBSCT&VE&SD)</div>
              <ul class="bullet-list">
                <li>Relevant Coursework: Building Construction, Surveying, AutoCAD Drafting, Structural Estimation.</li>
              </ul>
            </div>
            <div>
              <div class="item-title">Advanced Diploma in Computer Applications (ADCA)</div>
              <div class="item-sub">Aptech Computer Education</div>
              <ul class="bullet-list">
                <li>Skills: Tally Prime with GST, MS Excel (Advanced), Graphic Design, Basic Web Development.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- PROJECTS -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-folder-open"></i></div>
            <div class="section-title">PROJECTS</div>
          </div>
          <div class="section-content">
            <div style="margin-bottom: 6px;">
              <div class="item-title">Tally GST Accounting & Billing Automation Workflow</div>
              <ul class="bullet-list">
                <li>Designed multi-firm ledger structures, inventory stock groups, and GST calculation templates for lab training.</li>
              </ul>
            </div>
            <div>
              <div class="item-title">Civil Architectural Building Layout & Plan (AutoCAD)</div>
              <ul class="bullet-list">
                <li>Developed 2D CAD floor plans and quantity estimations for residential building projects.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- WORK EXPERIENCE -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-briefcase"></i></div>
            <div class="section-title">WORK EXPERIENCE</div>
          </div>
          <div class="section-content">
            <div class="item-title">Computer Teacher (2 Years)</div>
            <div class="item-sub">Institute Eldorado | Bongaon, West Bengal</div>
            <ul class="bullet-list">
              <li>Instructed 100+ students in computer operations, MS Office Suite, and practical Tally GST accounting.</li>
              <li>Designed lab exercises, course modules, and conducted formal practical examinations.</li>
            </ul>
          </div>
        </div>
        
        <!-- KEY SKILLS -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-screwdriver-wrench"></i></div>
            <div class="section-title">KEY SKILLS</div>
          </div>
          <div class="section-content">
            <ul class="bullet-list">
              <li><strong>Programming & Tech:</strong> C Programming, Python, HTML5 & CSS3, AI Tools (ChatGPT/Prompting).</li>
              <li><strong>Software & Office:</strong> Tally with GST, Graphic Design (Photoshop/Canva), MS Office Suite.</li>
              <li><strong>Soft Skills:</strong> Computer Teaching, Technical Communication, Problem Solving, Quick Learning.</li>
            </ul>
          </div>
        </div>
        
        <!-- KEY STRENGTHS & HIGHLIGHTS -->
        <div class="section-block">
          <div class="section-header">
            <div class="timeline-dot"><i class="fa-solid fa-award"></i></div>
            <div class="section-title">KEY STRENGTHS</div>
          </div>
          <div class="section-content">
            <ul class="bullet-list">
              <li>Highly adaptable quick learner; punctual, responsible, and structured approach to project execution.</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
    
    <div class="footer-credit">
      © Piya Dutta. All rights reserved
    </div>
  </div>
</body>
</html>
  `;

  let executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (!fs.existsSync(executablePath)) {
    executablePath = undefined;
  }

  const launchOpts = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
  if (executablePath) {
    launchOpts.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  // Also sync to root assets folder for direct GitHub Pages root deployment compatibility
  const rootAssetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(rootAssetsDir)) {
    fs.mkdirSync(rootAssetsDir, { recursive: true });
  }
  const rootPdfPath = path.join(rootAssetsDir, 'Piya_Dutta_CV.pdf');
  fs.copyFileSync(pdfPath, rootPdfPath);

  await browser.close();
  console.log(`PDF successfully generated fitting strictly 1 PAGE at: ${pdfPath} and ${rootPdfPath}`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
