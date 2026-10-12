
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PAYMENT_STORAGE_KEY = "ecommerce-default-payment";

const SAVED_CARDS = [
  { id: "mastercard-4242", label: "MasterCard ending in 4242" },
  { id: "visa-2894", label: "VISA Debit ending in 2894" },
];

const initialCardForm = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
};

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.match(/.{1,4}/g)?.join(" ") ?? "";
}

function formatExpiryDate(value) {
  let digits = value.replace(/\D/g, "").slice(0, 6);

  if (digits.length === 1 && Number(digits) > 1) {
    digits = `0${digits}`;
  }

  if (digits.length >= 2) {
    let month = Number(digits.slice(0, 2));

    if (month < 1) month = 1;
    if (month > 12) month = 12;

    digits = String(month).padStart(2, "0") + digits.slice(2);
  }

  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}

function passesLuhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  let sum = 0;
  let doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);

    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

function CardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0 text-[#858a83]"
    >
      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 4v2h18V9H3Zm3 5v2h5v-2H6Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 7a2 2 0 0 1 4 0v2h-4V7Z" />
    </svg>
  );
}

function PaymentPage() {
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = useState("");
  const [cardForm, setCardForm] = useState(initialCardForm);
  const [saveDefault, setSaveDefault] = useState(() => {
    try {
      return localStorage.getItem(PAYMENT_STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  });
  const [errors, setErrors] = useState({});

  const updateCardForm = (field, value) => {
    setCardForm((previous) => ({ ...previous, [field]: value }));
    setSelectedCard("");
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validateNewCard = () => {
    const nextErrors = {};
    const name = cardForm.cardholderName.trim();
    const nameParts = name.split(/\s+/);

    if (
      !name ||
      nameParts.length < 2 ||
      !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(name)
    ) {
      nextErrors.cardholderName =
        "Enter your first name and surname using letters only.";
    }

    const digits = cardForm.cardNumber.replace(/\D/g, "");

    if (
      digits.length < 13 ||
      digits.length > 19 ||
      !passesLuhnCheck(digits)
    ) {
      nextErrors.cardNumber = "Enter a valid card number.";
    }

    const expiryMatch = cardForm.expiryDate.match(
      /^(0[1-9]|1[0-2])\/(\d{4})$/
    );

    if (!expiryMatch) {
      nextErrors.expiryDate = "Enter the expiry date as MM/YYYY.";
    } else {
      const month = Number(expiryMatch[1]);
      const year = Number(expiryMatch[2]);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        nextErrors.expiryDate = "This card has expired.";
      } else if (year > currentYear + 15) {
        nextErrors.expiryDate =
          "Please enter a realistic card expiry date.";
      }
    }

    if (!/^\d{3}$/.test(cardForm.cvc)) {
      nextErrors.cvc = "Enter the 3-digit CVC shown on your card.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedCard) {
      const nextErrors = validateNewCard();
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        document.getElementById(Object.keys(nextErrors)[0])?.focus();
        return;
      }
    } else {
      setErrors({});
    }

    const paymentMethod = selectedCard
      ? {
          type: "saved-card",
          label: SAVED_CARDS.find((card) => card.id === selectedCard)?.label,
        }
      : {
          type: "new-card",
          cardholderName: cardForm.cardholderName.trim(),
          last4: cardForm.cardNumber.replace(/\D/g, "").slice(-4),
          expiryDate: cardForm.expiryDate,
          label: `Card ending in ${cardForm.cardNumber
            .replace(/\D/g, "")
            .slice(-4)}`,
        };

    try {
      if (saveDefault) {
        localStorage.setItem(
          PAYMENT_STORAGE_KEY,
          JSON.stringify({
            type: paymentMethod.type,
            label: paymentMethod.label,
            ...(paymentMethod.last4
              ? { last4: paymentMethod.last4 }
              : {}),
          })
        );
      } else {
        localStorage.removeItem(PAYMENT_STORAGE_KEY);
      }
    } catch {
      // Checkout can continue if local storage is unavailable.
    }

    navigate("/checkout", { state: { paymentMethod } });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-700 shadow-[0_-1px_3px_rgba(0,0,0,0.03),0_4px_8px_rgba(0,0,0,0.12)] outline-none transition focus:border-[#1b2119]";

  const renderError = (field) =>
    errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="mt-1 text-[10px] text-red-600"
      >
        {errors[field]}
      </p>
    ) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e9e9] px-4 py-2 sm:py-3 py-6 lg:py-0">
      <section className="w-full max-w-[875px] p-2 sm:p-10">
        <div className="mx-auto w-full max-w-[620px] space-y-6">
          <section className="rounded-lg bg-white px-4 py-4 sm:px-6">
            <h1 className="mb-4 text-xl font-medium tracking-[0.18em] text-[#1b2119]">
              SELECT A CARD
            </h1>

            {SAVED_CARDS.map((card) => (
              <label
                key={card.id}
                className="flex cursor-pointer items-center gap-3 py-2 text-xs text-gray-500"
              >
                <input
                  type="radio"
                  name="savedCard"
                  value={card.id}
                  checked={selectedCard === card.id}
                  onChange={() => {
                    setSelectedCard(card.id);
                    setErrors({});
                  }}
                  className="accent-[#168b69]"
                />
                <CardIcon />
                {card.label}
              </label>
            ))}

            <label className="flex cursor-pointer items-center gap-3 py-2 text-xs text-gray-500">
              <input
                type="radio"
                name="savedCard"
                value=""
                checked={!selectedCard}
                onChange={() => {
                  setSelectedCard("");
                  setErrors({});
                }}
                className="accent-[#168b69]"
              />
              <span>Use a new card</span>
            </label>
          </section>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-lg bg-white px-4 py-5 sm:px-6"
          >
            <h2 className="mb-5 text-xl font-medium tracking-[0.18em] text-[#1b2119]">
              ADD A NEW CARD
            </h2>

            <fieldset
              disabled={Boolean(selectedCard)}
              className="space-y-4 disabled:opacity-50"
            >
              <div>
                <label
                  htmlFor="cardholderName"
                  className="mb-1.5 block text-[10px] text-gray-500"
                >
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="John Maker"
                  value={cardForm.cardholderName}
                  onChange={(event) =>
                    updateCardForm("cardholderName", event.target.value)
                  }
                  maxLength={50}
                  aria-invalid={Boolean(errors.cardholderName)}
                  className={inputClass}
                />
                {renderError("cardholderName")}
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-1.5 block text-[10px] text-gray-500"
                >
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="5126 5987 2214 7621"
                  value={cardForm.cardNumber}
                  onChange={(event) =>
                    updateCardForm(
                      "cardNumber",
                      formatCardNumber(event.target.value)
                    )
                  }
                  maxLength={23}
                  aria-invalid={Boolean(errors.cardNumber)}
                  className={inputClass}
                />
                {renderError("cardNumber")}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label
                    htmlFor="expiryDate"
                    className="mb-1.5 block text-[10px] text-gray-500"
                  >
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YYYY"
                    value={cardForm.expiryDate}
                    onChange={(event) =>
                      updateCardForm(
                        "expiryDate",
                        formatExpiryDate(event.target.value)
                      )
                    }
                    maxLength={7}
                    aria-invalid={Boolean(errors.expiryDate)}
                    className={inputClass}
                  />
                  {renderError("expiryDate")}
                </div>

                <div>
                  <label
                    htmlFor="cvc"
                    className="mb-1.5 block text-[10px] text-gray-500"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={cardForm.cvc}
                    onChange={(event) =>
                      updateCardForm(
                        "cvc",
                        event.target.value.replace(/\D/g, "").slice(0, 3)
                      )
                    }
                    maxLength={3}
                    aria-invalid={Boolean(errors.cvc)}
                    className={inputClass}
                  />
                  {renderError("cvc")}
                </div>
              </div>
            </fieldset>

            {selectedCard && (
              <p className="mt-3 text-[10px] text-gray-500">
                A saved card is selected. Choose “Use a new card” above to
                enter different card details.
              </p>
            )}

            <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-[#1b2119]">
              <input
                type="checkbox"
                checked={saveDefault}
                onChange={(event) => setSaveDefault(event.target.checked)}
                className="accent-[#168b69]"
              />
              Save this as your default payment method
            </label>

            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-md bg-[#1b2119] px-4 py-[7px] text-[11px] font-medium text-white transition hover:bg-[#30382d] focus:outline-none focus:ring-2 focus:ring-[#168b69] focus:ring-offset-2"
            >
              <svg
               aria-hidden="true"
               viewBox="0 0 24 24"
               fill="currentColor"
               className="h-3.5 w-3.5 text-white"
              >
              <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 4v2h18V9H3Zm3 5v2h5v-2H6Z" />
              </svg>
             <span>Add Payment Method</span>
            </button>

            <div className="mt-6 flex items-center justify-between text-[10px]">
              <button
                type="button"
                onClick={() => navigate("/checkout/address")}
                className="text-[#1b2119] hover:underline"
              >
                Back
              </button>

              <span className="flex items-center gap-1.5 text-emerald-500">
                <LockIcon />
                Secure Connection
              </span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
