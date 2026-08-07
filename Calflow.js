/*************************************

项目名称：Calflow
更新日期：2026-08-06
脚本说明：旧版 Pro · 无通知 · offerings 放行 · lifetime/yearly
使用声明：⚠️仅供参考
**************************************

[rewrite_local]
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/ url script-request-header https://raw.githubusercontent.com/bffu/Js/main/Calflow.js
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/ url script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js

[mitm]
hostname = api.rc-backup.com, api.revenuecat.com

*************************************/

// 请求：去掉条件缓存
if (typeof $response === "undefined") {
  var h = $request.headers || {};
  var keys = Object.keys(h);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var low = k.toLowerCase();
    if (
      low === "if-none-match" ||
      low === "if-modified-since" ||
      low === "if-range"
    ) {
      delete h[k];
    }
  }
  $done({ headers: h });
}

// 响应
var url = $request.url || "";

if (url.indexOf("/offerings") !== -1) {
  $done({});
}

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

var uid = "_7cc0bd67f31f890ef28bef368bad9b08";
var m = url.match(/\/subscribers\/([^\/\?]+)/);
if (m && m[1]) uid = decodeURIComponent(m[1]);

var now = Date.now();
var iso = new Date(now).toISOString().replace(/\.\d{3}Z$/, "Z");
var pur = "2026-07-20T08:32:39Z";
var lifetimeId = "kike.calflow.pro.lifetime";
var yearlyId = "kike.calflow.pro.yearly";
var expYearly = "2099-12-31T23:59:59Z";
var tx = "270003019445859";

function subItem(expires, period) {
  return {
    original_purchase_date: pur,
    purchase_date: pur,
    expires_date: expires,
    is_sandbox: false,
    refunded_at: null,
    store_transaction_id: tx,
    unsubscribe_detected_at: null,
    grace_period_expires_date: null,
    period_type: period,
    price: { amount: expires ? 58 : 128, currency: "CNY" },
    display_name: null,
    billing_issues_detected_at: null,
    ownership_type: "PURCHASED",
    store: "app_store",
    auto_resume_date: null
  };
}

var body = {
  request_date_ms: now,
  request_date: iso,
  subscriber: {
    non_subscriptions: {
      "kike.calflow.pro.lifetime": [
        {
          id: tx + "_lt",
          is_sandbox: false,
          purchase_date: pur,
          original_purchase_date: pur,
          store: "app_store",
          store_transaction_id: tx + "1"
        }
      ]
    },
    first_seen: pur,
    original_application_version: null,
    other_purchases: {
      "kike.calflow.pro.lifetime": {
        purchase_date: pur
      }
    },
    management_url: "https://apps.apple.com/account/subscriptions",
    subscriptions: {},
    entitlements: {},
    original_purchase_date: pur,
    original_app_user_id: uid,
    last_seen: iso
  }
};

body.subscriber.subscriptions[yearlyId] = subItem(expYearly, "normal");
body.subscriber.subscriptions[lifetimeId] = subItem(null, "normal");

body.subscriber.entitlements.pro = {
  grace_period_expires_date: null,
  purchase_date: pur,
  product_identifier: lifetimeId,
  expires_date: null
};

$done({ body: JSON.stringify(body) });
