import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_convergence_pdf(data: dict) -> io.BytesIO:
    """
    Generates a formal, publication-grade Scheme Convergence Strategy Report
    using ReportLab for District Collectors and Nodal Officers.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0F172A')
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1E3A8A')
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor('#334155')
    )

    body_bold = ParagraphStyle(
        'BodyBoldCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # 1. Official Header
    story.append(Paragraph("GOVERNMENT OF MADHYA PRADESH", subtitle_style))
    story.append(Paragraph("OFFICE OF THE DISTRICT COLLECTOR & MAGISTRATE", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("STRATEGIC SCHEME CONVERGENCE DOSSIER", title_style))
    story.append(Paragraph(f"Development Objective: {data.get('objective_name', 'Agricultural Transformation')}", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    # 2. Metadata Box Table
    loc = data.get("location", {})
    state_str = loc.get("state", "Madhya Pradesh")
    dist_str = loc.get("district", "Sehore")
    div_str = loc.get("division", "Bhopal")
    synergy = data.get("convergence_synergy_score", 94.5)
    est_value = data.get("estimated_annual_combined_value_inr", 145500.0)
    now_str = datetime.now().strftime("%d-%b-%Y")

    meta_data = [
        [
            Paragraph("<b>Target State:</b>", table_cell_bold), Paragraph(state_str, table_cell),
            Paragraph("<b>Division & District:</b>", table_cell_bold), Paragraph(f"{div_str} / {dist_str}", table_cell)
        ],
        [
            Paragraph("<b>Target Beneficiary:</b>", table_cell_bold), Paragraph(data.get("target_beneficiary", "Small & Marginal Farmers"), table_cell),
            Paragraph("<b>Date of Synthesis:</b>", table_cell_bold), Paragraph(now_str, table_cell)
        ],
        [
            Paragraph("<b>Convergence Synergy Index:</b>", table_cell_bold), Paragraph(f"<b><font color='#059669'>{synergy}% (Optimal Synergy)</font></b>", table_cell),
            Paragraph("<b>Est. Combined Value / Beneficiary:</b>", table_cell_bold), Paragraph(f"<b>Rs. {est_value:,.0f}</b>", table_cell)
        ]
    ]

    meta_table = Table(meta_data, colWidths=[120, 140, 130, 130])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 3. Executive Strategic Summary
    story.append(Paragraph("1. Executive Strategic Summary & Innovation Rationale", h1_style))
    exec_text = data.get("executive_convergence_proposal", "")
    story.append(Paragraph(exec_text, body_style))
    story.append(Spacer(1, 10))

    # 4. Integrated Schemes Matrix
    story.append(Paragraph(f"2. Integrated Flagship Schemes Portfolio ({data.get('total_schemes_count', 0)} Schemes)", h1_style))
    
    schemes_table_data = [
        [
            Paragraph("Scheme Code", table_header),
            Paragraph("Scheme Name & Level", table_header),
            Paragraph("Nodal Ministry / Department", table_header),
            Paragraph("Key Benefit / Direct Cash", table_header)
        ]
    ]

    for s in data.get("schemes", []):
        benefits_desc = ", ".join([f"{b['type']} (Rs. {b['amount']:,.0f})" if b['amount'] > 0 else b['type'] for b in s.get('benefits', [])])
        schemes_table_data.append([
            Paragraph(f"<b>{s.get('code')}</b>", table_cell_bold),
            Paragraph(f"<b>{s.get('name')}</b><br/><font color='#64748B'>Level: {s.get('level')} | Sector: {s.get('sector')}</font>", table_cell),
            Paragraph(s.get('department'), table_cell),
            Paragraph(benefits_desc, table_cell)
        ])

    scheme_table = Table(schemes_table_data, colWidths=[75, 175, 140, 130])
    scheme_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(scheme_table)
    story.append(Spacer(1, 12))

    # 5. Complementary Benefit Pillars Table
    story.append(Paragraph("3. 4-Pillar Functional Benefit Convergence", h1_style))
    pillar_data = [
        [
            Paragraph("Functional Pillar", table_header),
            Paragraph("Participating Schemes", table_header),
            Paragraph("Strategic Contribution to Objective", table_header),
            Paragraph("Pillar Financial Value", table_header)
        ]
    ]

    for p in data.get("complementary_benefits", []):
        schemes_str = ", ".join([x["scheme_code"] for x in p.get("schemes", [])])
        val_str = f"Rs. {p.get('combined_value_inr', 0):,.0f}"
        pillar_data.append([
            Paragraph(f"<b>{p.get('pillar_id', '').upper()}</b><br/>{p.get('schemes', [{}])[0].get('scheme_code', '')}", table_cell_bold),
            Paragraph(f"<b>{schemes_str}</b>", table_cell),
            Paragraph(p.get("description", ""), table_cell),
            Paragraph(f"<b>{val_str}</b>", table_cell_bold)
        ])

    pillar_table = Table(pillar_data, colWidths=[90, 110, 220, 100])
    pillar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F766E')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F0FDFA')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(pillar_table)
    story.append(Spacer(1, 12))

    # 6. Common Intersecting Eligibility
    story.append(Paragraph("4. Common Intersecting Eligibility & Document Checklist", h1_style))
    ce = data.get("common_eligibility", {})
    docs_str = ", ".join(ce.get("common_documents", []))
    occ_str = ", ".join(ce.get("primary_occupations", []))
    
    eligibility_info = [
        [Paragraph("<b>Age Bounds:</b>", table_cell_bold), Paragraph(ce.get("age_bracket", "18 to 70 years"), table_cell)],
        [Paragraph("<b>Income Ceiling:</b>", table_cell_bold), Paragraph(f"Up to Rs. {ce.get('recommended_income_ceiling_inr', 250000):,.0f} per annum", table_cell)],
        [Paragraph("<b>Max Landholding:</b>", table_cell_bold), Paragraph(f"Up to {ce.get('max_landholding_acres', 5.0)} Acres (Marginal / Small Farmer)", table_cell)],
        [Paragraph("<b>Target Occupations:</b>", table_cell_bold), Paragraph(occ_str, table_cell)],
        [Paragraph("<b>Universal Single-Window Documents:</b>", table_cell_bold), Paragraph(docs_str, table_cell)]
    ]
    el_table = Table(eligibility_info, colWidths=[150, 370])
    el_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(el_table)
    story.append(Spacer(1, 10))

    # 7. Duplication Warnings & Conflict Mitigation
    story.append(Paragraph("5. Duplication Warnings & Conflict Mitigation Safeguards", h1_style))
    conflicts = data.get("duplications_and_conflicts", [])
    if conflicts:
        conf_data = [
            [
                Paragraph("Type", table_header),
                Paragraph("Schemes Involved", table_header),
                Paragraph("Potential Friction / Rule Conflict", table_header),
                Paragraph("District Nodal Safeguard Action", table_header)
            ]
        ]
        for c in conflicts:
            conf_data.append([
                Paragraph(f"<b><font color='#B45309'>{c.get('severity')}</font></b>", table_cell_bold),
                Paragraph(", ".join(c.get("schemes_involved", [])), table_cell),
                Paragraph(c.get("details", ""), table_cell),
                Paragraph(f"<b>{c.get('safeguard_action', '')}</b>", table_cell)
            ])
        conf_table = Table(conf_data, colWidths=[70, 90, 200, 160])
        conf_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#B45309')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#FFFBEB')]),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(conf_table)
    else:
        story.append(Paragraph("No major policy conflicts detected. All schemes are legally compatible for stackable implementation.", body_style))
    story.append(Spacer(1, 12))

    # 8. Step-by-Step District SOP & Block Roadmap
    story.append(Paragraph("6. Joint Implementation Standard Operating Procedure (SOP)", h1_style))
    sop_list = data.get("joint_implementation_sop", [])
    for step in sop_list:
        story.append(Paragraph(f"<b>{step.get('phase')}</b> | <i>Timeline: {step.get('timeline')}</i>", h2_style))
        story.append(Paragraph(f"<b>Lead Agency:</b> {step.get('nodal_agency')} | <b>Depts:</b> {', '.join(step.get('participating_departments', []))}", body_bold))
        for act in step.get("actions", []):
            story.append(Paragraph(f"• {act}", body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 14))

    # 9. Sign-off and Authorization Block
    sign_block = [
        [
            Paragraph("<b>Prepared by:</b><br/>Lead Data Analyst / Convergence Specialist<br/>SchemeConnect AI Platform", table_cell),
            Paragraph("<b>Reviewed by:</b><br/>Deputy Director of Agriculture<br/>District Sehore (M.P.)", table_cell),
            Paragraph("<b>Approved by:</b><br/>District Collector & District Magistrate<br/>District Sehore, Madhya Pradesh", table_cell)
        ],
        [
            Spacer(1, 24), Spacer(1, 24), Spacer(1, 24)
        ],
        [
            Paragraph("____________________________<br/>Seal & Signature", table_cell_bold),
            Paragraph("____________________________<br/>Seal & Signature", table_cell_bold),
            Paragraph("____________________________<br/>Seal & Signature", table_cell_bold)
        ]
    ]
    sign_table = Table(sign_block, colWidths=[170, 175, 175])
    sign_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC'))
    ]))
    story.append(KeepTogether(sign_table))

    doc.build(story)
    buffer.seek(0)
    return buffer
