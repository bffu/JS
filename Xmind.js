/**
[rewrite_local]

# 拦截 Xmind 的 App Store 激活地址
^http[s]?:\/\/www.xmind.app\/_api\/appstore\/active url script-response-body Xmind.js

[mitm] 

# 启用对新域名的 MITM
hostname = www.xmind.app
**/
var body = $response.body.replace(/.+/g, `{
  "status": "ok",
  "deviceId": "09DA9FCA-A929-402A-B39D-F477E1F8D9A9",
  "bindXmind": 1,
  "subscriptionStatus": "ACTIVATED",
  "_code": 200,
  "originalTransactionID": "FAKE_PRO_ID",
  "expireTime": 4070088000000, 
  "receiptId": "7886bb3d279ad652837ab71e28231743",
  "requestId": "F8E4BDBC-28F6-4E01-9574-E86AC2C79146",
  "is_pro": true 
}`);

// 3. 脚本执行完成：
$done({'body': body});
