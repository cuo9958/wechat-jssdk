# wechat-jssdk

这是一个nodejs下简单易用的jssdk工具库.

## 安装

从npm库中拉取代码.

`npm install --save wechat-jssdk-min`

## 用法1,初始化并使用

简单的初始化就可以是用了.

```javascript
let sdk=new jssdk();

sdk.appid="微信的appid";
sdk.secret="微信的secret";

sdk.jssdk("当前页的url");

//获取ticket
sdk.geticket();

//获取token
sdk.getToken();
```

## 用法2,自定义扩展

```javascript
class MySdk extends jssdk{
    appid="微信的appid";
    secret="微信的secret";

    get_cache(key) {
        //使用redis进行获取
    }
    set_cache(key, value) {
        //使用redis进行保存
    }
}
let newSdk=new MySdk();
//剩下的等于
```

## 属性以及方法说明

### appid<string>

使用到的微信appid

### secret<string>

使用到的微信secret

### get_cache(key)

获取缓存的token或者ticket.

key:内部设置的缓存key值

### set_cache(key, value)

设置缓存内容,有效期为7000秒.比官方的7200要少.

key:设置缓存需要的key值

value:要设置的值内容

###  curl(url)

请求远程地址并将结果使用json的形式返回.

url:要请求的网址.

### getToken()

获取缓存或者新的token值.

###  geticket()

获取缓存或者新的ticket值.

### jssdk(url)

获取jssdk需要用到的各种参数

url:当前网站的完整url.