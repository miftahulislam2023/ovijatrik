import crypto from "node:crypto";

type EpsTokenResponse = {
  token?: string;
  errorMessage?: string | null;
  errorCode?: string | null;
};

type EpsInitializeResponse = {
  RedirectURL?: string;
  RedirectUrl?: string;
  redirectUrl?: string;
  TransactionId?: string;
  ErrorMessage?: string;
  ErrorCode?: string | null;
};

type EpsVerifyResponse = {
  MerchantTransactionId?: string;
  EpsTransactionId?: string;
  Status?: string;
  TotalAmount?: string;
  FinancialEntity?: string;
  CustomerName?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createEpsHash(data: string) {
  const hashKey = getRequiredEnv("EPS_HASH_KEY");
  const hmac = crypto.createHmac("sha512", Buffer.from(hashKey, "utf8"));
  hmac.update(data, "utf8");
  return hmac.digest("base64");
}

function getEpsBaseUrl() {
  return process.env.EPS_BASE_URL?.trim() || "https://pgapi.eps.com.bd/v1";
}

export function getMerchantTransactionId() {
  const now = Date.now().toString();
  const random = crypto.randomInt(100, 999).toString();
  return `${now}${random}`;
}

export async function getEpsToken() {
  const userName = getRequiredEnv("EPS_USERNAME");
  const password = getRequiredEnv("EPS_PASSWORD");

  const response = await fetch(`${getEpsBaseUrl()}/Auth/GetToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hash": createEpsHash(userName),
    },
    body: JSON.stringify({ userName, password }),
    cache: "no-store",
  });

  const json = (await response.json()) as EpsTokenResponse;
  if (!response.ok || !json.token) {
    throw new Error(json.errorMessage || "EPS token request failed");
  }

  return json.token;
}

export async function initializeEpsPayment(params: {
  token: string;
  merchantTransactionId: string;
  customerOrderId: string;
  totalAmount: number;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  ipAddress: string;
}) {
  const payload = {
    merchantId: getRequiredEnv("EPS_MERCHANT_ID"),
    storeId: getRequiredEnv("EPS_STORE_ID"),
    CustomerOrderId: params.customerOrderId,
    merchantTransactionId: params.merchantTransactionId,
    transactionTypeId: 1,
    financialEntityId: 0,
    transitionStatusId: 0,
    totalAmount: params.totalAmount,
    ipAddress: params.ipAddress,
    version: "1",
    successUrl: params.successUrl,
    failUrl: params.failUrl,
    cancelUrl: params.cancelUrl,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerAddress: params.customerAddress,
    customerAddress2: "",
    customerCity: params.customerCity,
    customerState: params.customerCity,
    customerPostcode: "1200",
    customerCountry: params.customerCountry,
    customerPhone: params.customerPhone,
    shipmentName: params.customerName,
    shipmentAddress: params.customerAddress,
    shipmentAddress2: "",
    shipmentCity: params.customerCity,
    shipmentState: params.customerCity,
    shipmentPostcode: "1200",
    shipmentCountry: params.customerCountry,
    valueA: "ovijatrik",
    valueB: "donation",
    valueC: params.customerOrderId,
    valueD: "",
    shippingMethod: "NO",
    noOfItem: "1",
    productName: "Donation",
    productProfile: "general",
    productCategory: "Donation",
  };

  const response = await fetch(`${getEpsBaseUrl()}/EPSEngine/InitializeEPS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
      "x-hash": createEpsHash(params.merchantTransactionId),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = (await response.json()) as EpsInitializeResponse;
  const redirectUrl = json.RedirectURL || json.RedirectUrl || json.redirectUrl;

  if (!response.ok || !redirectUrl) {
    throw new Error(json.ErrorMessage || "EPS initialize request failed");
  }

  return {
    redirectUrl,
    transactionId: json.TransactionId,
  };
}

export async function verifyEpsPayment(params: {
  token: string;
  merchantTransactionId?: string | null;
  epsTransactionId?: string | null;
}) {
  const query = new URLSearchParams();

  if (params.merchantTransactionId) {
    query.set("merchantTransactionId", params.merchantTransactionId);
  }
  if (params.epsTransactionId) {
    query.set("EPSTransactionId", params.epsTransactionId);
  }

  const hashValue = params.merchantTransactionId || params.epsTransactionId;
  if (!hashValue) {
    throw new Error("Missing transaction id for EPS verification");
  }

  const response = await fetch(
    `${getEpsBaseUrl()}/EPSEngine/CheckMerchantTransactionStatus?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${params.token}`,
        "x-hash": createEpsHash(hashValue),
      },
      cache: "no-store",
    }
  );

  const json = (await response.json()) as EpsVerifyResponse;
  if (!response.ok) {
    throw new Error(json.ErrorMessage || "EPS verification request failed");
  }

  return json;
}
