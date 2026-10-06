from datetime import datetime
from io import BytesIO
import os
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

from prediction_service import predict_loan


app = FastAPI(title="Loan Approval Prediction API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoanApplication(BaseModel):
    Gender: str
    Married: str
    Dependents: str
    Education: str
    Self_Employed: str
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: float
    Property_Area: str


class PredictionContribution(BaseModel):
    feature: str
    shap_value: float


class PredictionReportResult(BaseModel):
    prediction: int
    decision: str
    probability: float = Field(ge=0, le=1)
    threshold: float = Field(ge=0, le=1)
    explanation: list[PredictionContribution]


class PredictionReportRequest(BaseModel):
    application: LoanApplication
    prediction: PredictionReportResult


NAVY = colors.HexColor("#142B4A")
BLUE = colors.HexColor("#2864D7")
INDIGO = colors.HexColor("#5146C8")
SLATE = colors.HexColor("#53647A")
LIGHT = colors.HexColor("#F3F6FA")
LINE = colors.HexColor("#DCE4EE")
GREEN = colors.HexColor("#14816B")
RED = colors.HexColor("#C2484F")
WHITE = colors.white

APPLICATION_FIELDS = [
    ("Gender", "Gender"),
    ("Married", "Marital status"),
    ("Dependents", "Dependents"),
    ("Education", "Education"),
    ("Self_Employed", "Self-employed"),
    ("ApplicantIncome", "Applicant income"),
    ("CoapplicantIncome", "Co-applicant income"),
    ("LoanAmount", "Loan amount"),
    ("Loan_Amount_Term", "Loan term (months)"),
    ("Credit_History", "Credit history"),
    ("Property_Area", "Property area"),
]


def _format_application_value(value):
    if isinstance(value, (int, float)):
        numeric_value = float(value)
        return str(int(numeric_value)) if numeric_value.is_integer() else repr(numeric_value)
    return str(value)


def _humanize_feature(name):
    labels = {
        "ApplicantIncome": "Applicant income",
        "CoapplicantIncome": "Co-applicant income",
        "LoanAmount": "Loan amount",
        "Loan_Amount_Term": "Loan term",
        "Credit_History": "Credit history",
        "Property_Area": "Property area",
        "Self_Employed": "Self-employed",
    }
    if name in labels:
        return labels[name]
    return re.sub(r"([a-z])([A-Z])", r"\1 \2", name.replace("_", " ")).title()


def _draw_section_heading(pdf, label, x, y, width):
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 9.5)
    pdf.drawString(x, y, label.upper())
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.line(x, y - 5, x + width, y - 5)


def _draw_application_snapshot(pdf, application, x, top, width):
    row_height = 19
    column_width = width / 2
    columns = [APPLICATION_FIELDS[:6], APPLICATION_FIELDS[6:]]
    bottom = top - row_height * 6

    pdf.setFillColor(WHITE)
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.7)
    pdf.roundRect(x, bottom, width, row_height * 6, 8, fill=1, stroke=1)
    pdf.line(x + column_width, bottom, x + column_width, top)

    for column_index, fields in enumerate(columns):
        column_x = x + column_index * column_width
        for row_index, (field, label) in enumerate(fields):
            row_top = top - row_index * row_height
            baseline = row_top - 12.5
            if row_index:
                pdf.setStrokeColor(LINE)
                pdf.setLineWidth(0.35)
                pdf.line(column_x + 8, row_top, column_x + column_width - 8, row_top)
            pdf.setFillColor(SLATE)
            pdf.setFont("Helvetica", 7.5)
            pdf.drawString(column_x + 9, baseline, label)
            pdf.setFillColor(NAVY)
            pdf.setFont("Helvetica-Bold", 8)
            pdf.drawRightString(
                column_x + column_width - 9,
                baseline,
                _format_application_value(application[field]),
            )


def _draw_factor_group(pdf, title, factors, x, top, width, accent, row_height=16):
    pdf.setFillColor(accent)
    pdf.setFont("Helvetica-Bold", 8.2)
    pdf.drawString(x, top, title)
    pdf.setStrokeColor(accent)
    pdf.setLineWidth(1.5)
    pdf.line(x, top - 5, x + width, top - 5)

    row_top = top - 15
    if not factors:
        pdf.setFillColor(SLATE)
        pdf.setFont("Helvetica", 7.4)
        pdf.drawString(x, row_top - 5, "No contributions returned in this direction.")
        return row_top - row_height

    maximum = max(abs(item.shap_value) for item in factors)
    bar_width = width
    for index, item in enumerate(factors):
        current_top = row_top - index * row_height
        text_y = current_top - 6
        pdf.setFillColor(NAVY)
        pdf.setFont("Helvetica", 7.4)
        pdf.drawString(x, text_y, _humanize_feature(item.feature))
        pdf.setFillColor(accent)
        pdf.setFont("Helvetica-Bold", 7.2)
        pdf.drawRightString(x + width, text_y, f"{item.shap_value:+.4f}")

        bar_y = current_top - 13
        pdf.setFillColor(LIGHT)
        pdf.roundRect(x, bar_y, bar_width, 2.7, 1.3, fill=1, stroke=0)
        if maximum > 0 and item.shap_value:
            pdf.setFillColor(accent)
            fill_width = max(2, bar_width * abs(item.shap_value) / maximum)
            pdf.roundRect(x, bar_y, fill_width, 2.7, 1.3, fill=1, stroke=0)

    return row_top - len(factors) * row_height


def _draw_disclaimer(pdf, x, top, width):
    message = (
        "<b>AI-assisted estimate only.</b> This report reflects the submitted application and the "
        "model response provided to LoanAI. It is not a loan offer, lender decision, or guarantee "
        "of approval. A lending institution makes its own decision. SHAP values explain this "
        "model output and do not establish causation."
    )
    style = ParagraphStyle(
        "ReportDisclaimer",
        fontName="Helvetica",
        fontSize=7.7,
        leading=10.2,
        textColor=SLATE,
    )
    paragraph = Paragraph(message, style)
    _, paragraph_height = paragraph.wrap(width - 20, 100)
    box_height = paragraph_height + 18
    bottom = top - box_height

    pdf.setFillColor(LIGHT)
    pdf.setStrokeColor(LINE)
    pdf.roundRect(x, bottom, width, box_height, 7, fill=1, stroke=1)
    pdf.setFillColor(BLUE)
    pdf.roundRect(x, bottom, 3, box_height, 1.5, fill=1, stroke=0)
    paragraph.drawOn(pdf, x + 12, bottom + 9)
    return bottom


def _build_prediction_report_pdf(report: PredictionReportRequest) -> bytes:
    """Render only the submitted application and prediction; never call the model here."""
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4, pageCompression=1)
    pdf.setTitle("LoanAI Prediction Report")
    pdf.setAuthor("LoanAI")
    pdf.setSubject("AI-assisted loan eligibility assessment and SHAP explanation")

    page_width, page_height = A4
    margin = 34
    content_width = page_width - 2 * margin
    application = report.application.model_dump()
    result = report.prediction
    decision_color = GREEN if result.decision == "Approved" else RED
    generated_at = datetime.now().astimezone().strftime("%d %b %Y  |  %I:%M %p %Z")

    # Branded header.
    header_bottom = page_height - 82
    pdf.setFillColor(NAVY)
    pdf.roundRect(margin, header_bottom, content_width, 64, 10, fill=1, stroke=0)
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(margin + 16, page_height - 45, "LoanAI")
    pdf.setFont("Helvetica", 9)
    pdf.setFillColor(colors.HexColor("#D7E4FA"))
    pdf.drawString(margin + 17, page_height - 64, "AI Loan Eligibility Assessment")
    pdf.setFont("Helvetica-Bold", 7.7)
    pdf.drawRightString(page_width - margin - 15, page_height - 43, "GENERATED REPORT")
    pdf.setFont("Helvetica", 7.8)
    pdf.drawRightString(page_width - margin - 15, page_height - 60, generated_at)

    # Decision summary with aligned columns.
    _draw_section_heading(pdf, "Eligibility assessment", margin, page_height - 105, content_width)
    card_top = page_height - 118
    card_height = 58
    card_bottom = card_top - card_height
    pdf.setFillColor(LIGHT)
    pdf.setStrokeColor(LINE)
    pdf.roundRect(margin, card_bottom, content_width, card_height, 8, fill=1, stroke=1)
    pdf.setFillColor(decision_color)
    pdf.roundRect(margin, card_bottom, 4, card_height, 2, fill=1, stroke=0)

    metrics = [
        ("MODEL DECISION", result.decision, decision_color, 12),
        ("APPROVAL PROBABILITY", f"{result.probability:.1%}", BLUE, 15),
        ("DECISION THRESHOLD", f"{result.threshold:.1%}", INDIGO, 14),
    ]
    column_width = content_width / 3
    for index, (label, value, color, value_size) in enumerate(metrics):
        column_x = margin + index * column_width
        if index:
            pdf.setStrokeColor(LINE)
            pdf.setLineWidth(0.7)
            pdf.line(column_x, card_bottom + 10, column_x, card_top - 10)
        pdf.setFillColor(SLATE)
        pdf.setFont("Helvetica-Bold", 7.2)
        pdf.drawString(column_x + 13, card_top - 20, label)
        pdf.setFillColor(color)
        pdf.setFont("Helvetica-Bold", value_size)
        pdf.drawString(column_x + 13, card_bottom + 17, value)

    # Gauge uses the exact response probability and threshold.
    gauge_label_y = card_bottom - 16
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(margin, gauge_label_y, "Approval probability")
    pdf.setFillColor(BLUE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawRightString(page_width - margin, gauge_label_y, f"{result.probability:.1%}")

    gauge_x = margin + 2
    gauge_width = content_width - 4
    gauge_y = gauge_label_y - 17
    pdf.setFillColor(LIGHT)
    pdf.roundRect(gauge_x, gauge_y, gauge_width, 8, 4, fill=1, stroke=0)
    pdf.setFillColor(decision_color)
    if result.probability > 0:
        pdf.roundRect(gauge_x, gauge_y, gauge_width * result.probability, 8, 4, fill=1, stroke=0)
    threshold_x = gauge_x + gauge_width * result.threshold
    pdf.setStrokeColor(NAVY)
    pdf.setLineWidth(1.4)
    pdf.line(threshold_x, gauge_y - 3, threshold_x, gauge_y + 11)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 7.1)
    pdf.drawString(gauge_x, gauge_y - 11, "0%")
    pdf.drawCentredString(threshold_x, gauge_y - 11, f"Threshold {result.threshold:.1%}")
    pdf.drawRightString(gauge_x + gauge_width, gauge_y - 11, "100%")

    # Two-column application snapshot; numeric fields are not rounded or grouped.
    application_heading_y = gauge_y - 35
    _draw_section_heading(pdf, "Application snapshot", margin, application_heading_y, content_width)
    application_top = application_heading_y - 14
    _draw_application_snapshot(pdf, application, margin, application_top, content_width)

    # Positive and negative contribution summaries retain the supplied SHAP values.
    explanation = result.explanation
    positive = sorted(
        (item for item in explanation if item.shap_value > 0),
        key=lambda item: abs(item.shap_value),
        reverse=True,
    )
    negative = sorted(
        (item for item in explanation if item.shap_value < 0),
        key=lambda item: abs(item.shap_value),
        reverse=True,
    )
    factors_heading_y = application_top - 6 * 19 - 22
    _draw_section_heading(pdf, "Explainability", margin, factors_heading_y, content_width)
    factors_header_y = factors_heading_y - 17
    group_gap = 14
    group_width = (content_width - group_gap) / 2
    positive_bottom = _draw_factor_group(
        pdf,
        "Factors toward approval",
        positive,
        margin,
        factors_header_y,
        group_width,
        GREEN,
    )
    negative_bottom = _draw_factor_group(
        pdf,
        "Factors away from approval",
        negative,
        margin + group_width + group_gap,
        factors_header_y,
        group_width,
        RED,
    )

    disclaimer_heading_y = min(positive_bottom, negative_bottom) - 9
    _draw_section_heading(pdf, "Important information", margin, disclaimer_heading_y, content_width)
    disclaimer_top = disclaimer_heading_y - 13
    disclaimer_bottom = _draw_disclaimer(pdf, margin, disclaimer_top, content_width)
    footer_line_y = 35
    if disclaimer_bottom < footer_line_y + 28:
        raise ValueError("Prediction report content does not fit the one-page A4 layout.")

    # Professional footer and explicit one-page numbering.
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.line(margin, footer_line_y, page_width - margin, footer_line_y)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 7.3)
    pdf.drawString(margin, 21, "LoanAI  |  AI-assisted estimate, not a lender decision")
    pdf.drawRightString(page_width - margin, 21, "Page 1 of 1")

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "loan-approval-api",
    }


@app.post("/predict")
def predict(application: LoanApplication):
    applicant_data = application.model_dump()
    result = predict_loan(applicant_data)
    return result


@app.post("/report/pdf")
def download_prediction_report(report: PredictionReportRequest):
    pdf_bytes = _build_prediction_report_pdf(report)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="LoanAI_Prediction_Report.pdf"',
            "Cache-Control": "no-store",
        },
    )
