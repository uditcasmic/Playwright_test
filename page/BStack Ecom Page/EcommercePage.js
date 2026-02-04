const assert = require("chai").assert;
const { expect } = require("@playwright/test");

class EcommercePage {
  /**
   * @param {import("playwright").Page} page
   */
  constructor(page) {
    this.page = page;
    this.locators = {
      usernameDropdown: "#username",
      usernameFirstOption: ".css-yt9ioa-option",
      passwordDropdown: "#password",
      passwordInput: "#react-select-3-input",
      loginButton: "//button[text()='Log In']",

      iphoneAddToCart: "//div[text()='Add to cart']",
      cartIcon: "//a[@class='cart-link']",
      checkoutButton: "//div[text()='Checkout']",

      firstName:
        "//label[text()='First Name']/following::input[@id='firstNameInput']",
      lastName:
        "//label[text()='Last Name']/following::input[@id='lastNameInput']",
      address:
        "//label[text()='Address']/following::input[@id='addressLine1Input']",
      state:
        "//label[text()='State/Province']/following::input[@id='provinceInput']",
      postalCode:
        "//label[text()='Postal Code']/following::input[@id='postCodeInput']",
      submitButton: "//button[text()='Submit']",

      orderSuccessMsg:
        "//legend[text()='Your Order has been successfully placed.']",
    };
  }

  /* Redirect to the BStack Demo site */
  async redirectToBStackDemo() {
    const targetUrl = "https://bstackdemo.com/signin/";
    try {
      await page.goto(targetUrl, { waitUntil: "networkidle" });
      console.log(`Redirected successfully to: ${targetUrl}`);
    } catch (error) {
      throw new Error(`Failed to redirect to BStack Demo: ${error.message}`);
    }
  }

  /* Perform login using first username option & given password */
  async login() {
    try {
      await page.click(this.locators.usernameDropdown);
      await page.locator(this.locators.usernameFirstOption).first().click();

      await page.click(this.locators.passwordDropdown);
      await page.fill(this.locators.passwordInput, "testingisfun99");
      await page.keyboard.press("Enter");

      await page.waitForTimeout(5000);

      await page.click(this.locators.loginButton);
      await page.waitForLoadState("networkidle");

      console.log("Successfully logged in using first options!");
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /* Add the first iPhone to the cart */
  async addIphoneToCart() {
    try {
      const firstAddToCart = page
        .locator(this.locators.iphoneAddToCart)
        .first();

      await firstAddToCart.waitFor({ state: "visible", timeout: 5000 });
      await firstAddToCart.click();

      console.log("First iPhone added to cart");
    } catch (error) {
      throw new Error(`Failed to add first iPhone to cart: ${error.message}`);
    }
  }

  /* Go to cart and proceed to checkout */
  async proceedToCheckout() {
    try {
      await page.waitForSelector(this.locators.checkoutButton, {
        state: "visible",
        timeout: 5000,
      });
      await page.click(this.locators.checkoutButton);
      console.log("Proceeded to checkout");
    } catch (error) {
      throw new Error(`Failed to proceed to checkout: ${error.message}`);
    }
  }

  /*  Fill shipping address form */
  async fillShippingAddress(firstName, lastName, address, state, postalCode) {
    try {
      await page.fill(this.locators.firstName, firstName);
      await page.fill(this.locators.lastName, lastName);
      await page.fill(this.locators.address, address);
      await page.fill(this.locators.state, state);
      await page.fill(this.locators.postalCode, postalCode);

      console.log(`Filled shipping address for ${firstName} ${lastName}`);
    } catch (error) {
      throw new Error(`Failed to fill shipping address: ${error.message}`);
    }
  }

  /* Submit shipping address */
  async submitShippingAddress() {
    await page.click(this.locators.submitButton);
    console.log("Shipping address submitted");
  }

  /*  Verify that order success message is visible */
  async verifyOrderSuccess() {
    try {
      const successMsg = page.locator(this.locators.orderSuccessMsg);
      await successMsg.waitFor({ state: "visible", timeout: 5000 });

      const text = await successMsg.textContent();
      if (text.includes("successfully placed")) {
        console.log("Order placed successfully!");
      } else {
        throw new Error("Success message text did not match!");
      }
    } catch (error) {
      throw new Error(`Failed to verify order success: ${error.message}`);
    }
  }

  /* This is a Reusable method to click button by text */
  async clickButtonByText(buttonText) {
    try {
      const button = page.locator(
        `//button[normalize-space(text())='${buttonText}']`
      );
      await button.waitFor({ state: "visible", timeout: 5000 });
      await button.click();
      console.log(`Clicked on button: ${buttonText}`);
    } catch (error) {
      throw new Error(
        `Failed to click on button '${buttonText}': ${error.message}`
      );
    }
  }

  /* This function is a Reusable method to click span by text */
  async clickSpanByText(spanText) {
    try {
      const span = page.locator(
        `//span[normalize-space(text())='${spanText}']`
      );
      await span.waitFor({ state: "visible", timeout: 5000 });
      await span.click();
      console.log(`Clicked on span: ${spanText}`);
    } catch (error) {
      throw new Error(
        `Failed to click on span '${spanText}': ${error.message}`
      );
    }
  }
}

module.exports = { EcommercePage };