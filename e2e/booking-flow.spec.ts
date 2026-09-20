import { expect, test } from "@playwright/test";

test("student can request an available equipment slot", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("student@test.edu");
  await page.getByLabel("Password").fill("Test@1234");
  const loginResponse = page.waitForResponse((response) => response.url().endsWith("/auth/login") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Sign in" }).click();
  expect((await loginResponse).status()).toBe(200);
  await expect(page).toHaveURL(/\/browse$/);
  await expect(page.getByRole("heading", { name: "Browse equipment" })).toBeVisible();
  const printerCard = page.locator("article").filter({ hasText: "3D Printer" });
  await printerCard.getByRole("link", { name: "View availability" }).click();

  await expect(page.getByRole("heading", { name: "3D Printer" })).toBeVisible();
  const availableSlot = page.locator("[role='gridcell']").filter({ has: page.locator("button:not([disabled])") }).first();
  await availableSlot.getByRole("button").click();
  await page.getByRole("button", { name: "Confirm booking" }).click();

  const dialog = page.getByRole("dialog", { name: "Confirm booking" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Submit request" }).click();
  await expect(page.getByRole("status")).toContainText("Booking request submitted.");
});
