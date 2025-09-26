/*
 * Mubu App VIP Unlock Script for Quantumult X
 * Author: Based on user's request
 *
 * Description:
 *   Modifies the response of the Mubu current_user API to simulate VIP status.
 *   - Sets 'level' to 2 (typically VIP level).
 *   - Sets 'vipEndDate' to a distant future date (e.g., 2999-01-01) for "permanent" VIP.
 *   - Sets 'agreeTermService' to true.
 *   - Sets 'passSecure' to true.
 
[rewrite_local]
^https:\/\/api2-pre\.mubu\.com\/v3\/api\/user\/current_user url script-response-body https://raw.githubusercontent.com/bffu/JS/main/mubu.js  # URL匹配规则改变

[mitm] 
hostname = api2-pre.mubu.com # hostname 改变

*/

// 获取原始响应体
var body = $response.body;

// 将JSON字符串解析为JavaScript对象
var obj = JSON.parse(body);

// 定义要修改的用户VIP信息
// "level": 2 通常表示VIP等级
// "vipEndDate": 设置一个遥远的日期，模拟永久VIP
// "agreeTermService": true 模拟已同意服务条款
// "passSecure": true 模拟密码已安全
var modifiedVipInfo = {
  "level": 2,
  "vipEndDate": "2999-01-01",
  "agreeTermService": true, // 通常VIP用户会同意服务条款
  "passSecure": true        // 通常VIP用户会完成安全设置
};

// 遍历 `obj.data` 中的所有属性
for (let key in obj.data) {
  // 检查 `modifiedVipInfo` 中是否包含当前属性
  if (modifiedVipInfo.hasOwnProperty(key)) {
    // 如果包含，则用 `modifiedVipInfo` 中的值覆盖 `obj.data` 中的值
    obj.data[key] = modifiedVipInfo[key];
  }
}

// 将修改后的JavaScript对象转换回JSON字符串，并传回给Quantumult X
$done({body: JSON.stringify(obj)});
