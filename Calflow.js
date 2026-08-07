/*************************************
项目名称：Calflow
更新日期：2026-08-06
**************************************

[rewrite_local]
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/.+ url script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js 

[mitm]
hostname = api.rc-backup.com, api.revenuecat.com, *.rc-backup.com, *.revenuecat.com

*************************************/

/*************************************
项目名称：Calflow（旧版）
适配：Loon 3.5
说明：无通知；offerings 放行；subscribers/receipts 注入 Pro
*************************************/

var url = $request.url || "";

// offerings 原样放行
if (url.indexOf("/offerings") !== -1) {
  $done({});
}

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

// subscribers / receipts
var uid = "_7cc0bd67f31f890ef28bef368bad9b08";
var m = url.match(/\/subscribers\/([^\/\?]+)/);
if (m && m[1]) uid = decodeURIComponent(m[1]);

var productId = "kike.calflow.pro.yearly";
var exp = "2099-12-31T23:59:59Z";
var pur = "2026-07-26T13:14:19Z";
var now = Date.now();
var iso = new Date(now).toISOString().replace(/\.\d{3}Z$/, "Z");

var body = {
  request_date_ms: now,
  request_date: iso,
  subscriber: {
    non_subscriptions: {},
    first_seen: "2026-07-20T08:32:39Z",
    original_application_version: null,
    other_purchases: {},
    management_url: "https://apps.apple.com/account/subscriptions",
    subscriptions: {},
    entitlements: {},
    original_purchase_date: "2026-07-20T08:32:39Z",
    original_app_user_id: uid,
    last_seen: iso
  }
};

body.subscriber.subscriptions[productId] = {
  original_purchase_date: pur,
  purchase_date: pur,
  expires_date: exp,
  is_sandbox: false,
  refunded_at: null,
  store_transaction_id: "270003019445859",
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
  purchase_date: pur,
  product_identifier: productId,
  expires_date: exp
};

$done({ body: JSON.stringify(body) });
