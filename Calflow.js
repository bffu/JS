/*************************************

项目名称：Calflow
下载地址：https://too.st/7qA
更新日期：2026-03-22
脚本作者：@anyeyey
使用声明：⚠️仅供参考，转载与售卖！
**************************************

[rewrite_local]
^https?:\/\/api\.(rc-backup|revenuecat)\.com\/v1\/(subscribers|receipts)(\/|$|\?) url script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js

[mitm]
hostname = api.rc-backup.com, api.revenuecat.com

*************************************/


var anye = JSON.parse($response.body);

var productId = "kike.calflow.pro.yearly";
var entitlement = "pro";
var purchaseDate = "2026-01-13T06:05:00Z";
var expiresDate = "2099-01-20T06:05:00Z";

if (!anye.subscriber) {
  anye.subscriber = {};
}

var sub = anye.subscriber;

sub.subscriptions = sub.subscriptions || {};
sub.subscriptions[productId] = {
  "original_purchase_date": purchaseDate,
  "expires_date": expiresDate,
  "is_sandbox": false,
  "refunded_at": null,
  "store_transaction_id": "500001601363664",
  "unsubscribe_detected_at": null,
  "grace_period_expires_date": null,
  "period_type": "normal",
  "purchase_date": purchaseDate,
  "billing_issues_detected_at": null,
  "ownership_type": "PURCHASED",
  "store": "app_store",
  "auto_resume_date": null
};

sub.entitlements = sub.entitlements || {};
sub.entitlements[entitlement] = {
  "grace_period_expires_date": null,
  "purchase_date": purchaseDate,
  "product_identifier": productId,
  "expires_date": expiresDate
};

sub.non_subscriptions = sub.non_subscriptions || {};
sub.other_purchases = sub.other_purchases || {};
sub.management_url = sub.management_url || "https://apps.apple.com/account/subscriptions";

anye.request_date_ms = Date.now();
anye.request_date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

$done({ body: JSON.stringify(anye) });
