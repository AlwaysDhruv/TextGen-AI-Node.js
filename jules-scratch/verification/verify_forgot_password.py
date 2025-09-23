from playwright.sync_api import Page, expect

def test_forgot_password(page: Page):
    # 1. Arrange: Go to the auth page.
    page.goto("http://localhost:5173/auth")

    # 2. Screenshot: Capture the auth page.
    page.screenshot(path="jules-scratch/verification/auth-page.png")
