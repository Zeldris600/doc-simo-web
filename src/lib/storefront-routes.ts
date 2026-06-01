/** Storefront paths used across checkout, account, and navigation. */
export const storefrontRoutes = {
  home: "/",
  products: "/products",
  cart: "/cart",
  account: "/account",
  accountOrders: "/account?tab=orders",
  accountSettings: "/account/settings",
  accountSettingsNotifications: "/account/settings#notifications",
  checkoutSuccess: "/checkout/success",
  checkoutOrder: (orderId: string) => `/checkout/${orderId}`,
} as const;

export const ACCOUNT_TABS = [
  "orders",
  "favourites",
  "profile",
  "alerts",
] as const;

export type AccountTab = (typeof ACCOUNT_TABS)[number];

export function isAccountTab(value: string | null): value is AccountTab {
  return value !== null && (ACCOUNT_TABS as readonly string[]).includes(value);
}
