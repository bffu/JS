/*************************************
项目名称：Calflow
更新日期：2026-08-06
**************************************

[rewrite_local]
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/.+ script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js 

[mitm]
hostname = api.rc-backup.com, api.revenuecat.com, *.rc-backup.com, *.revenuecat.com

*************************************/

var url = $request.url || "";
var status = ($response && $response.status) || 200;

// 命中就弹，确认有没有漏网请求
try {
  $notify("Calflow", "hit", url);
} catch (e) {}

var productId = "kike.calflow.pro.yearly";
var expiresDate = "2099-12-31T23:59:59Z";
var purchaseDate = "2026-07-26T13:14:19Z";
var txId = "270003019445859";
var uid = "$RCAnonymousID:b8b6bb58d8974158bd79ea32383ea31b";

var nowMs = Date.now();
var nowIso = new Date(nowMs).toISOString().replace(/\.\d{3}Z$/, "Z");

// ---------- mapping ----------
if (url.indexOf("product_entitlement_mapping") !== -1) {
  $done({
    status: status,
    headers: $response.headers,
    body: JSON.stringify({
      product_entitlement_mapping: {
        "kike.calflow.pro.lifetime": {
          product_identifier: "kike.calflow.pro.lifetime",
          entitlements: ["pro"]
        },
        "kike.calflow.pro.monthly": {
          product_identifier: "kike.calflow.pro.monthly",
          entitlements: ["pro"]
        },
        "kike.calflow.pro.yearly": {
          product_identifier: "kike.calflow.pro.yearly",
          entitlements: ["pro"]
        }
      }
    })
  });
}

// ---------- 其它全部当 subscriber 响应整包替换 ----------
// 不再 merge，避免残留 unsubscribe / trial / 旧 expires
var body = {
  request_date_ms: nowMs,
  request_date: nowIso,
  subscriber: {
    non_subscriptions: {},
    first_seen: "2026-07-20T08:32:39Z",
    original_application_version: "785",
    other_purchases: {},
    management_url: "https://apps.apple.com/account/subscriptions",
    subscriptions: {},
    entitlements: {},
    original_purchase_date: "2026-07-20T08:32:39Z",
    original_app_user_id: uid,
    last_seen: nowIso
  }
};

body.subscriber.subscriptions[productId] = {
  original_purchase_date: purchaseDate,
  purchase_date: purchaseDate,
  expires_date: expiresDate,
  is_sandbox: false,
  refunded_at: null,
  store_transaction_id: txId,
  unsubscribe_detected_at: null,
  grace_period_expires_date: null,
  period_type: "normal",
  price: { amount: 58, currency: "CNY" },
  display_name: null,
  billing_issues_detected_at: null,
  ownership_type: "PURCHASED",
  store: "app_store",
  auto_resume_date: null
};

body.subscriber.entitlements.pro = {
  grace_period_expires_date: null,
  purchase_date: purchaseDate,
  product_identifier: productId,
  expires_date: expiresDate
};

// 部分 SDK 还会读 lifetime 形态，一并塞一份（不影响 yearly）
body.subscriber.subscriptions["kike.calflow.pro.lifetime"] = {
  original_purchase_date: purchaseDate,
  purchase_date: purchaseDate,
  expires_date: null,
  is_sandbox: false,
  refunded_at: null,
  store_transaction_id: txId + "1",
  unsubscribe_detected_at: null,
  grace_period_expires_date: null,
  period_type: "normal",
  price: { amount: 128, currency: "CNY" },
  display_name: null,
  billing_issues_detected_at: null,
  ownership_type: "PURCHASED",
  store: "app_store",
  auto_resume_date: null
};

$done({
  status: 200,
  headers: $response.headers,
  body: JSON.stringify(body)
});
