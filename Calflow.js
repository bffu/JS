/*
[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/bffu/Js/main/Calflow.js 

[mitm]
hostname = api.rc-backup.com

*************************************/

var raw = $response.body;
if (!raw) {
  $done({});
} else {
  try {
    var obj = JSON.parse(raw);

    // offerings 货架：不动
    if (obj.offerings || obj.current_offering_id) {
      $done({ body: raw });
    } else if (!obj.subscriber) {
      $done({ body: raw });
    } else {
      var far = "2099-12-31T23:59:59Z";
      var now = obj.request_date || "2026-08-06T14:55:54Z";
      var yearly = "kike.calflow.pro.yearly";
      var life = "kike.calflow.pro.lifetime";
      var sub0 = obj.subscriber;

      // —— 1. 年订：延期 + 清取消/退款 ——
      sub0.subscriptions = sub0.subscriptions || {};
      var sub = sub0.subscriptions[yearly] || {};
      sub.original_purchase_date = sub.original_purchase_date || "2026-07-26T13:14:19Z";
      sub.purchase_date = sub.purchase_date || "2026-07-26T13:14:19Z";
      sub.expires_date = far;
      sub.is_sandbox = false;
      sub.refunded_at = null;
      sub.store_transaction_id = sub.store_transaction_id || "270003019445859";
      sub.unsubscribe_detected_at = null;       // 关键：你原数据这里有值
      sub.grace_period_expires_date = null;
      sub.period_type = "normal";                // 关键：不要 trial
      sub.price = { amount: 98, currency: "CNY" };
      sub.display_name = sub.display_name || null;
      sub.billing_issues_detected_at = null;
      sub.ownership_type = "PURCHASED";
      sub.store = "app_store";
      sub.auto_resume_date = null;
      sub0.subscriptions[yearly] = sub;

      // —— 2. 终身购（双保险，对应 offerings 里的 lifetime）——
      sub0.non_subscriptions = sub0.non_subscriptions || {};
      sub0.non_subscriptions[life] = [
        {
          id: "cta_life_" + (sub.store_transaction_id || "1"),
          is_sandbox: false,
          original_purchase_date: now,
          purchase_date: now,
          store: "app_store",
          store_transaction_id: sub.store_transaction_id || "270003019445859"
        }
      ];

      // —— 3. entitlements.pro（多数 App 只认这个）——
      sub0.entitlements = sub0.entitlements || {};
      sub0.entitlements.pro = {
        grace_period_expires_date: null,
        purchase_date: sub.purchase_date,
        product_identifier: yearly,
        expires_date: far
      };

      // 保留原用户身份，千万别改：
      // sub0.original_app_user_id
      // obj.request_date / request_date_ms

      $done({ body: JSON.stringify(obj) });
    }
  } catch (e) {
    $done({ body: raw });
  }
}
