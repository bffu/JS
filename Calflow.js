/*************************************
项目名称：Calflow
更新日期：2026-08-06
**************************************

[rewrite_local]
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/.+ url script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js 

[mitm]
hostname = api.rc-backup.com, api.revenuecat.com, *.rc-backup.com, *.revenuecat.com

*************************************/

var url = $request.url || "";
var raw = $response.body;
var obj = {};

try {
  obj = JSON.parse(raw);
} catch (e) {
  obj = {};
}

$notification.post("Calflow", "hit", url);

var productId = "kike.calflow.pro.yearly";
var expiresDate = "2099-12-31T23:59:59Z";
var purchaseDate = "2026-07-26T13:14:19Z";
var txId = "270003019445859";
var nowMs = Date.now();
var nowIso = new Date(nowMs).toISOString().replace(/\.\d{3}Z$/, "Z");

// product_entitlement_mapping
if (url.indexOf("product_entitlement_mapping") !== -1) {
  $done({
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

// receipts / subscribers / 其它 RC 接口：整包替换
var uid =
  (obj.subscriber && obj.subscriber.original_app_user_id) ||
  "$RCAnonymousID:b8b6bb58d8974158bd79ea32383ea31b";

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

$done({ body: JSON.stringify(body) });
