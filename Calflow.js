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

// offerings 结构不同，放行
if (url.indexOf("/offerings") !== -1) {
  $done({});
}

// 产品映射
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

// 从 URL 取用户 ID
var uid = "_7cc0bd67f31f890ef28bef368bad9b08";
var m = url.match(/\/subscribers\/([^\/\?]+)/);
if (m && m[1]) uid = decodeURIComponent(m[1]);

var now = Date.now();
var iso = new Date(now).toISOString().replace(/\.\d{3}Z$/, "Z");
var pur = "2026-07-20T08:32:39Z";
// 终身：expires_date = null，部分旧版会当「永久会员」缓存更稳
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

// 年订 + 终身都写上（旧版有的只认其中一个）
body.subscriber.subscriptions[yearlyId] = subItem(expYearly, "normal");
body.subscriber.subscriptions[lifetimeId] = subItem(null, "normal");

// 权益挂在 lifetime 上，expires 为 null = 永久
body.subscriber.entitlements.pro = {
  grace_period_expires_date: null,
  purchase_date: pur,
  product_identifier: lifetimeId,
  expires_date: null
};

$done({ body: JSON.stringify(body) });
