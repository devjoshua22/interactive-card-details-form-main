// Wait until the page finishes loading before running any code
document.addEventListener("DOMContentLoaded", () => {

  // === Grab input fields from the form ===
  const cardNameInput = document.getElementById("Cardholder-name"); // Input where user types their name
  const cardNumberInput = document.getElementById("Card-number");   // Input for card number
  const monthInput = document.getElementById("month");              // Input for expiry month
  const yearInput = document.getElementById("year");                // Input for expiry year
  const cvcInput = document.getElementById("cvc");                  // Input for CVC code

  // === Grab display placeholders (the "fake card" preview on screen) ===
  const cardNameDisplay = document.getElementById("card-name-display");     // Shows cardholder name
  const cardNumberDisplay = document.getElementById("card-number-display"); // Shows card number
  const expiryDisplay = document.getElementById("expiry-display");          // Shows expiry date
  const cvcDisplay = document.getElementById("cvc-display");                // Shows CVC

  // === Grab error message containers (hidden until needed) ===
  const nameError = document.getElementById("name-error");
  const cardNumError = document.getElementById("Card-number-error");
  const monthError = document.getElementById("month-error");
  const yearError = document.getElementById("year-error");
  const cvvError = document.getElementById("cvv-error");

  // === Function: format card number with spaces every 4 digits ===
  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "")          // Remove anything that's not a digit
      .replace(/(.{4})/g, "$1 ")   // Add a space after every 4 digits
      .trim();                     // Remove space at the end
  }

  // === Function: Luhn algorithm to check if card number is valid ===
  function isValidCardNumber(number) {
    let sum = 0;             // Sum of all digits after Luhn processing
    let shouldDouble = false; // Flag to decide when to double a digit

    // Loop over digits from right → left
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i)); // Get the digit at position i

      if (shouldDouble) {
        digit *= 2;          // Double the digit
        if (digit > 9) digit -= 9; // If > 9, subtract 9 (Luhn trick)
      }

      sum += digit;          // Add digit to total
      shouldDouble = !shouldDouble; // Flip flag (every other digit)
    }

    // Card is valid if total sum ends in 0
    return sum % 10 === 0;
  }

  // === Cardholder Name field ===
  cardNameInput.addEventListener("input", () => {
    // Allow only letters + spaces
    let value = cardNameInput.value.replace(/[^a-zA-Z\s]/g, "");
    cardNameInput.value = value;

    // Show typed name on fake card, or fallback if empty
    cardNameDisplay.textContent = value || "Jane Appleseed";

    // Validation: name can't be blank
    if (!value.trim()) {
      nameError.textContent = "Can't be blank";
      nameError.classList.remove("hidden"); // Show error
      cardNameInput.classList.add("border-red-500")
      cardNameInput.classList.add("error-focus")
    } 
     else {
      nameError.classList.add("hidden");    // Hide error
      cardNameInput.classList.remove("border-red-500")
      cardNameInput.classList.remove("error-focus")
    }
  });

  // === Card Number field ===
  cardNumberInput.addEventListener("input", () => {
    // Remove anything not a digit
    let rawValue = cardNumberInput.value.replace(/\D/g, "");

    // Format with spaces every 4 digits
    cardNumberInput.value = formatCardNumber(rawValue);

    // Show on fake card
    cardNumberDisplay.textContent = cardNumberInput.value || "0000 0000 0000 0000";

    // Validation: must be 16 digits + pass Luhn check
    if (rawValue.length < 14) {
      cardNumberInput.classList.add("error-focus");
      cardNumberInput.classList.add("border-red-500"); // Red border = error
      cardNumError.textContent = "Card number must be 14 digits";
      cardNumError.classList.remove("hidden"); // Show error
    } else if (!isValidCardNumber(rawValue)) {
      cardNumberInput.classList.add("error-focus");
      cardNumberInput.classList.add("border-red-500");
      cardNumError.textContent = "Invalid card number";
      cardNumError.classList.remove("hidden");
    } else {
      cardNumberInput.classList.remove("error-focus");
      cardNumberInput.classList.remove("border-red-500"); // Remove error styling
      cardNumError.classList.add("hidden");               // Hide error
    }
  });

  // === Expiry Date field ===
  function validateExpiry() {
     let valueMonth = monthInput.value.replace(/\D/g, "");
     let valueYear = yearInput.value.replace(/\D/g, "");
     monthInput.value = valueMonth;
     yearInput.value = valueYear
    let month = parseInt(monthInput.value, 10); // Convert month to number
    let year = parseInt(yearInput.value, 10);   // Convert year to number

    // Check month is between 1 and 12
    if (!month || month < 1 || month > 12) {
      monthError.classList.remove("hidden");
      monthInput.classList.add("border-red-500");
      monthInput.classList.add("error-focus");
    } 
    else {
      monthError.classList.add("hidden");
      monthInput.classList.remove("border-red-500");
      monthInput.classList.remove("error-focus");
    }

    // Check year is between 0 and 99 (basic check only)
    if (!year || year < 0 || year > 99) {
      yearError.classList.remove("hidden");
      yearInput.classList.add("border-red-500");
      yearInput.classList.add("error-focus");
    } else {
      yearError.classList.add("hidden");
      yearInput.classList.remove("border-red-500");
      yearInput.classList.remove("error-focus");
    }

    // Show expiry date on fake card (default "00/00" if blank)
    expiryDisplay.textContent =
      (monthInput.value || "00") + "/" + (yearInput.value || "00");
  }

  // Validate expiry date whenever user types month/year
  monthInput.addEventListener("input", validateExpiry);
  yearInput.addEventListener("input", validateExpiry);

  // === CVC field ===
  cvcInput.addEventListener("input", () => {
    // Only allow digits
    let value = cvcInput.value.replace(/\D/g, "");
    cvcInput.value = value;

    // Show on fake card back
    cvcDisplay.textContent = value || "000";

    // Must be exactly 3 digits
    if (value.length !== 3) {
      cvcInput.classList.add("border-red-500");
      cvvError.classList.remove("hidden"); // Show error
    } else {
      cvcInput.classList.remove("border-red-500");
      cvvError.classList.add("hidden");    // Hide error
    }
  });
  let restBtn = document.getElementById('reset');
  const form = document.getElementById('ticket-form');
  // const formContent = document.getElementById('content');
form.addEventListener('submit', (e) => {
    e.preventDefault();       
    let rawValue = cardNumberInput.value.replace(/\D/g, "");
    let complete = document.getElementById('thank-you-section');
    let month = parseInt(monthInput.value, 10); // Convert month to number
    let year = parseInt(yearInput.value, 10);   // Convert year to number

    let isValid = true; // Flag to track if all validations pass
     // -------- Reset all borders and error messages before re-checking --------
      yearError.classList.add("hidden");
      yearInput.classList.remove("border-red-600");
      yearInput.classList.remove("error-focus");
       monthError.classList.add("hidden");
      monthInput.classList.remove("border-red-500");
      monthInput.classList.remove("error-focus");


    if (!cardNameInput.value) {
      nameError.textContent = "Can't be blank";
      nameError.classList.remove("hidden"); // Show error
      cardNameInput.classList.add("border-red-500");
      cardNameInput.classList.add("error-focus");
      //console.log('empty')
      isValid = false
    } 
    if (rawValue.length < 14 || !isValidCardNumber(rawValue) ) {
      cardNumberInput.classList.add("error-focus");
      cardNumberInput.classList.add("border-red-500");
      cardNumError.textContent = "Invalid card number";
      cardNumError.classList.remove("hidden");
      isValid = false
    }
    if (!month || month < 1 || month > 12){
      monthError.classList.remove("hidden");
      monthInput.classList.add("border-red-500");
      monthInput.classList.add("error-focus");
      isValid = false
    }
    if (!year || year < 0 || year > 99){
      yearError.classList.remove("hidden");
      yearInput.classList.add("border-red-500");
      yearInput.classList.add("error-focus");
      isValid = false
    }
    if (cvcInput.value.length !== 3) {
      cvcInput.classList.add("border-red-500");
      cvvError.classList.remove("hidden"); // Show error
    }
      // -------- If all checks pass  --------
  if (isValid) {
    form.classList.add('hidden');
    complete.classList.remove('hidden');
  }

})
   restBtn.addEventListener('click', () => {
      location.reload()
    })
});
