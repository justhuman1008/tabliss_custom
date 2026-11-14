import React from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import { db } from "../db/state";
import { useValue } from "../lib/db/react";
import { messages, normalizeLocale } from "./locales";

const IntlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const locale = normalizeLocale(useValue(db, "locale"));

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
