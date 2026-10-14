import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADDRESS_STORAGE_KEY = "ecommerce-default-address";

const EMPTY_ADDRESS = {
  shippingName: "",
  streetName: "",
  city: "",
  state: "",
  country: "",
};

function AddressPage() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(() => {
    try {
      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);

      return savedAddress
        ? { ...EMPTY_ADDRESS, ...JSON.parse(savedAddress) }
        : { ...EMPTY_ADDRESS };
    } catch {
      return { ...EMPTY_ADDRESS };
    }
  });

  const [saveDefault, setSaveDefault] = useState(() => {
    try {
      return localStorage.getItem(ADDRESS_STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateAddress = () => {
    const nextErrors = {};

    const shippingName = address.shippingName.trim();
    const streetName = address.streetName.trim();
    const city = address.city.trim();
    const state = address.state.trim();
    const country = address.country.trim();

    // Require a first name and surname, both beginning with capitals.
    const namePattern =
      /^[A-Z][\p{L}\p{M}'’-]*(?:\s+[A-Z][\p{L}\p{M}'’-]*)+$/u;

    if (!shippingName) {
      nextErrors.shippingName = "Please enter your full name.";
    } else if (!namePattern.test(shippingName)) {
      nextErrors.shippingName =
        "Enter your first name and surname, both starting with capital letters.";
    }

    // Require a street number and street name.
    if (!streetName) {
      nextErrors.streetName = "Please enter your street address.";
    } else if (
      streetName.length < 5 ||
      !/\d/.test(streetName) ||
      !/\p{L}/u.test(streetName) ||
      !/[\s,]/.test(streetName)
    ) {
      nextErrors.streetName =
        "Enter a complete address, including the street number and name.";
    }

    // Allow letters, spaces, apostrophes, periods and hyphens in place names.
    const placePattern =
      /^[\p{L}\p{M}]+(?:[ .'-][\p{L}\p{M}]+)*$/u;

    if (!city) {
      nextErrors.city = "Please enter your city.";
    } else if (!placePattern.test(city)) {
      nextErrors.city =
        "Enter a valid city using letters, spaces or hyphens.";
    }

    if (!state) {
      nextErrors.state = "Please enter your state or province.";
    } else if (!placePattern.test(state)) {
      nextErrors.state = "Enter a valid state or province.";
    }

    if (!country) {
      nextErrors.country = "Please enter your country.";
    } else if (!placePattern.test(country)) {
      nextErrors.country = "Enter a valid country name.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAddress();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    const shippingAddress = {
      shippingName: address.shippingName.trim().replace(/\s+/g, " "),
      streetName: address.streetName.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      country: address.country.trim(),
    };

    // Persist the address only when the checkbox is selected.
    try {
      if (saveDefault) {
        localStorage.setItem(
          ADDRESS_STORAGE_KEY,
          JSON.stringify(shippingAddress)
        );
      } else {
        localStorage.removeItem(ADDRESS_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Unable to save the default address:", error);
    }

    navigate("/checkout", {
      state: {
        shippingAddress,
        saveDefault,
      },
    });
  };

  const inputClassName =
    "w-full min-w-0 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-md outline-none transition focus:border-[#1b2119]";

  const fields = [
    {
      id: "shippingName",
      label: "Shipping Name",
      placeholder: "John Maker",
      autoComplete: "name",
      maxLength: 100,
    },
    {
      id: "streetName",
      label: "Street Name",
      placeholder: "123 Main Street",
      autoComplete: "street-address",
      maxLength: 150,
    },
    {
      id: "city",
      label: "City",
      placeholder: "Johannesburg",
      autoComplete: "address-level2",
      maxLength: 80,
    },
    {
      id: "state",
      label: "State / Province",
      placeholder: "Gauteng",
      autoComplete: "address-level1",
      maxLength: 80,
    },
    {
      id: "country",
      label: "Country",
      placeholder: "South Africa",
      autoComplete: "country-name",
      maxLength: 80,
    },
  ];

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#e9e9e9] px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full max-w-[620px] min-w-0 rounded-xl bg-white px-5 py-6 sm:px-7 sm:py-7">
        <h1 className="mb-7 text-xl font-medium tracking-[0.18em] text-[#1b2119] sm:text-2xl">
          SHIPPING ADDRESS
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="min-w-0">
              <label
                htmlFor={field.id}
                className="mb-1.5 block text-[10px] text-gray-500"
              >
                {field.label}
              </label>

              <input
                id={field.id}
                name={field.id}
                type="text"
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={address[field.id]}
                onChange={handleChange}
                maxLength={field.maxLength}
                required
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={
                  errors[field.id] ? `${field.id}-error` : undefined
                }
                className={`${inputClassName} ${
                  errors[field.id]
                    ? "border-red-400 focus:border-red-500"
                    : ""
                }`}
              />

              {errors[field.id] && (
                <p
                  id={`${field.id}-error`}
                  role="alert"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}

          <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-[#1b2119]">
            <input
              type="checkbox"
              checked={saveDefault}
              onChange={(event) =>
                setSaveDefault(event.target.checked)
              }
              className="shrink-0 accent-[#168b69]"
            />
            <span>Save this as your default address</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-[#1b2119] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#30392d] focus:outline-none focus:ring-2 focus:ring-[#168b69] focus:ring-offset-2"
          >
            Add Address
          </button>

          <div className="flex items-center justify-between gap-3 px-1 pt-1 text-[10px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="shrink-0 text-gray-500 transition hover:text-gray-900"
            >
              Back
            </button>

            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-emerald-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5 shrink-0"
              >
                <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 7a2 2 0 0 1 4 0v2h-4V7Z" />
              </svg>

              Secure Connection
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddressPage;