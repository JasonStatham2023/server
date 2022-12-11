const ALY = require("aliyun-sdk");

const DM = new ALY.DM({
  accessKeyId: 'LTAI5t9q38i5pLHkpexxZSsJ', // 密钥 ID
  secretAccessKey: "Euq0uS5891ePy87cy7nXGPQ9X6zmNe", // 密钥值
  endpoint: "https://dm.ap-southeast-1.aliyuncs.com", // 邮件发送url
  apiVersion: "2015-11-23"
});

export const aliyunSendEmail = (sendContent: string, sendToEmail: string) => {

  const content = `
    <div id="qm_con_body"><div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="opacity: 1;">

\t<style type="text/css">
\t\t@media screen and (max-width: 860px) {
\t\t\t.qmbox .main-body {
\t\t\t\twidth: 100% !important;
\t\t\t}
\t\t}
\t</style>

\t<table class="wrapper" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="line-height: 1.3em; font-family: Arial, sans-serif;font-size: 14px; color: #666666; background-color: #e8e8e8;width: 100%; margin: 0; padding: 50px 0 50px 0;-webkit-text-size-adjust: none;">
\t\t<tbody><tr style="font-family: Arial, sans-serif; line-height: 1.3em;">
\t\t\t<td class="wrapper-td" align="center" valign="top" style="font-family: Arial, sans-serif; line-height: 1.3em; padding: 0 20px 20px;">
\t\t\t\t<table class="main-body" border="0" cellpadding="0" cellspacing="0" style="line-height: 1.3em; color: #666666; font-family: Arial, sans-serif; box-shadow: 0 3px 9px rgba(0, 0, 0,0.03); overflow: hidden; background-color: #ffffff; border:1px solid #d1d1d1; width: 800px; border-radius: 5px;">
\t\t\t\t\t<tbody><tr style="font-family: 'Arial', sans-serif; line-height:1.3em;">
\t\t\t\t\t\t<td align="center" valign="top" style="font-family: 'Arial', sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t<table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: 'Arial', sans-serif;line-height: 1.3em; color: #666666;">
\t\t\t\t\t\t\t\t<tbody><tr style="font-family: 'Arial', sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t\t\t<td class="template_header" style="line-height: 1.3em; font-family: Arial; background-color: #2276d2; color: #deeaf8; border-bottom: 1px solid #2070c7; font-weight:
                                 bold; vertical-align: middle; text-align: left; padding:
                                 16px 18px; border-top-left-radius: 2px;
                                 border-top-right-radius: 2px;">
\t\t\t\t\t\t\t\t\t\t<a href="https://www.ovb.life/" border="0" style="font-style: none; font-weight: normal; color:#fff; text-decoration: none; font-size: 1rem; margin: 0 0 0 12px; color: #deeaf8;" rel="noopener" target="_blank">
\t\t\t\t\t\t\t\t\t\t\t OVB
\t\t\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t</tbody></table>
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr style="font-family: Arial, sans-serif; line-height:
                     1.3em;">
\t\t\t\t\t\t<td align="left" valign="top" style="font-family: Arial,
                        sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t<table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_body" style="font-family: Arial,
                           sans-serif; line-height: 1.3em; color: #666666;">
\t\t\t\t\t\t\t\t<tbody><tr style="font-family: Arial, sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t\t\t<td valign="top" class="body_content" style="line-height:
                                 1.3em; font-family: Arial, sans-serif; color: #666666;
                                 background-color: #ffffff;">
\t\t\t\t\t\t\t\t\t\t<table border="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; line-height: 1.3em;
                                    color: #666666;">
\t\t\t\t\t\t\t\t\t\t\t<tbody><tr style="font-family: Arial, sans-serif;
                                       line-height: 1.3em;">
\t\t\t\t\t\t\t\t\t\t\t\t<td valign="top" class="body_content_inner" style="line-height: 1.3em; font-family: Arial; text-align: left; padding-left: 55px; padding-right: 55px; padding-top: 45px; padding-bottom: 45px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\tHey
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\tThank you for using OVB!
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0;">
                                ${sendContent}
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\tIf you ever have any questions, please don't hesitate to contact our team at
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="ovblifeG@gmail.com" style="color:
\t\t\t\t\t\t\t\t\t\t\t\t\t\t#666666;
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-style: none; text-decoration: underline;" rel="noopener" target="_blank">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t ovblifeG@gmail.com
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0 1.5em;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\tThanks,
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 1em 0; font-weight: bold;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\tThe OVB Team
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t</tbody></table>
\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t</tbody></table>
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr style="font-family: Arial, sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t<td align="center" valign="top" style="font-family: Arial, sans-serif; line-height: 1.3em;">

\t\t\t\t\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: Arial, sans-serif; line-height: 1.3em; color: #666666;">
\t\t\t\t\t\t\t\t<tbody><tr style="font-family: Arial, sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t\t\t<td width="100%" align="center" class="footer_container" style="line-height: 1.3em; font-family: Arial,sans-serif; font-size: 12px; text-align: center; padding: 12px 22.5px 16px; border-top: 1px solid #ededed; color: #4b4b4b; background-color: #fafafa;">
\t\t\t\t\t\t\t\t\t\t<table align="center" cellpadding="0" cellspacing="0" border="0" width="auto" style="font-family: Arial, sans-serif; line-height: 1.3em; color: #666666;">
\t\t\t\t\t\t\t\t\t\t\t<tbody><tr style="font-family: Arial, sans-serif; line-height: 1.3em;">
\t\t\t\t\t\t\t\t\t\t\t\t<td align="center" class="footer_container_inner bottom-nav" style="line-height: 1.3em; font-family: Arial,sans-serif; font-size: 12px; color: #4b4b4b;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: .6em 0; font-size: 18px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\twww.ovb.life
\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t</tbody></table>
\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t</tbody></table>
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t</tbody></table>
\t\t\t</td>
\t\t</tr>
\t\t</tbody></table>
\t<style type="text/css">.qmbox style, .qmbox script, .qmbox head, .qmbox link, .qmbox meta {display: none !important;}</style></div></div>
  `
  DM.singleSendMail(
    {
      AccountName: "admin@email.ovb.life", // 发信地址
      AddressType: 1, // 0 为随机账号；1 为发信地址
      ReplyToAddress: false, // 使用管理控制台中配置的回信地址
      FromAlias: "OVB Team", // 发信人昵称
      HtmlBody: content, // 邮件 html 正文，限制28K
      TextBody: "", // 邮件 text 正文，限制28K。
      ToAddress: sendToEmail, // 目标地址，多个 email 地址可以用逗号分隔，最多100个地址。
      Subject: "OVB Team" // 邮件主题，建议填写
    },
    (err, data) => {
      if (err) {
        console.log( err);
      }
      console.log( data);
    }
  );

}
