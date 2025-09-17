/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

// ** Checks if the passed date is today
const isToday = (date: Date) => {
  const today = new Date();

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  );
};

export const formatDate = (
  value: string | Date,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;

  return new Intl.DateTimeFormat(
    "en-US",
    formatting as Intl.DateTimeFormatOptions
  ).format(new Date(value));
};

export const formatDay = (date: string | Date) => {
  // Check if date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // If not, return a default value or handle the situation as needed
    const options = {
      weekday: "short" as "short",
      day: "numeric" as "numeric",
    };

    if (typeof date === "string") {
      const day = date.slice(7, 10);
      const currentDay = date.slice(4);

      const newDate = new Date(`${day}-${currentDay}`);
      return newDate.toLocaleDateString("en-US", options);
    } else {
      return date.toLocaleDateString("en-US", options);
    }
  }

  const options = { weekday: "short" as "short", day: "numeric" as "numeric" };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (
  value: string | Date,
  toTimeForCurrentDay = true
) => {
  const date = new Date(value);
  let formatting = {
    month: "short",
    day: "numeric",
  };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { ...formatting };
  }

  return new Intl.DateTimeFormat(
    "en-US",
    formatting as Intl.DateTimeFormatOptions
  ).format(new Date(value));
};

// ? The following functions are taken from https://codesandbox.io/s/ovvwzkzry9?file=/utils.js for formatting credit card details
// Get only numbers from the input value
const clearNumber = (value = "") => {
  return value.replace(/\D+/g, "");
};

// Format credit cards according to their types
export const formatCreditCardNumber = (
  value: string,
  Payment: {
    fns: {
      cardType: (value: string) => string;
    };
  }
) => {
  if (!value) {
    return value;
  }
  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;
  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
};

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, "0$1/") // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, "$1/") // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, "0$1/$2") // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, "$1/$2") // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, "0") // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, "")
    .replace(/\/\//g, "/"); // Prevent entering more than 1 `/`

  return finalValue;
};

// Format CVC in any credit card
export const formatCVC = (
  value: string,
  cardNumber: number,
  Payment: {
    fns: {
      cardType: (value: string) => string;
    };
  }
) => {
  const clearValue = clearNumber(value);
  const issuer = Payment.fns.cardType(cardNumber.toString());
  const maxLength = issuer === "amex" ? 4 : 3;

  return clearValue.slice(0, maxLength);
};

export const formatFirstLetter = (letter: string) => {
  if (letter) {
    const formattedString = letter[0].toUpperCase() + letter.slice(1);

    return formattedString;
  } else {
    return "";
  }
};

export const formatAndReturnFirstLetter = (letter: string) => {
  const formattedString = letter[0].toUpperCase();

  return formattedString;
};

export const formatDateToYYYYMM = (dateString: string | Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const formattedDate = `${year}${month}`;

  return formattedDate;
};

export const formatDateToYYYY = (dateString: string | Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();

  // const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
  const formattedDate = `${year}`;

  return formattedDate;
};

export const formatMonthYear = (date: string | Date) => {
  // Check if date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // If not, return a default value or handle the situation as needed
    const options = { month: "long" as "long", year: "numeric" as "numeric" };

    if (typeof date === "string") {
      const year = date.slice(0, 4);
      const month = date.slice(4);

      const newDate = new Date(`${year}-${month}-01`); // Assuming day is always the first of the month
      return newDate.toLocaleDateString("en-US", options);
    } else {
      return date.toLocaleDateString("en-US", options);
    }
  }

  const options = { month: "long" as "long", year: "numeric" as "numeric" };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

export const parseClass = (item: string) => {
  if (item === "off" || !item || item === "") {
    return "bg-info";
  } else if (item === "morning") {
    return "bg-primary";
  } else if (item === "night" || "evening") {
    return "bg-danger";
  } else {
    return "bg-secondary";
  }
};

interface RosterItem {
  title: string;
  date: string;
  className?: string;
  // Add other properties as needed
}

interface Schedule {
  duty: string;
  date: string;
  user?: string;
  period?: string;
  // Add other properties as needed
}
export const parseRoster = (
  result: {
    schedule: string;
    period: string;
    user: { firstname: string; lastname: string };
  }[]
) => {
  let rosters: RosterItem[] = [];
  result.forEach((item) => {
    const parsedSchedule = item.schedule ? JSON.parse(item.schedule) : [];

    parsedSchedule.forEach((schedule: Schedule) => {
      if (schedule.duty !== "") {
        rosters = [
          ...rosters,
          {
            title: ` ${formatFirstLetter(
              item.user.firstname
            )} ${formatAndReturnFirstLetter(item.user?.lastname)}  ${
              schedule.duty ? "[" + schedule.duty + "]" : ""
            }`,
            date: `${item.period.substring(0, 4)}-${item.period?.substring(
              4
            )}-${
              schedule.date !== ""
                ? schedule.date?.toString().padStart(2, "0")
                : ""
            }`,

            className: parseClass(schedule.duty),
          },
        ];
      }
    });
  });

  return rosters;
};

export const getFirstId = (arrayOfObjects: { id: string }[]) => {
  for (const obj of arrayOfObjects) {
    if (obj && obj.id !== undefined) {
      return obj.id;
    }
  }

  // Return a default value (or throw an error) if no id is found
  return null;
};

export const formatCurrency = (amount: number, abs: boolean) => {
  if (!amount) {
    return `₦0.0`;
  } else if (amount) {
    const formattedAmount = Number(amount);

    return `₦${(abs
      ? Math.abs(formattedAmount)
      : formattedAmount
    ).toLocaleString()}`;
  }
};

export const formatNumber = (value: number, abs?: boolean) => {
  if (!value) {
    return `0`;
  } else if (value) {
    const formattedValue = Number(value);

    return `${(abs
      ? Math.abs(formattedValue)
      : formattedValue
    ).toLocaleString()}`;
  }
};

export const getCurrency = () => {
  return { symbol: "₦" };
};
