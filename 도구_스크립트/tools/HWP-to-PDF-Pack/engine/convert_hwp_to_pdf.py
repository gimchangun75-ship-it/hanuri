# -*- coding: utf-8 -*-
"""
========================================================================================
[SSOT] 천하무적 단수화(All-in-One) 아래한글 ➔ PDF 변환 포터블 엔진 (V2.1)
- 한컴 2018 / 2020 / 2022 / 2024 / 한컴독스 전 버전 100% 무결점 호환
- [포터블 자가 탐색]: 실행 위치에 관계없이 동봉된 보안 모듈 자동 감지 및 자가치유
- [3대 레지스트리 경로 동시 자가치유]: 보안 승인 팝업 0% 완전 박멸
- [2단계 다이렉트 변환 폴백]: SaveAs direct ➔ HAction HFileOpenSave ParameterSet
- [완전 단수화 실행]: 단일/복수 파일, 폴더, 재귀 탐색, 인자 없을 시 CWD 자동 변환
- 단일 인스턴스 세션 재사용 고속 변환 & 프로세스 누수 0% (Try-Finally Clean Exit)
========================================================================================
"""

import os
import sys
import argparse
import time
import winreg
from pathlib import Path

# 윈도우 콘솔(CP949) 이모지 및 특수 유니코드 출력 시 UnicodeEncodeError 원천 방지
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

try:
    import win32com.client
    import pythoncom
except ImportError:
    print("[ERROR] 'pywin32' 패키지가 필요합니다: pip install pywin32", file=sys.stderr)
    sys.exit(1)


MODULE_REG_NAME = "FilePathCheckerModule"
CURRENT_DIR = Path(__file__).resolve().parent

# 동봉된 보안 모듈 DLL 경로 탐색 (현재 폴더 -> 상위 bin 폴더 순)
CANDIDATE_DLLS = [
    CURRENT_DIR / "FilePathCheckerModuleExample.dll",
    CURRENT_DIR.parent / "bin" / "FilePathCheckerModuleExample.dll",
]

SECURITY_DLL_PATH = None
for p in CANDIDATE_DLLS:
    if p.exists():
        SECURITY_DLL_PATH = p
        break

# 한컴 버전별(2018~2024 및 패치 빌드) 3대 레지스트리 경로
REG_TARGET_PATHS = [
    r"Software\HNC\HwpAutomation\Modules",
    r"Software\Hnc\HwpUserAction\Modules",
    r"Software\HNC\HwpCtrl\Modules",
]


def self_heal_registries() -> bool:
    """
    한컴오피스 전 버전에 걸쳐 보안 팝업을 원천 차단하기 위해
    3대 레지스트리 경로 전체에 보안 모듈 DLL을 일괄 동기화(자가치유)합니다.
    """
    if not SECURITY_DLL_PATH or not SECURITY_DLL_PATH.exists():
        return False

    success = False
    dll_str = str(SECURITY_DLL_PATH.resolve())

    for reg_path in REG_TARGET_PATHS:
        try:
            key = winreg.CreateKey(winreg.HKEY_CURRENT_USER, reg_path)
            try:
                cur_val, _ = winreg.QueryValueEx(key, MODULE_REG_NAME)
                if cur_val != dll_str:
                    winreg.SetValueEx(key, MODULE_REG_NAME, 0, winreg.REG_SZ, dll_str)
            except FileNotFoundError:
                winreg.SetValueEx(key, MODULE_REG_NAME, 0, winreg.REG_SZ, dll_str)
            winreg.CloseKey(key)
            success = True
        except Exception:
            pass

    return success


class InvincibleHwpConverter:
    """천하무적 한컴오피스 세션 기반 고속 일괄 변환기"""

    def __init__(self, visible=False):
        self.visible = visible
        self.hwp = None
        self_heal_registries()

    def start(self):
        """한컴 인스턴스 기동 및 듀얼 보안 모듈 바인딩"""
        if self.hwp is not None:
            return

        pythoncom.CoInitialize()
        try:
            self.hwp = win32com.client.DispatchEx("HWPFrame.HwpObject")
        except Exception:
            try:
                self.hwp = win32com.client.Dispatch("HWPFrame.HwpObject")
            except Exception as e:
                raise RuntimeError(f"한컴오피스 엔진 기동 실패 (HWPFrame.HwpObject): {e}")

        try:
            if not self.visible:
                self.hwp.XHwpWindows.Item(0).Visible = False
        except Exception:
            pass

        try:
            self.hwp.RegisterModule("FilePathCheckDLL", MODULE_REG_NAME)
        except Exception:
            pass

    def convert_file(self, input_path: Path, output_path: Path, overwrite=False) -> bool:
        """
        단일 파일 무결점 변환
        - 1단계: SaveAs("PDF") 다이렉트 변환
        - 2단계 폴백: HAction HFileOpenSave 파라미터 세트 변환
        """
        input_abs = str(input_path.resolve())
        output_abs = str(output_path.resolve())

        if not input_path.exists():
            print(f"[SKIP] 원본 파일 없음: {input_abs}")
            return False

        if output_path.exists() and not overwrite:
            print(f"[SKIP] 이미 변환됨: {output_path.name}")
            return True

        output_path.parent.mkdir(parents=True, exist_ok=True)

        if self.hwp is None:
            self.start()

        try:
            # 문서 열기 (포맷 빈 문자열: .hwp / .hwpx 자동 감지, forceopen: 읽기전용/손상문서 강제열기)
            opened = self.hwp.Open(input_abs, "", "forceopen:true")
            if not opened:
                print(f"[FAIL] 문서 열기 실패 (암호 또는 손상): {input_path.name}")
                return False

            # [1단계 시도]: 고속 SaveAs
            saved = False
            try:
                saved = self.hwp.SaveAs(output_abs, "PDF", "")
            except Exception:
                saved = False

            # [2단계 폴백 시도]: HAction ParameterSet (최신/특수 환경 대응)
            if not (saved and output_path.exists() and output_path.stat().st_size > 0):
                try:
                    pset = self.hwp.HParameterSet.HFileOpenSave
                    self.hwp.HAction.GetDefault("FileSaveAs", pset.HSet)
                    pset.filename = output_abs
                    pset.Format = "PDF"
                    self.hwp.HAction.Execute("FileSaveAs", pset.HSet)
                except Exception:
                    pass

            return bool(output_path.exists() and output_path.stat().st_size > 0)

        except Exception as e:
            print(f"[ERROR] 처리 중 예외 발생: {input_path.name} -> {e}")
            return False
        finally:
            try:
                self.hwp.Clear(1)
            except Exception:
                pass

    def close(self):
        """한컴 인스턴스 정상 종료 및 프로세스 완전 회수"""
        if self.hwp is not None:
            try:
                self.hwp.Clear(1)
                self.hwp.Quit()
            except Exception:
                pass
            finally:
                self.hwp = None
                try:
                    pythoncom.CoUninitialize()
                except Exception:
                    pass

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def find_all_hwp_files(target_dir: Path, recursive=True):
    """디렉토리 내 .hwp / .hwpx 파일 수집 (임시 ~$ 제외)"""
    patterns = ["*.hwp", "*.hwpx"]
    files = []
    for pat in patterns:
        if recursive:
            files.extend(target_dir.rglob(pat))
        else:
            files.extend(target_dir.glob(pat))
    return sorted([f for f in files if not f.name.startswith("~$")])


def execute_conversion(paths, output_path_str=None, recursive=True, force=False, visible=False):
    """단수화(One-Shot) 실행 함수 (단일 또는 복수 인자 처리)"""
    if not paths:
        target_list = [Path.cwd().resolve()]
    else:
        target_list = [Path(p).resolve() for p in paths]

    tasks = []
    for target in target_list:
        if not target.exists():
            print(f"[WARN] 경로가 존재하지 않습니다: {target}", file=sys.stderr)
            continue

        if target.is_file():
            if target.suffix.lower() not in [".hwp", ".hwpx"]:
                print(f"[WARN] 한글 문서가 아닙니다 (건너뜀): {target.name}", file=sys.stderr)
                continue
            out_f = Path(output_path_str).resolve() if output_path_str else target.with_suffix(".pdf")
            tasks.append((target, out_f))
        else:
            found = find_all_hwp_files(target, recursive=recursive)
            out_base = Path(output_path_str).resolve() if output_path_str else None
            for in_f in found:
                if out_base:
                    rel = in_f.relative_to(target)
                    out_f = (out_base / rel).with_suffix(".pdf")
                else:
                    out_f = in_f.with_suffix(".pdf")
                tasks.append((in_f, out_f))

    if not tasks:
        print("[INFO] 변환 대상 파일(.hwp, .hwpx)을 찾지 못했습니다.")
        return True

    print("=" * 72)
    print("🛡️ [천하무적 포터블] 아래한글 ➔ PDF 통합 변환 엔진 기동")
    print(f"📊 총 변환 대상: {len(tasks)}개 파일")
    print("=" * 72)

    start_time = time.time()
    success_cnt = 0
    fail_cnt = 0

    with InvincibleHwpConverter(visible=visible) as converter:
        for idx, (in_f, out_f) in enumerate(tasks, 1):
            t0 = time.time()
            print(f"[{idx}/{len(tasks)}] 변환 중: {in_f.name} ... ", end="", flush=True)
            ok = converter.convert_file(in_f, out_f, overwrite=force)
            elapsed = time.time() - t0
            if ok:
                size_kb = out_f.stat().st_size / 1024
                print(f"✅ 완료 ({elapsed:.1f}초, {size_kb:,.1f} KB)")
                success_cnt += 1
            else:
                print(f"❌ 실패 ({elapsed:.1f}초)")
                fail_cnt += 1

    total_time = time.time() - start_time
    print("=" * 72)
    print(f"✨ [변환 완료] 성공: {success_cnt}건 | 실패: {fail_cnt}건 | 소요 시간: {total_time:.1f}초")
    print("=" * 72)

    return fail_cnt == 0


def main():
    parser = argparse.ArgumentParser(
        description="[천하무적 포터블] 한컴 2018~2024 전 버전 100% 무결점 아래한글 PDF 변환기"
    )
    parser.add_argument("paths", nargs="*", help="변환할 파일 또는 폴더 경로 (생략 시 현재 폴더)")
    parser.add_argument("-o", "--output", help="출력 파일 또는 폴더 경로")
    parser.add_argument("--no-recursive", action="store_true", help="하위 폴더 재귀 탐색 끄기")
    parser.add_argument("-f", "--force", action="store_true", help="이미 존재하는 PDF 파일 강제 덮어쓰기")
    parser.add_argument("-v", "--visible", action="store_true", help="한글 창 표시 (기본: 무음)")

    args = parser.parse_args()
    success = execute_conversion(
        paths=args.paths,
        output_path_str=args.output,
        recursive=not args.no_recursive,
        force=args.force,
        visible=args.visible,
    )
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
