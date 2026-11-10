#!/usr/bin/env python3
"""
HoneyMetrics v2 - Automated High-Fidelity Documentation Screenshot Generator
Uses Playwright to capture pixel-perfect Retina (2880x1800) screenshots
directly into docs/assets/screenshots/ for the Academic Documentation.
"""

import os
import sys
import json
import time
import subprocess
from playwright.sync_api import sync_playwright

OUTPUT_DIR = "/media/sebas/Exdrive/Workspace/honeymetrics-v2-documentacion-universidad/docs/assets/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Obtain authenticated tokens from backend container
def get_container_token(user_id=4, auth_version=15, role="Administrador", scopes=None):
    if scopes is None:
        scopes = [
            "dashboard:read", "threats:read", "threats:write", "threats:delete",
            "logs:read", "logs:export", "blacklist:read", "blacklist:write",
            "users:profile", "admin:all"
        ]
    cmd = [
        "docker", "exec", "hm_v2_api", "python", "-c",
        f"from app.core.security import create_access_token; "
        f"print(create_access_token({user_id}, auth_version={auth_version}, role='{role}', scopes={scopes}))"
    ]
    return subprocess.check_output(cmd).decode().strip()

print("[*] Generating authentication tokens for test personas...")
admin_token = get_container_token(4, 15, "Administrador")
analyst_token = get_container_token(17, 0, "Analista", ["dashboard:read", "logs:read", "logs:export", "threats:read", "threats:write", "threats:delete", "ml:predict"])
consultant_token = get_container_token(23, 0, "Consultor", ["dashboard:read", "logs:read", "logs:export", "threats:read", "threats:write"])

admin_user = {
    "id": 4,
    "email": "jsebastianposada@ucundinamarca.edu.co",
    "first_names": "Sebastian",
    "last_names": "Posada",
    "role_id": 1,
    "role_name": "Administrador",
    "is_active": True,
    "is_mfa_enabled": False,
    "must_change_password": False,
    "scopes": [
        "dashboard:read", "threats:read", "threats:write", "threats:delete",
        "logs:read", "logs:export", "blacklist:read", "blacklist:write",
        "users:profile", "admin:all"
    ],
}

analyst_user = {
    "id": 17,
    "email": "johan.posada0521@gmail.com",
    "first_names": "Johan",
    "last_names": "Posada Analista",
    "role_id": 2,
    "role_name": "Analista",
    "is_active": True,
    "is_mfa_enabled": False,
    "must_change_password": False,
    "scopes": ["dashboard:read", "logs:read", "logs:export", "threats:read", "threats:write", "threats:delete", "ml:predict"],
}

consultant_user = {
    "id": 23,
    "email": "jd9639240@gmail.com",
    "first_names": "Consultor",
    "last_names": "Ciberseguridad",
    "role_id": 3,
    "role_name": "Consultor",
    "is_active": True,
    "is_mfa_enabled": False,
    "must_change_password": False,
    "scopes": ["dashboard:read", "logs:read", "logs:export", "threats:read", "threats:write"],
}

def inject_auth(page, token, user, role, scopes):
    script = f"""
    localStorage.setItem('access_token', '{token}');
    localStorage.setItem('hm_access_token', '{token}');
    localStorage.setItem('user_data', JSON.stringify({json.dumps(user)}));
    localStorage.setItem('hm_user', JSON.stringify({json.dumps(user)}));
    localStorage.setItem('hm_role', '{role}');
    localStorage.setItem('hm_scopes', JSON.stringify({json.dumps(scopes)}));
    sessionStorage.setItem('access_token', '{token}');
    sessionStorage.setItem('hm_access_token', '{token}');
    sessionStorage.setItem('user_data', JSON.stringify({json.dumps(user)}));
    sessionStorage.setItem('hm_user', JSON.stringify({json.dumps(user)}));
    sessionStorage.setItem('hm_role', '{role}');
    sessionStorage.setItem('hm_scopes', JSON.stringify({json.dumps(scopes)}));
    """
    page.add_init_script(script)

with sync_playwright() as p:
    print("[*] Launching Chromium browser (Retina 1440x900 @ 2x = 2880x1800)...")
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1440, "height": 900},
        device_scale_factor=2,
        color_scheme="dark",
    )

    # -------------------------------------------------------------
    # 1. fig01_login.png
    # -------------------------------------------------------------
    print("[1/7] Capturing fig01_login.png...")
    page = context.new_page()
    page.goto("http://localhost:5173/login", wait_until="networkidle")
    email_in = page.locator('input[type="email"]')
    if email_in.count() > 0:
        email_in.fill("jsebastianposada@ucundinamarca.edu.co")
    pwd_in = page.locator('input[type="password"]')
    if pwd_in.count() > 0:
        pwd_in.fill("TestingSecurePassword2026!")
    page.wait_for_timeout(1000)
    dest = os.path.join(OUTPUT_DIR, "fig01_login.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 2. fig04_dashboard_cti.png
    # -------------------------------------------------------------
    print("[2/7] Capturing fig04_dashboard_cti.png...")
    page = context.new_page()
    inject_auth(page, admin_token, admin_user, "Administrador", admin_user["scopes"])
    page.goto("http://localhost:5173/dashboard", wait_until="networkidle")
    page.wait_for_selector(".js-plotly-plot", timeout=10000)
    page.wait_for_timeout(2500)
    dest = os.path.join(OUTPUT_DIR, "fig04_dashboard_cti.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 3. fig05_threat_center_ioc.png
    # -------------------------------------------------------------
    print("[3/7] Capturing fig05_threat_center_ioc.png...")
    page = context.new_page()
    inject_auth(page, admin_token, admin_user, "Administrador", admin_user["scopes"])
    page.goto("http://localhost:5173/blacklist", wait_until="networkidle")
    page.wait_for_selector('table tbody tr', timeout=10000)
    page.wait_for_timeout(1500)
    dest = os.path.join(OUTPUT_DIR, "fig05_threat_center_ioc.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 4. fig06_exportacion_logs_modal.png
    # -------------------------------------------------------------
    print("[4/7] Capturing fig06_exportacion_logs_modal.png...")
    page = context.new_page()
    inject_auth(page, analyst_token, analyst_user, "Analista", analyst_user["scopes"])
    page.goto("http://localhost:5173/logs", wait_until="networkidle")
    page.wait_for_selector('table tbody tr', timeout=10000)
    page.wait_for_timeout(1000)
    export_btn = page.locator('button:has-text("Nuevo Export")')
    if export_btn.count() > 0:
        export_btn.click()
    page.wait_for_selector('div[role="dialog"]', timeout=5000)
    start_date = page.locator('input[type="date"]').nth(0)
    end_date = page.locator('input[type="date"]').nth(1)
    if start_date.count() > 0:
        start_date.fill("2026-08-01")
    if end_date.count() > 0:
        end_date.fill("2026-08-20")
    page.wait_for_timeout(1000)
    dest = os.path.join(OUTPUT_DIR, "fig06_exportacion_logs_modal.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 5. fig07_admin_usuarios_roles.png
    # -------------------------------------------------------------
    print("[5/7] Capturing fig07_admin_usuarios_roles.png...")
    page = context.new_page()
    inject_auth(page, admin_token, admin_user, "Administrador", admin_user["scopes"])
    page.goto("http://localhost:5173/admin", wait_until="networkidle")
    page.wait_for_selector('table tbody tr', timeout=10000)
    page.wait_for_timeout(1500)
    dest = os.path.join(OUTPUT_DIR, "fig07_admin_usuarios_roles.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 6. fig08_consultor_cti_boveda.png
    # -------------------------------------------------------------
    print("[6/7] Capturing fig08_consultor_cti_boveda.png...")
    page = context.new_page()
    inject_auth(page, consultant_token, consultant_user, "Consultor", consultant_user["scopes"])
    page.goto("http://localhost:5173/blacklist", wait_until="networkidle")
    page.wait_for_timeout(1000)
    vault_tab_btn = page.locator('button:has-text("Bóveda Forense")')
    if vault_tab_btn.count() > 0:
        vault_tab_btn.click()
    page.wait_for_selector('table tbody tr', timeout=10000)
    page.wait_for_timeout(1500)
    dest = os.path.join(OUTPUT_DIR, "fig08_consultor_cti_boveda.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    # -------------------------------------------------------------
    # 7. fig09_analista_logs_pdf.png
    # -------------------------------------------------------------
    print("[7/7] Capturing fig09_analista_logs_pdf.png...")
    page = context.new_page()
    inject_auth(page, analyst_token, analyst_user, "Analista", analyst_user["scopes"])
    page.goto("http://localhost:5173/logs", wait_until="networkidle")
    page.wait_for_selector('table tbody tr', timeout=10000)
    page.wait_for_timeout(1500)
    dest = os.path.join(OUTPUT_DIR, "fig09_analista_logs_pdf.png")
    page.screenshot(path=dest, full_page=False)
    print(f"    -> Saved {dest}")
    page.close()

    browser.close()
    print("[✓] All 7 screenshots generated successfully!")
