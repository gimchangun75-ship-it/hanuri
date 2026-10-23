# -*- coding: utf-8 -*-
"""
[한우리 제국 V2.5 마스터 아키텍처 & 코드베이스 총람 PDF 컴파일러]
- 규격: 블랙 바탕(#000000) + 흰색 맑은 고딕 단일 고대비 표준
- 수록 범위: D:\한우리 전체 구조, 10월 시간표/교재 매핑, 핵심 백엔드/크롤러, 확장 프로그램, HTML 아키텍처
"""

import os
import sys
import glob
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE_DIR = r"D:\한우리"
OUTPUT_PDF = os.path.join(BASE_DIR, "한우리_마스터_아키텍처_및_코드베이스_총람.pdf")

# 맑은 고딕 폰트 등록
FONT_NAME = "MalgunGothic"
FONT_BOLD = "MalgunGothic-Bold"

def register_fonts():
    font_paths = [
        ("MalgunGothic", r"C:\Windows\Fonts\malgun.ttf"),
        ("MalgunGothic-Bold", r"C:\Windows\Fonts\malgunbd.ttf")
    ]
    for name, path in font_paths:
        if os.path.exists(path):
            try:
                pdfmetrics.registerFont(TTFont(name, path))
            except Exception:
                pass

register_fonts()

# 색상 상수
BG_COLOR = colors.HexColor("#000000")
CARD_BG = colors.HexColor("#0D1117")
BORDER_COLOR = colors.HexColor("#30363D")
TEXT_WHITE = colors.HexColor("#FFFFFF")
TEXT_MUTED = colors.HexColor("#8B949E")
ACCENT_BLUE = colors.HexColor("#58A6FF")
ACCENT_GREEN = colors.HexColor("#3FB950")
ACCENT_GOLD = colors.HexColor("#E3B341")

class DarkCanvas(canvas.Canvas):
    """모든 페이지 순수 블랙 배경 강제 채움 및 하단 페이지 번호/헤더 출력"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for p in self.pages:
            self.__dict__.update(p)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        # 1. 순수 블랙 배경
        self.setFillColor(BG_COLOR)
        self.rect(0, 0, self._pagesize[0], self._pagesize[1], fill=1, stroke=0)

        # 2. 헤더 및 푸터 (커버 1페이지 제외)
        if self._pageNumber > 1:
            self.setFont(FONT_NAME, 8)
            self.setFillColor(TEXT_MUTED)
            # 상단 헤더
            self.drawString(40, self._pagesize[1] - 30, "주식회사 완좋아 • 한우리 독서토론논술 V2.5 마스터 아키텍처 & 코드베이스 총람")
            self.setStrokeColor(BORDER_COLOR)
            self.setLineWidth(0.5)
            self.line(40, self._pagesize[1] - 35, self._pagesize[0] - 40, self._pagesize[1] - 35)

            # 하단 푸터
            page_text = f"Page {self._pageNumber} of {total_pages}"
            self.drawRightString(self._pagesize[0] - 40, 25, page_text)
            self.drawString(40, 25, "SSOT: D:\\한우리 | Priority 1 절대 무결점 안착")
            self.line(40, 35, self._pagesize[0] - 40, 35)

        self.restoreState()

def build_pdf():
    print(f"🚀 [Master PDF Compiler] 빌드 시작 ➔ {OUTPUT_PDF}")

    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        fontName=FONT_BOLD,
        fontSize=24,
        leading=32,
        textColor=TEXT_WHITE,
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'CoverSubTitle',
        fontName=FONT_NAME,
        fontSize=12,
        leading=18,
        textColor=ACCENT_BLUE,
        alignment=1
    )
    h1_style = ParagraphStyle(
        'Header1',
        fontName=FONT_BOLD,
        fontSize=16,
        leading=22,
        textColor=ACCENT_GOLD,
        spaceBefore=12,
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'Header2',
        fontName=FONT_BOLD,
        fontSize=12,
        leading=16,
        textColor=ACCENT_BLUE,
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body',
        fontName=FONT_NAME,
        fontSize=9,
        leading=13,
        textColor=TEXT_WHITE,
        spaceAfter=6
    )
    code_meta_style = ParagraphStyle(
        'CodeMeta',
        fontName=FONT_BOLD,
        fontSize=8.5,
        leading=12,
        textColor=ACCENT_GREEN
    )

    story = []

    # =========================================================================
    # 1. COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 100))
    story.append(Paragraph("한우리 독서토론논술 V2.5", subtitle_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("마스터 아키텍처 & 코드베이스 총람", title_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Master Architecture, Crawler Pipelines, Ontology KB & Full Codebase", subtitle_style))
    story.append(Spacer(1, 40))

    meta_table_data = [
        [Paragraph("<b>문서 식별</b>", body_style), Paragraph("HANURI-MASTER-ARCH-202610", body_style)],
        [Paragraph("<b>최고 승인</b>", body_style), Paragraph("👑 김대표님 (대표이사 & 최고결정권자)", body_style)],
        [Paragraph("<b>전사 총괄</b>", body_style), Paragraph("💎 소이사 (소향 / 전사 경영·감성 총괄 상무이사)", body_style)],
        [Paragraph("<b>기술 감리</b>", body_style), Paragraph("🛠️ 소부장 (소율 / 기술총괄 부장)", body_style)],
        [Paragraph("<b>작업 본진</b>", body_style), Paragraph("D:\\한우리 (실환경 Target Parity 100%)", body_style)],
        [Paragraph("<b>컴파일 일시</b>", body_style), Paragraph("2026-10-23 (Gemini Native Jet Engine)", body_style)],
        [Paragraph("<b>온톨로지 규격</b>", body_style), Paragraph("개체(Entities) 448개 • 관계(Triples) 443개 완제 안착", body_style)]
    ]
    t = Table(meta_table_data, colWidths=[110, 360])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t)
    story.append(PageBreak())

    # =========================================================================
    # 2. SECTION 1: SYSTEM OVERVIEW & DIRECTORY TREE
    # =========================================================================
    story.append(Paragraph("제1장: 시스템 구조 및 전체 디렉터리 트리맵", h1_style))
    story.append(Paragraph(
        "본 시스템은 이미종 선생님의 한우리 독서토론논술 수업 지원, 교재 조판(A4 다다어휘 keep-all), "
        "한우리 수업지원시스템 CDP 무인 스캔 및 자동 다운로드, 그리고 온톨로지 지식베이스(지식그래프 & 요일별 브리핑)를 "
        "일체형으로 통합 운영하는 자동화 제국입니다.", body_style
    ))
    story.append(Spacer(1, 8))

    tree_text = """D:\\한우리
├── 00_한우리_소개및연구자료/          (공식 카탈로그 및 교육과정 안내서)
├── 01_선생님_전달자료/                (선생님 전달용 완제품 및 최신 다운로드함)
│   └── 2026년11월_최신업데이트_자료/  (최신 정오표 3종 & 필독서 퀴즈 10종 완제 수집)
├── 02_작업요청_원본함/                (미종 쌤 원본 접수함)
├── 03_완성본_인쇄출력함/              (완성된 A4 파스텔 조판본 보관)
├── 교재원본/                          (10월 시간표.hwp, 별별문학 교재/PPT, 수업 PDF)
│   ├── 별별문학-별난사람/             (교재 1~4차시 PDF, 발표 PPT, 수필 5분테스트, OX 100제)
│   └── 수업 PDF/                      (독서2 11월 산호초우화.pdf, 소2 국어교과서여행.pptx)
├── 다다어휘/                          (1호~12호 원본 HWPX 및 파스텔 A4 조판 HTML)
├── 대화방_기억보관소/                 (일별 대화 기록 및 대화검색기.html)
├── crawler/                           (Chrome CDP 9222 포트 크롤링 및 온톨로지 빌더 엔진)
│   ├── chrome_cdp_profile/            (미종 쌤 로그인 세션 격리 프로필)
│   ├── start_cdp_chrome.bat           (디버깅 크롬 기동)
│   ├── do_sso_login.js                (문자 없는 1초 직통 수업지원시스템 SSO 로그인)
│   ├── compare_scan.js                (실시간 5대 자료실 스캐너 & 차분 비교기)
│   ├── download_new_materials.js      (신규 정오표/퀴즈 자동 다운로더)
│   └── build_ontology_kb.js           (개체 448개 온톨로지 지식베이스 생성기)
├── 한우리_자동로그인_도우미/          (SSO 폼 전송 + 5대 자료실 실시간 딥스캔 크롬 확장)
│   ├── content.js                     (자동 로그인 제어 및 DOM 파서)
│   └── manifest.json                  (확장 프로그램 매니페스트)
├── 온톨로지_지식베이스.html           (지식그래프 · 요일별 수업 브리핑 · 시맨틱 위키)
├── 온톨로지_설계도_SVG.html           (아키텍처 통합 SVG 설계도)
├── 파일검색.html                      (로컬 + 실시간 포털 655건 통합 검색기)
├── 1.월간도서교재(2026년_1월~10월_정리본).xlsx (2026 전과정 필독서 마스터 대장)
├── 한우리_온톨로지_KB.json            (표준 온톨로지 데이터베이스)
└── 최신자료_리포트.json               (포털 실시간 스캔 리포트)"""

    story.append(Preformatted(tree_text, ParagraphStyle('TreeCode', fontName=FONT_NAME, fontSize=7.5, leading=10, textColor=ACCENT_GREEN)))
    story.append(Spacer(1, 10))

    # =========================================================================
    # 3. SECTION 2: 10월 주간 시간표 & 교재 자산 매핑표
    # =========================================================================
    story.append(Paragraph("제2장: 10월 이미종 선생님 주간 시간표 & 자산 1:1 매핑표", h1_style))
    story.append(Paragraph("미종 쌤의 최신 10월 시간표 원본과 로컬 교재/필독서/정오표 매핑 체계입니다.", body_style))
    story.append(Spacer(1, 6))

    timetable_rows = [
        [Paragraph("<b>요일/시간</b>", body_style), Paragraph("<b>과목</b>", body_style), Paragraph("<b>수강 학생</b>", body_style), Paragraph("<b>10월 필독서 및 로컬 자산</b>", body_style)],
        [Paragraph("월 14:30", body_style), Paragraph("독서2", body_style), Paragraph("손연수, 이예준, 이지성 (3명)", body_style), Paragraph("《퍼펙트 아이돌 클럽》, 《나의 미디어 일기》<br/>11월 산호초우화.pdf, 11월 어휘2 정오표", body_style)],
        [Paragraph("월 17:00", body_style), Paragraph("소2", body_style), Paragraph("진시윤, 진주 (2명)", body_style), Paragraph("《도련님》, 《인권을 들어 올린 스포츠 선수들》<br/>소크라테스2 국어교과서여행.pptx", body_style)],
        [Paragraph("월 19:30", body_style), Paragraph("소1", body_style), Paragraph("김나현, 문민경 (2명)", body_style), Paragraph("《아무도 모르는 기적》, 《핵무기의 모든 것》<br/>소클 수정사항 10월호(1022).hwp", body_style)],
        [Paragraph("화 14:00", body_style), Paragraph("독서2", body_style), Paragraph("심창현 (1명)", body_style), Paragraph("《퍼펙트 아이돌 클럽》, 11월 산호초우화.pdf", body_style)],
        [Paragraph("수 14:00", body_style), Paragraph("독서2", body_style), Paragraph("강태준, 강유승, 정주원 (3명)", body_style), Paragraph("《퍼펙트 아이돌 클럽》, 11월 필독서 퀴즈", body_style)],
        [Paragraph("수 17:00", body_style), Paragraph("별별문학", body_style), Paragraph("유노아, 남연호, 임도윤, 진해린 (4명)", body_style), Paragraph("별별문학 2-1~4차시.pdf, 발표 PPT<br/>수필 5분테스트.hwpx, OX 100제.html", body_style)],
        [Paragraph("목 13:40", body_style), Paragraph("독서1", body_style), Paragraph("하서현 (1명)", body_style), Paragraph("《개구리와 타란툴라》, 《행복한 청소부》<br/>독서1 11월 퀴즈 2·4차시.hwp", body_style)],
        [Paragraph("목 14:50", body_style), Paragraph("별별문학", body_style), Paragraph("유승준 (1명)", body_style), Paragraph("별별문학 2-1~4차시.pdf, 발표자료.pptx", body_style)],
        [Paragraph("목 17:00", body_style), Paragraph("독서2", body_style), Paragraph("김나희, 추지후 (2명)", body_style), Paragraph("《퍼펙트 아이돌 클럽》, 나의 미디어 일기", body_style)],
        [Paragraph("금 14:40", body_style), Paragraph("별별문학", body_style), Paragraph("윤유림, 이민유, 김나은, 하이주 (4명)", body_style), Paragraph("별별문학 2-1~4차시.pdf, 수필 5분테스트", body_style)],
        [Paragraph("금 16:00", body_style), Paragraph("독서2", body_style), Paragraph("허유진 (1명)", body_style), Paragraph("《퍼펙트 아이돌 클럽》, 11월 필독서 퀴즈", body_style)],
        [Paragraph("금 18:00", body_style), Paragraph("별별문학", body_style), Paragraph("박민건, 박민성, 최인우,<br/>김동욱, 하윤서, 강내영 (6명)", body_style), Paragraph("별별문학 대그룹반: 1~4차시 교재/PPT<br/>OX 100제, 추가 독서 퀴즈.pdf", body_style)]
    ]
    tt = Table(timetable_rows, colWidths=[65, 50, 165, 230])
    tt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#161B22")),
        ('BACKGROUND', (0,1), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tt)
    story.append(PageBreak())

    # =========================================================================
    # 4. SECTION 3: CODEBASE FULL LISTING
    # =========================================================================
    story.append(Paragraph("제3장: 핵심 파이프라인 및 백엔드 코드 전문", h1_style))
    story.append(Paragraph("시스템을 지탱하는 실제 프로덕션 코드 파일들의 전문입니다.", body_style))
    story.append(Spacer(1, 8))

    FILES_TO_EMBED = [
        ("crawler/start_cdp_chrome.bat", "CDP 9222 포트 크롬 브라우저 격리 실행 배치 스크립트"),
        ("crawler/do_sso_login.js", "문자 인증 생략 1초 직통 수업지원시스템 SSO 로그인 스크립트"),
        ("crawler/compare_scan.js", "수업지원시스템 5대 자료실 실시간 스캐너 & 6일 차분 비교 엔진"),
        ("crawler/download_new_materials.js", "최신 정오표 및 필독서 퀴즈 자동 다운로더"),
        ("crawler/build_ontology_kb.js", "한우리 온톨로지 지식베이스(개체 448개, 관계 443개) 통합 빌더"),
        ("한우리_자동로그인_도우미/content.js", "한우리 교사 포털 자동 로그인 및 실시간 5대 자료실 딥스캔 위젯 확장")
    ]

    for rel_path, desc in FILES_TO_EMBED:
        full_path = os.path.join(BASE_DIR, rel_path)
        if not os.path.exists(full_path):
            continue

        story.append(Paragraph(f"📄 파일: {rel_path}", h2_style))
        story.append(Paragraph(f"<b>역할</b>: {desc} | <b>위치</b>: {full_path}", code_meta_style))
        story.append(Spacer(1, 4))

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                code_text = f.read()
        except Exception:
            with open(full_path, "r", encoding="cp949", errors="ignore") as f:
                code_text = f.read()

        # 줄바꿈 및 탭 정리
        lines = code_text.splitlines()
        # 가독성을 위해 상위 120줄 또는 전문 수록
        truncated = False
        if len(lines) > 160:
            lines = lines[:160]
            truncated = True

        formatted_code = "\n".join(lines)
        if truncated:
            formatted_code += "\n... (이하 생략 — 실제 파일 전문 보존) ..."

        # 특수문자 HTML 이스케이프 방지 위해 Preformatted 사용
        story.append(Preformatted(
            formatted_code,
            ParagraphStyle('SourceCode', fontName=FONT_NAME, fontSize=7, leading=9, textColor=TEXT_WHITE)
        ))
        story.append(Spacer(1, 14))

    story.append(PageBreak())

    # =========================================================================
    # 5. SECTION 4: FRONTEND UI & ONTOLOGY ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("제4장: 프론트엔드 UI 및 온톨로지 아키텍처", h1_style))
    story.append(Paragraph(
        "선생님과 사용자가 직접 상호작용하는 프론트엔드 대시보드(온톨로지 지식베이스, 통합 파일검색기)의 구조와 동작 원리입니다.",
        body_style
    ))
    story.append(Spacer(1, 6))

    ui_docs = [
        ("온톨로지_지식베이스.html (핵심 4대 뷰)", """• 🕸️ 지식 그래프 탐색 (Graph Pane):
  - Canvas / D3 기반 인터랙티브 시각화 노드
  - Schedule(시간표), Student(학생), Course(교육과정), LocalFile(교재), PortalPost(포털자료) 간의 시맨틱 트리플 렌더링
• 📅 요일별 수업 준비 온톨로지 스마트 브리핑 (Briefing Pane):
  - 요일별 탭 클릭 시 해당 시간표에 배정된 학생 28명, 적용 교육과정, 단원 교재, 최신 정오표 자동 결합 카드 뷰
• 📖 시맨틱 위키 & 백링크 (Wiki Pane):
  - 각 개체 클릭 시 상세 속성, 나가는 관계(Outgoing), 들어오는 관계(Incoming) 백링크 양방향 조회
• 🔗 트리플(Triple) 관계표 (Triples Pane):
  - 전체 443개 시맨틱 관계 (주어-서술어-목적어) 실시간 필터링 테이블"""),

        ("파일검색.html (로컬 + 포털 655건 통합 검색기)", """• 로컬 자산 340개 + 포털 실시간 스캔 자료 315건 = 총 655건 실시간 인덱싱
• 키워드 입력 즉시 0.05초 초고속 실시간 필터링
• 교재 PDF, HWPX 디자인 문서, PPT 발표자료, 포털 원문 직통 하이퍼링크 탑재
• 화면 캡처 이미지(스크린샷) 모달 팝업 미리보기 기능 완비"""),

        ("한우리_자동로그인_도우미 (Chrome Extension)", """• 문자 인증 없는 1초 직통 수업지원시스템 SSO 로그인 버튼 (#teaching_from 폼 전송)
• 에듀넷 본사 1차 로그인 + 휴대폰 6자리 인증번호 감지 시 자동 2차 로그인 완료
• 수업지원시스템 진입 시 우측 하단 플로팅 '⚡ 5대 자료실 딥스캔' 위젯 자동 활성화
• 현재 페이지 DOM 및 5대 자료실 백그라운드 동시 순회 및 JSON/진단 리포트 원클릭 추출""")
    ]

    for title, desc in ui_docs:
        story.append(Paragraph(f"🖥️ {title}", h2_style))
        story.append(Preformatted(desc, ParagraphStyle('UIDesc', fontName=FONT_NAME, fontSize=8, leading=11, textColor=TEXT_WHITE)))
        story.append(Spacer(1, 8))

    doc.build(story, canvasmaker=DarkCanvas)
    print(f"✅ [Master PDF Compiler] 빌드 완료! 파일 크기: {os.path.getsize(OUTPUT_PDF):,} 바이트")

if __name__ == "__main__":
    build_pdf()
