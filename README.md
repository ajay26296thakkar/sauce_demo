## Overview
This document explains the simplified checkout test for the Saucedemo website.

## Test File
`tests/checkout-flow.spec.ts`

## What the Test Does
The test automates a complete customer checkout flow:

1. **Login** - Logs into the application with standard user credentials
2. **Add Items** - Randomly selects and adds 3 items to the shopping cart
3. **View Cart** - Navigates to cart and verifies all items are present
4. **Checkout** - Proceeds to checkout and fills in customer information
5. **Review Order** - Verifies order summary with items and pricing
6. **Complete Purchase** - Finalizes the order and confirms success

## Running the Test

### Headless Mode (No Browser Window)
```bash
npx playwright test tests/checkout-flow.spec.ts
```

### Headed Mode (See Browser Actions)
```bash
npx playwright test tests/checkout-flow.spec.ts --headed
```

### Debug Mode (Step Through Test)
```bash
npx playwright test tests/checkout-flow.spec.ts --debug
```

## Test Features

- ✅ **Random Item Selection** - Picks 3 different items each run
- ✅ **Visual Delays** - 1-second pauses between steps for visibility
- ✅ **Comprehensive Assertions** - Validates each step of the flow
- ✅ **Console Logging** - Shows which items are being added
- ✅ **Single Test Block** - All logic in one continuous flow

## Viewing Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test execution timeline
- Screenshots (on failure)
- Videos (on failure)
- Detailed logs

## Page Objects Used

- **LoginPage** - Handles authentication
- **InventoryPage** - Manages product selection
- **CartPage** - Reviews cart contents
- **CheckoutPage** - Processes checkout and order completion
