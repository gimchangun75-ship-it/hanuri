(function () {
  if (window.__HANURI_SMART_HELPER_LOADED__) return;
  window.__HANURI_SMART_HELPER_LOADED__ = true;

  const STORAGE_ID_KEY = "hanuri_auto_userid";
  const STORAGE_PW_KEY = "hanuri_auto_userpw";
  const STORAGE_MODE_KEY = "hanuri_auto_default_mode"; // 'teaching' | 'edunet' | 'manual'

  // Common Toast Banner
  function showBanner(text, bg = "#2563eb", duration = 4000) {
    if (!document.body) return;
    let el = document.getElementById("hanuri-auto-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "hanuri-auto-toast";
      el.style.cssText =
        "position:fixed !important;top:18px !important;left:50% !important;transform:translateX(-50%) !important;z-index:2147483647 !important;padding:12px 24px !important;border-radius:999px !important;color:#fff !important;font-weight:800 !important;font-size:15px !important;box-shadow:0 10px 25px rgba(0,0,0,0.35) !important;transition:all 0.25s !important;font-family:'Pretendard','Malgun Gothic',sans-serif !important;";
      document.body.appendChild(el);
    }
    el.style.background = bg;
    el.textContent = text;
    el.style.opacity = "1";
    el.style.display = "block";
    clearTimeout(el.__timer);
    el.__timer = setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        if (el.style.opacity === "0") el.style.display = "none";
      }, 300);
    }, duration);
  }

  // ==========================================
  // SECTION 1. LOGIN PAGE AUTOMATION
  // ==========================================
  const isLoginPage = window.location.pathname.includes("/login");

  if (isLoginPage) {
    function createControlPanel() {
      if (!document.body || document.getElementById("hanuri-auto-panel")) return;
      const savedId = localStorage.getItem(STORAGE_ID_KEY) || "swan34";
      const savedPw = localStorage.getItem(STORAGE_PW_KEY) || "";
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY) || "edunet";

      const panel = document.createElement("div");
      panel.id = "hanuri-auto-panel";
      panel.style.cssText = `
        position: fixed !important;
        top: 24px !important;
        right: 24px !important;
        width: 340px !important;
        background: #0f172a !important;
        color: #f8fafc !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 16px !important;
        padding: 18px !important;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.45) !important;
        z-index: 2147483646 !important;
        font-family: 'Pretendard', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
      `;

      panel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #334155;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🤖</span>
            <strong style="font-size:15px;color:#fde047;">한우리 자동 로그인 도우미</strong>
          </div>
          <span style="font-size:11px;background:#1e3a8a;color:#93c5fd;padding:3px 8px;border-radius:999px;font-weight:700;">v1.3 ON</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="width:65px;font-size:12.5px;color:#cbd5e1;font-weight:700;">아이디</label>
            <input id="ha_id" type="text" value="${savedId}" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:13.5px;font-weight:700;" />
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="width:65px;font-size:12.5px;color:#cbd5e1;font-weight:700;">비밀번호</label>
            <input id="ha_pw" type="password" value="${savedPw}" placeholder="최초 1회 입력 후 저장" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:13.5px;" />
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="width:65px;font-size:12.5px;color:#cbd5e1;font-weight:700;">접속시 자동</label>
            <select id="ha_mode" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fde047;font-size:12.5px;font-weight:700;">
              <option value="edunet" ${savedMode === "edunet" ? "selected" : ""}>🚀 에듀넷 (1차+문자요청 자동)</option>
              <option value="teaching" ${savedMode === "teaching" ? "selected" : ""}>📚 수업지원시스템 (문자없이 1초직통)</option>
              <option value="manual" ${savedMode === "manual" ? "selected" : ""}>⏸️ 버튼 누를 때만 실행</option>
            </select>
          </div>
        </div>

        <button id="ha_save_btn" style="width:100%;padding:9px;border-radius:8px;border:none;background:#2563eb;color:#fff;font-weight:800;font-size:13px;cursor:pointer;margin-bottom:10px;">
          💾 계정 정보 저장하기
        </button>

        <div style="display:flex;flex-direction:column;gap:7px;padding-top:10px;border-top:1px solid #334155;">
          <button id="ha_btn_teaching" style="width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-weight:800;font-size:13.5px;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
            📚 수업지원시스템 1초 직통 (문자X)
          </button>
          <button id="ha_btn_edunet" style="width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,#db2777,#f43f5e);color:#fff;font-weight:800;font-size:13.5px;cursor:pointer;box-shadow:0 4px 12px rgba(244,63,94,0.3);">
            🚀 에듀넷 1차로그인 + 문자요청 실행
          </button>
        </div>

        <div id="ha_status" style="margin-top:10px;font-size:12px;color:#94a3b8;line-height:1.4;text-align:center;">
          ${savedPw ? "✅ 비밀번호 저장됨 · 숫자 6자리 입력 시 자동 2차 로그인" : "💡 비밀번호를 한 번 저장하면 다음부터 자동으로 로그인됩니다."}
        </div>
      `;

      document.body.appendChild(panel);

      document.getElementById("ha_save_btn").addEventListener("click", () => {
        const idVal = document.getElementById("ha_id").value.trim();
        const pwVal = document.getElementById("ha_pw").value.trim();
        const modeVal = document.getElementById("ha_mode").value;
        if (!idVal || !pwVal) {
          showBanner("⚠️ 아이디와 비밀번호를 모두 입력해 주세요!", "#dc2626");
          return;
        }
        localStorage.setItem(STORAGE_ID_KEY, idVal);
        localStorage.setItem(STORAGE_PW_KEY, pwVal);
        localStorage.setItem(STORAGE_MODE_KEY, modeVal);
        document.getElementById("ha_status").innerHTML =
          "✅ <strong>저장 완료!</strong> 이제 접속할 때마다 자동으로 실행됩니다.";
        showBanner("✅ 계정 저장 완료! 자동 로그인을 시작합니다.", "#059669");
        if (modeVal === "teaching") {
          runAutoLogin("teaching");
        } else {
          runAutoLogin("edunet");
        }
      });

      document.getElementById("ha_btn_teaching").addEventListener("click", () => {
        saveInputsIfPresent();
        runAutoLogin("teaching");
      });

      document.getElementById("ha_btn_edunet").addEventListener("click", () => {
        saveInputsIfPresent();
        runAutoLogin("edunet");
      });
    }

    function saveInputsIfPresent() {
      const idEl = document.getElementById("ha_id");
      const pwEl = document.getElementById("ha_pw");
      const idVal = idEl ? idEl.value.trim() : "";
      const pwVal = pwEl ? pwEl.value.trim() : "";
      if (idVal) localStorage.setItem(STORAGE_ID_KEY, idVal);
      if (pwVal) localStorage.setItem(STORAGE_PW_KEY, pwVal);
    }

    function bindSmsAutoSubmit() {
      const smsInput = document.getElementById("smsAuthCode");
      if (!smsInput) return;
      smsInput.addEventListener("input", () => {
        const code = smsInput.value.replace(/\D/g, "");
        if (code.length === 6) {
          showBanner("⚡ 인증번호 6자리 감지! 자동으로 2차 로그인을 실행합니다...", "#059669");
          const loginBtn = document.querySelector(".btn_login");
          if (loginBtn) {
            loginBtn.classList.remove("dark");
            loginBtn.disabled = false;
            loginBtn.click();
          }
        }
      });
    }

    function runAutoLogin(targetMode) {
      const idVal =
        (document.getElementById("ha_id") && document.getElementById("ha_id").value.trim()) ||
        localStorage.getItem(STORAGE_ID_KEY) ||
        "swan34";
      const pwVal =
        (document.getElementById("ha_pw") && document.getElementById("ha_pw").value.trim()) ||
        localStorage.getItem(STORAGE_PW_KEY) ||
        "";

      const userEl = document.getElementById("username");
      const passEl = document.getElementById("password");
      if (userEl) userEl.value = idVal;

      if (!pwVal) {
        showBanner("🔑 오른쪽 위 자동 로그인 창에 비밀번호를 1회 입력해 주세요!", "#d97706");
        if (document.getElementById("ha_pw")) document.getElementById("ha_pw").focus();
        return;
      }

      if (passEl) passEl.value = pwVal;

      if (targetMode === "teaching") {
        showBanner("📚 수업지원시스템 1초 직통 접속 중... (문자 인증 생략)", "#059669");
        const loginForm = document.getElementById("loginForm");
        const bodyParams = loginForm
          ? new URLSearchParams(new FormData(loginForm))
          : new URLSearchParams({ username: idVal, password: pwVal });

        fetch("/rest/login/first", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: bodyParams.toString(),
          credentials: "include"
        })
          .then((r) => r.json())
          .then((data) => {
            if (data && data.IS && data.PS) {
              const tForm = document.getElementById("teaching_from");
              if (tForm) {
                const isInput = tForm.querySelector("input[name='IS']");
                const psInput = tForm.querySelector("input[name='PS']");
                if (isInput) isInput.value = data.IS;
                if (psInput) psInput.value = data.PS;
                tForm.setAttribute("target", "_self");
                tForm.setAttribute("action", "https://teaching.hanuribook.com/users/sso");
                tForm.submit();
              } else {
                showBanner("⚠️ SSO 폼(#teaching_from)을 찾을 수 없습니다.", "#dc2626");
              }
            } else {
              showBanner("⚠️ 아이디 또는 비밀번호를 확인해 주세요.", "#dc2626");
            }
          })
          .catch((err) => {
            showBanner("⚠️ 로그인 통신 오류: " + err.message, "#dc2626");
          });
      } else {
        showBanner("🚀 1차 로그인 및 휴대폰 인증번호 자동 요청 중...", "#2563eb");
        const firstBtn = document.querySelector(".btn_first_login");
        if (firstBtn) {
          firstBtn.classList.remove("dark");
          firstBtn.click();
        }
        let tries = 0;
        const timer = setInterval(() => {
          tries++;
          const sendBtn = document.querySelector(".btn_auth_send");
          if (sendBtn && !sendBtn.classList.contains("dark")) {
            clearInterval(timer);
            sendBtn.click();
            const smsInput = document.getElementById("smsAuthCode");
            if (smsInput) {
              smsInput.focus();
              smsInput.style.border = "2px solid #2563eb";
              smsInput.style.backgroundColor = "#eff6ff";
              smsInput.placeholder = "휴대폰에 온 6자리 숫자만 치면 자동 로그인됩니다!";
            }
            showBanner("📱 휴대폰으로 인증번호 발송 완료! 6자리 숫자만 입력하면 자동 접속됩니다.", "#059669");
          } else if (tries > 25) {
            clearInterval(timer);
          }
        }, 150);
      }
    }

    createControlPanel();
    bindSmsAutoSubmit();

    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("auto");
    const savedPw = localStorage.getItem(STORAGE_PW_KEY);
    const savedMode = localStorage.getItem(STORAGE_MODE_KEY) || "edunet";

    const userEl = document.getElementById("username");
    if (userEl && !userEl.value) {
      userEl.value = localStorage.getItem(STORAGE_ID_KEY) || "swan34";
    }

    if (savedPw) {
      if (urlMode === "teaching") {
        setTimeout(() => runAutoLogin("teaching"), 200);
      } else if (urlMode === "edunet") {
        setTimeout(() => runAutoLogin("edunet"), 200);
      } else if (savedMode !== "manual") {
        setTimeout(() => runAutoLogin(savedMode), 250);
      }
    }
  }

  // ==========================================
  // SECTION 2. DEEP-SCAN (수업지원시스템 & 에듀넷 실시간 자료 탐색기)
  // ==========================================
  if (!isLoginPage) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDeepScanWidget);
    } else {
      initDeepScanWidget();
    }
    setTimeout(() => {
      if (!document.getElementById("hanuri-scan-fab")) {
        initDeepScanWidget();
      }
    }, 800);
  }

  function initDeepScanWidget() {
    if (document.getElementById("hanuri-scan-fab")) return;
    if (!document.body) {
      setTimeout(initDeepScanWidget, 200);
      return;
    }

    console.log("🚀 [한우리 스마트 도우미 v1.3] 5대 자료실 딥스캔 엔진 탑재 완료! URL:", window.location.href);
    showBanner("📡 한우리 딥스캔 v1.3 준비 완료! (우측 하단 버튼 확인)", "#2563eb", 3500);

    // Floating Quick Button on Bottom-Right
    const scanFab = document.createElement("button");
    scanFab.id = "hanuri-scan-fab";
    scanFab.innerHTML = "⚡ 5대 자료실 딥스캔";
    scanFab.style.cssText = `
      position: fixed !important;
      bottom: 90px !important;
      right: 24px !important;
      z-index: 2147483646 !important;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%) !important;
      color: #ffffff !important;
      border: 2px solid #fde047 !important;
      border-radius: 999px !important;
      padding: 14px 26px !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.65), 0 0 15px rgba(253, 224, 71, 0.45) !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: 'Pretendard', 'Malgun Gothic', sans-serif !important;
    `;
    scanFab.onmouseenter = () => {
      scanFab.style.transform = "translateY(-4px) scale(1.05)";
    };
    scanFab.onmouseleave = () => {
      scanFab.style.transform = "translateY(0) scale(1)";
    };
    document.body.appendChild(scanFab);

    // Modal Container
    const modalBackdrop = document.createElement("div");
    modalBackdrop.id = "hanuri-scan-modal";
    modalBackdrop.style.cssText = `
      position: fixed !important;
      inset: 0 !important;
      background: rgba(15, 23, 42, 0.78) !important;
      backdrop-filter: blur(5px) !important;
      z-index: 2147483647 !important;
      display: none;
      align-items: center !important;
      justify-content: center !important;
      padding: 24px !important;
      font-family: 'Pretendard', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
    `;

    modalBackdrop.innerHTML = `
      <div style="background:#0f172a;border:2px solid #3b82f6;border-radius:20px;max-width:960px;width:100%;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.6);overflow:hidden;color:#f8fafc;">
        <!-- Header -->
        <div style="padding:18px 24px;border-bottom:1px solid #334155;background:#1e293b;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">📡</span>
            <div>
              <h2 style="font-size:17.5px;font-weight:800;color:#fff;margin:0;">한우리 수업지원시스템 실시간 딥스캔 (v1.3)</h2>
              <p style="font-size:12.5px;color:#94a3b8;margin:3px 0 0;">현재 화면 + 5대 자료실(수업/평가/정오표/학부모/상담) 전수 수집 및 원문 진단</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button id="scanRefreshBtn" style="background:#2563eb;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">🔄 지금 다시 스캔</button>
            <button id="scanRawViewBtn" style="background:#7c3aed;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">🔍 현재화면 원문/구조 보기</button>
            <button id="scanExportJsonBtn" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">💾 JSON 저장</button>
            <button id="scanCloseBtn" style="background:#334155;color:#cbd5e1;border:none;padding:8px 12px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">✕</button>
          </div>
        </div>

        <!-- Summary Bar -->
        <div id="scanSummaryBar" style="padding:12px 24px;background:#131c31;border-bottom:1px solid #1e293b;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:13px;">
          <div id="scanStatusText" style="color:#fde047;font-weight:700;">준비 완료 (스캔 버튼을 눌러주세요)</div>
          <div id="scanBadges" style="display:flex;gap:8px;align-items:center;"></div>
        </div>

        <!-- Category Nav -->
        <div style="padding:10px 24px;background:#1e293b;display:flex;gap:8px;border-bottom:1px solid #334155;overflow-x:auto;">
          <button class="scan-cat-btn active" data-cat="all" style="padding:6px 14px;border-radius:6px;border:none;background:#2563eb;color:#fff;font-weight:700;font-size:12.5px;cursor:pointer;">전체 자료</button>
          <button class="scan-cat-btn" data-cat="current" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">🖥️ 현재 화면</button>
          <button class="scan-cat-btn" data-cat="source" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">📂 수업자료</button>
          <button class="scan-cat-btn" data-cat="test" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">📝 평가자료</button>
          <button class="scan-cat-btn" data-cat="errata" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">📖 정오표</button>
          <button class="scan-cat-btn" data-cat="parents" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">👨‍👩‍👧 학부모제공</button>
          <button class="scan-cat-btn" data-cat="consult" style="padding:6px 14px;border-radius:6px;border:none;background:#334155;color:#cbd5e1;font-weight:700;font-size:12.5px;cursor:pointer;">💬 상담자료</button>
        </div>

        <!-- Content Area -->
        <div id="scanResultsList" style="flex:1;overflow-y:auto;padding:18px 24px;display:flex;flex-direction:column;gap:10px;">
          <div style="text-align:center;padding:50px 0;color:#94a3b8;">
            <div style="font-size:40px;margin-bottom:12px;">📡</div>
            <div style="font-size:16px;font-weight:700;color:#f8fafc;">5대 자료실 실시간 스캔을 시작하려면 버튼을 누르세요</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Event Listeners
    scanFab.addEventListener("click", () => {
      modalBackdrop.style.display = "flex";
      performDeepScan();
    });

    modalBackdrop.querySelector("#scanCloseBtn").addEventListener("click", () => {
      modalBackdrop.style.display = "none";
    });

    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) modalBackdrop.style.display = "none";
    });

    modalBackdrop.querySelector("#scanRefreshBtn").addEventListener("click", () => {
      performDeepScan();
    });

    modalBackdrop.querySelector("#scanRawViewBtn").addEventListener("click", () => {
      renderCurrentPageRawDiagnostic();
    });

    modalBackdrop.querySelector("#scanExportJsonBtn").addEventListener("click", () => {
      exportScanDataAsJson();
    });

    modalBackdrop.querySelectorAll(".scan-cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        modalBackdrop.querySelectorAll(".scan-cat-btn").forEach((b) => {
          b.style.background = "#334155";
          b.style.color = "#cbd5e1";
        });
        btn.style.background = "#2563eb";
        btn.style.color = "#ffffff";
        renderScanResults(btn.dataset.cat);
      });
    });

    // Words to ignore (Navigation & Step filter buttons)
    const NAV_IGNORE_EXACT = new Set([
      "로그아웃", "검색", "자료함", "정오표", "수업자료", "학부모제공자료", "평가자료", "상담자료",
      "닫기", "전체", "몰입독서P", "몰입독서A", "몰입독서B", "몰입독서C", "몰입독서D", "몰입독서S",
      "새싹1/새싹2", "어휘1", "어휘2", "독서1", "독서2", "논리1", "논리2",
      "소크라테스1", "소크라테스2", "소크라테스3", "과학탐탐", "똑똑한국사", "세계문화지리", "세계사",
      "참깨한글", "다다어휘", "똑독해", "한국사봄", "별별문학독해", "소크라테스진로", "교과문학탐독",
      "한국사람", "이지중학국어문법", "교과문학맥잡기", "소클고등문학", "소클고등통합사회",
      "#전체", "#활동계획안", "#참고자료", "#몰입독서_향상평가", "#필독서퀴즈", "#필독서퀴즈_통사",
      "(이전)필독서퀴즈 바로가기", "개인정보수정", "전체메뉴", "메인홈", "회원", "지도그룹",
      "주문", "매출채권", "독서진단", "게시판", "수업지원", "더보기", "년목표보기",
      "⚡ 5대 자료실 딥스캔", "🔄 지금 다시 스캔", "🔍 현재화면 원문/구조 보기", "💾 JSON 저장", "✕"
    ]);

    function isValidTitle(txt) {
      if (!txt) return false;
      const trimmed = txt.replace(/\s+/g, " ").trim();
      if (trimmed.length < 4) return false;
      if (NAV_IGNORE_EXACT.has(trimmed)) return false;
      if (/^자료함\(\d+\)$/.test(trimmed)) return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (trimmed.includes("지도하는 단계의 자료만 보기 원할 경우")) return false;
      if (trimmed.includes("한우리 수업지원시스템 실시간 딥스캔")) return false;
      return true;
    }

    function normalizeUrl(rawHref, baseUrl) {
      if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) {
        return baseUrl;
      }
      if (rawHref.startsWith("http")) return rawHref;
      const origin = baseUrl.startsWith("http") ? new URL(baseUrl).origin : window.location.origin;
      return origin + (rawHref.startsWith("/") ? "" : "/") + rawHref;
    }

    function extractItemsFromDoc(doc, catId, catName, baseUrl) {
      const items = [];
      const seenTitles = new Set();

      function addCandidate(container, linkEl, rawTitle) {
        const title = (rawTitle || "").replace(/\s+/g, " ").trim();
        if (!isValidTitle(title) || seenTitles.has(title)) return;
        seenTitles.add(title);

        const containerHtml = container ? container.innerHTML.toLowerCase() : "";
        const isNew = !!(
          (container && container.querySelector(".new, .ico_new, img[src*='new'], .badge_new, .badge-danger")) ||
          title.includes("NEW") ||
          containerHtml.includes("ico_new") ||
          containerHtml.includes("icon_new")
        );

        let date = "";
        let category = "";
        const fullText = container ? (container.textContent || "").replace(/\s+/g, " ").trim() : title;
        const dateMatch = fullText.match(/\d{4}[-./]\d{2}[-./]\d{2}/);
        if (dateMatch) date = dateMatch[0];

        const tds = container ? container.querySelectorAll("td") : [];
        if (tds.length >= 3) {
          category = (tds[1].textContent || "").trim();
          if (!date) date = (tds[tds.length - 1].textContent || "").trim();
        }

        const href = linkEl ? linkEl.getAttribute("href") : "";
        items.push({
          catId,
          catName,
          title: title.replace(/\bNEW\b/g, "").trim(),
          category,
          date,
          url: normalizeUrl(href, baseUrl),
          isNew
        });
      }

      // Tier 1: All table rows
      doc.querySelectorAll("table tr").forEach((tr) => {
        if (tr.closest("#hanuri-scan-modal")) return;
        const a = tr.querySelector("a");
        const txt = a ? a.textContent : tr.textContent;
        addCandidate(tr, a, txt);
      });

      // Tier 2: List items & Board/Card elements
      doc.querySelectorAll("ul li, ol li, dl, [class*='list'] > div, [class*='item'], [class*='card'], [class*='row'], [class*='board'] div, [class*='tit'], [class*='subject']").forEach((el) => {
        if (el.closest("#hanuri-scan-modal") || el.closest("#hanuri-auto-panel")) return;
        const a = el.tagName === "A" ? el : el.querySelector("a");
        const txt = a ? a.textContent : el.textContent;
        if (txt && txt.length <= 160) {
          addCandidate(el, a, txt);
        }
      });

      // Tier 3: Any remaining anchor tags or buttons with content
      doc.querySelectorAll("a, button[onclick], [onclick*='view'], [onclick*='down'], [onclick*='detail']").forEach((a) => {
        if (a.closest("#hanuri-scan-modal") || a.closest("#hanuri-auto-panel")) return;
        addCandidate(a.parentElement || a, a, a.textContent);
      });

      // Tier 4: Fallback text lines if still 0 items
      if (items.length === 0 && doc.body) {
        const clone = doc.body.cloneNode(true);
        clone.querySelectorAll("script, style, noscript, #hanuri-scan-modal, #hanuri-auto-panel, #hanuri-scan-fab").forEach((s) => s.remove());
        const rawLines = (clone.innerText || clone.textContent || "")
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => isValidTitle(l) && l.length >= 5 && l.length <= 150);

        rawLines.slice(0, 40).forEach((line) => {
          addCandidate(null, null, line);
        });
      }

      return items;
    }

    const TARGET_ROUTES = [
      { id: "source", name: "수업자료", url: "https://teaching.hanuribook.com/hu/source?jpage=1&type=&t_group=tg0" },
      { id: "test", name: "평가자료", url: "https://teaching.hanuribook.com/hu/test?jpage=1&type=&t_group=tg0" },
      { id: "errata", name: "정오표", url: "https://teaching.hanuribook.com/hu/errata?jpage=1&type=&t_group=tg0" },
      { id: "parents", name: "학부모제공", url: "https://teaching.hanuribook.com/hu/feedback" },
      { id: "consult", name: "상담자료", url: "https://teaching.hanuribook.com/hu/samplebook" }
    ];

    const EDUNET_BOARDS = [
      { id: "board_notice", name: "본사알림판", url: "https://edunet.hanuribook.com/board/1/list" },
      { id: "board_center", name: "우리센터알림판", url: "https://edunet.hanuribook.com/board/6/list" },
      { id: "board_general", name: "일반자료실", url: "https://edunet.hanuribook.com/board/2/list" },
      { id: "board_promo", name: "홍보/판촉자료실", url: "https://edunet.hanuribook.com/board/3/list" }
    ];

    async function performDeepScan() {
      const statusText = document.getElementById("scanStatusText");
      const listEl = document.getElementById("scanResultsList");
      statusText.innerHTML = "⏳ 현재 화면 및 주요 자료실 실시간 순회 중...";
      listEl.innerHTML = `
        <div style="text-align:center;padding:60px 0;color:#93c5fd;">
          <div style="font-size:36px;margin-bottom:12px;">🔄</div>
          <div style="font-size:16px;font-weight:700;">현재 화면 DOM 및 전체 자료실을 동시 탐색 중입니다...</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:6px;">잠시만 기다려 주세요 (약 2~3초 소요)</div>
        </div>
      `;

      const allItems = [];
      const debugLogs = [];

      // Step A: Extract from CURRENT active page DOM immediately
      const liveItems = extractItemsFromDoc(document, "current", "현재 화면", window.location.href);
      liveItems.forEach((it) => allItems.push(it));
      debugLogs.push(`[현재 화면 (${window.location.pathname})] ${liveItems.length}건 감지`);

      // Step B: Background fetch all routes for active domain
      const activeRoutes = window.location.hostname.includes("teaching.hanuribook.com") ? TARGET_ROUTES : EDUNET_BOARDS;
      for (const route of activeRoutes) {
        try {
          const res = await fetch(route.url, { credentials: "include" });
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const items = extractItemsFromDoc(doc, route.id, route.name, route.url);
          debugLogs.push(`[${route.name}] HTTP ${res.status} (${Math.round(html.length / 1024)}KB) ➔ ${items.length}건 감지`);

          items.forEach((it) => {
            if (!allItems.some((ex) => ex.title === it.title && ex.catId === it.catId)) {
              allItems.push(it);
            }
          });
        } catch (err) {
          debugLogs.push(`[${route.name}] 통신 에러: ${err.message}`);
        }
      }

      window.__LAST_SCAN_DATA__ = allItems;
      window.__LAST_SCAN_TIME__ = new Date().toLocaleString("ko-KR");
      window.__LAST_SCAN_DEBUG__ = debugLogs;

      const totalNewCount = allItems.filter((i) => i.isNew).length;
      statusText.innerHTML = `✅ 스캔 완료 (${window.__LAST_SCAN_TIME__}) · 총 <strong>${allItems.length}</strong>개 항목 감지`;

      const badgeBox = document.getElementById("scanBadges");
      badgeBox.innerHTML = `
        <span style="background:${totalNewCount > 0 ? '#dc2626' : '#334155'};color:#fff;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:800;">
          ${totalNewCount > 0 ? '🔥 신규 NEW ' + totalNewCount + '건' : '신규 0건'}
        </span>
        <button id="btnToggleDebug" style="background:#1e293b;border:1px solid #475569;color:#fde047;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">📊 스캔 진단로그</button>
      `;

      const debugBtn = document.getElementById("btnToggleDebug");
      if (debugBtn) {
        debugBtn.onclick = () => {
          alert("=== 딥스캔 실시간 진단 로그 ===\n\n" + debugLogs.join("\n"));
        };
      }

      showBanner(`✅ 딥스캔 완료! 총 ${allItems.length}건 감지`, "#059669");
      renderScanResults("all");
    }

    function renderScanResults(filterCat = "all") {
      const listEl = document.getElementById("scanResultsList");
      const data = window.__LAST_SCAN_DATA__ || [];
      const filtered = filterCat === "all" ? data : data.filter((d) => d.catId === filterCat);

      if (filtered.length === 0) {
        const debugInfo = (window.__LAST_SCAN_DEBUG__ || []).join(" / ");
        listEl.innerHTML = `
          <div style="text-align:center;padding:40px 20px;color:#94a3b8;">
            <div style="font-size:32px;margin-bottom:8px;">📭</div>
            <div style="font-size:15px;font-weight:700;color:#f8fafc;">해당 분류에 표시할 항목이 없습니다.</div>
            <div style="font-size:12.5px;margin-top:8px;color:#cbd5e1;">상단의 <strong>[🔍 현재화면 원문/구조 보기]</strong> 버튼을 누르시면 페이지 내부 데이터를 직접 확인하실 수 있습니다.</div>
            <div style="font-size:11.5px;margin-top:10px;color:#64748b;">진단: ${debugInfo}</div>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered
        .map(
          (item) => `
        <div style="background:#1e293b;border:1px solid ${item.isNew ? '#f59e0b' : '#334155'};border-radius:12px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
            <span style="padding:4px 9px;border-radius:6px;font-size:12px;font-weight:800;background:#0f172a;color:#93c5fd;white-space:nowrap;border:1px solid #334155;">
              ${item.catName}
            </span>
            ${item.isNew ? '<span style="background:#ef4444;color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:800;white-space:nowrap;">NEW</span>' : ''}
            <div style="min-width:0;flex:1;">
              <a href="${item.url}" target="_blank" style="color:#f8fafc;font-size:14px;font-weight:700;text-decoration:none;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.title}">
                ${item.title}
              </a>
              ${item.category ? `<span style="font-size:12px;color:#94a3b8;margin-top:2px;display:inline-block;">[${item.category}]</span>` : ''}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
            ${item.date ? `<span style="font-size:12.5px;color:#cbd5e1;font-family:monospace;">${item.date}</span>` : ''}
            <a href="${item.url}" target="_blank" style="background:#2563eb;color:#fff;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;">열기 ↗</a>
          </div>
        </div>
      `
        )
        .join("");
    }

    function renderCurrentPageRawDiagnostic() {
      const listEl = document.getElementById("scanResultsList");
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll("script, style, #hanuri-scan-modal, #hanuri-scan-fab").forEach((el) => el.remove());

      const visibleText = (clone.innerText || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .join("\n");

      const formsAndTables = [];
      document.querySelectorAll("form, table, ul, div[class*='list'], div[class*='board'], div[class*='cont'], iframe").forEach((el) => {
        if (el.closest("#hanuri-scan-modal")) return;
        formsAndTables.push(`<${el.tagName.toLowerCase()} id="${el.id || ''}" class="${el.className || ''}"> (자식 ${el.children.length}개)`);
      });

      listEl.innerHTML = `
        <div style="background:#1e293b;border:1px solid #475569;border-radius:12px;padding:16px;color:#e2e8f0;font-size:13px;line-height:1.6;">
          <h3 style="color:#fde047;margin:0 0 8px;">🔍 현재 페이지(${window.location.href}) 내부 구조 진단</h3>
          <div style="margin-bottom:12px;color:#93c5fd;font-family:monospace;font-size:12px;background:#0f172a;padding:10px;border-radius:8px;max-height:150px;overflow-y:auto;">
            ${formsAndTables.length ? formsAndTables.map((s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("<br/>") : "감지된 주요 컨테이너 없음"}
          </div>
          <h4 style="color:#34d399;margin:12px 0 6px;">📄 현재 화면에 렌더링된 전체 텍스트 원문:</h4>
          <pre style="background:#0f172a;padding:12px;border-radius:8px;color:#f8fafc;font-size:12.5px;white-space:pre-wrap;max-height:320px;overflow-y:auto;border:1px solid #334155;">${visibleText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </div>
      `;
    }

    function exportScanDataAsJson() {
      const data = window.__LAST_SCAN_DATA__ || [];
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll("script, style, #hanuri-scan-modal, #hanuri-scan-fab").forEach((el) => el.remove());
      const rawText = (clone.innerText || "").trim();

      const jsonStr = JSON.stringify(
        {
          scanTime: window.__LAST_SCAN_TIME__ || new Date().toLocaleString("ko-KR"),
          currentUrl: window.location.href,
          debugLogs: window.__LAST_SCAN_DEBUG__ || [],
          totalCount: data.length,
          items: data,
          currentPageVisibleText: rawText
        },
        null,
        2
      );

      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `한우리_딥스캔_결과_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showBanner("💾 스캔 결과 및 페이지 원문이 JSON 파일로 저장되었습니다!", "#059669");
    }
  }
})();
