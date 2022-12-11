/**
 * @author kjprime
 * @description 发送邮件的封装
 */

import * as nodemailer from 'nodemailer';

const config = {
  // 这个地方是一个smtp服务器地址，一般都是smtp + xxx 比如网易地址 smtp.163.com 如果不行就百度搜索xxx的smtp
  host: 'smtp.qq.com',
  // 这个就是对应端口
  port: 465,
  // 如果ture不行就用false试试呗。
  secure: true,
  auth: {
    user: '1032964188@qq.com', // 账号
    pass: 'mrhfusrgfxdqbdah', //授权码或者密码
  },
};

/*const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: 'czhui1993@gmail.com',
    //邮箱
    pass: 'a2153218',
    //登入密码
  },
};*/

const server = nodemailer.createTransport(config);

const mail = {
  from: config.auth.user,
  to: '',
  html: '',
  subject: '邮箱验证', //邮件标题
};
/**
 * 发送邮件函数封装
 * @param {string} sendContent 发送的验证码或者内容
 * @param {string}} sendToEmail 发送到的email地址
 * @returns promise
 */
const sendEMail = (sendContent: string, sendToEmail: string) => {
  return new Promise((res, rej) => {
    mail['html'] = `<h1>OVB 邮箱验证</h1> <div>${sendContent}</div>`;
    mail['to'] = sendToEmail;
    server.sendMail(mail, function (err, msg) {
      //回调函数
      if (err) {
        console.log('发送失败');
        rej(err);
      } else {
        console.log('发送成功');
        res(null);
      }
    });
  });
};

export default sendEMail;
