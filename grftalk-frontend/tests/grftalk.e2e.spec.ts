import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const fillSignUp = async (
  page: Page,
  data: { name: string; email: string; password: string },
) => {
  await page.goto("/auth/signup");
  await page.getByLabel("Name").fill(data.name);
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL("/");
};

const fillSignIn = async (
  page: Page,
  data: { email: string; password: string },
) => {
  await page.goto("/auth/signin");
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/");
};

const openAccountMenu = async (page: Page) => {
  await page.getByRole("button", { name: "Open account menu" }).click();
};

test.describe("GRF Talk E2E", () => {
  test("covers auth, profile, chats, messages, theme, mobile nav and logout", async ({
    browser,
  }) => {
    test.setTimeout(180_000);

    const timestamp = Date.now();
    const userA = {
      name: `Playwright Alpha ${timestamp}`,
      email: `playwright.alpha.${timestamp}@example.com`,
      password: "Pa$$word123!",
    };
    const userB = {
      name: `Playwright Beta ${timestamp}`,
      email: `playwright.beta.${timestamp}@example.com`,
      password: "Pa$$word123!",
    };
    const updatedUserAName = `${userA.name} Updated`;
    const avatarPath = path.resolve(process.cwd(), "public", "grftalk.png");
    const attachmentPath = path.resolve(
      process.cwd(),
      "tests",
      "fixtures",
      "e2e-note.txt",
    );

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    await test.step("sign up first user and validate home, theme and mobile chats sheet", async () => {
      await fillSignUp(pageA, userA);

      await expect(
        pageA.getByText(
          "Please select a chat to view the messages or start a new one.",
        ),
      ).toBeVisible();

      await pageA.getByRole("button", { name: "Toggle theme" }).click();
      await pageA.getByRole("menuitem", { name: "Dark" }).click();
      await expect(pageA.locator("html")).toHaveClass(/dark/);

      await pageA.setViewportSize({ width: 390, height: 844 });
      await pageA
        .getByRole("button", { name: "Open or close chats" })
        .click();
      await expect(
        pageA.getByPlaceholder("Search for chats").last(),
      ).toBeVisible();
      await pageA.keyboard.press("Escape");
      await pageA.setViewportSize({ width: 1280, height: 900 });
    });

    await test.step("sign up second user, create a chat and send text plus file", async () => {
      await fillSignUp(pageB, userB);

      await pageB.getByRole("button", { name: "New Chat" }).first().click();
      await pageB.getByLabel("Email").fill(userA.email);
      await pageB.getByRole("button", { name: "Send" }).click();

      await expect(pageB.getByRole("heading", { name: userA.name })).toBeVisible();
      await expect(
        pageB.getByText("No messages in this conversation yet."),
      ).toBeVisible();

      await pageB.getByPlaceholder("Type a message").fill("Hello from user B");
      await pageB.getByRole("button", { name: "Send a message" }).click();
      await expect(pageB.getByText("Hello from user B").last()).toBeVisible();

      await pageB.locator("#attachment").setInputFiles(attachmentPath);
      await expect(pageB.getByText("File uploaded: e2e-note.txt")).toBeVisible();
      await pageB.getByRole("button", { name: "Send a message" }).click();
      await expect(pageB.getByText("e2e-note.txt").last()).toBeVisible();
    });

    await test.step("first user receives the chat, replies and deletes own message", async () => {
      await pageA.reload();
      await pageA.getByText(userB.name).first().click();

      await expect(pageA.getByText("Hello from user B").last()).toBeVisible();
      await expect(pageA.getByText("e2e-note.txt").last()).toBeVisible();

      await pageA.getByPlaceholder("Type a message").fill("Reply from user A");
      await pageA.getByRole("button", { name: "Send a message" }).click();
      await expect(pageA.getByText("Reply from user A").last()).toBeVisible();

      await pageA.getByLabel("Open message actions").last().click();
      await pageA.getByRole("menuitem", { name: "Delete message" }).click();
      await expect(pageA.getByText("Reply from user A").last()).not.toBeVisible();
    });

    await test.step("first user updates profile data and avatar", async () => {
      await openAccountMenu(pageA);
      await pageA.getByRole("menuitem", { name: "Profile" }).click();
      await expect(pageA).toHaveURL("/account");

      await pageA.getByLabel("Avatar").setInputFiles(avatarPath);
      await pageA.getByLabel("Name").fill(updatedUserAName);
      await pageA.getByRole("button", { name: "Update" }).click();

      await expect(pageA.getByLabel("Name")).toHaveValue(updatedUserAName);
      await expect(
        pageA.getByText("Profile updated successfully1"),
      ).toBeVisible();
    });

    await test.step("first user deletes the chat and signs out", async () => {
      await pageA.goto("/");
      await pageA.getByText(userB.name).first().click();
      await pageA.getByRole("button", { name: "Open chat actions" }).click();
      await pageA.getByRole("menuitem", { name: "Delete chat" }).click();

      await expect(
        pageA.getByText(
          "Please select a chat to view the messages or start a new one.",
        ),
      ).toBeVisible();

      await openAccountMenu(pageA);
      await pageA.getByRole("menuitem", { name: "Logout" }).click();
      await expect(pageA).toHaveURL("/auth/signin");
    });

    await test.step("first user can sign in again", async () => {
      await fillSignIn(pageA, {
        email: userA.email,
        password: userA.password,
      });

      await expect(
        pageA.getByText(
          "Please select a chat to view the messages or start a new one.",
        ),
      ).toBeVisible();
    });

    await test.step("second user can sign out cleanly", async () => {
      await openAccountMenu(pageB);
      await pageB.getByRole("menuitem", { name: "Logout" }).click();
      await expect(pageB).toHaveURL("/auth/signin");
    });

    await contextA.close();
    await contextB.close();
  });
});
