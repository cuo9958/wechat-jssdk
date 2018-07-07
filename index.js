const fetch = require("node-fetch");
const crypto = require("crypto");
/**
 * 基类,可继承
 */
export default class {
    appid = "";
    secret = "";

    cache = {};
    /**
     * 自定义缓存的获取
     * @param {*} key 
     */
    get_cache(key) {
        if (!this.cache[key]) return null;
        const val = this.cache[key];
        const now = Date.now();
        if (now - val.d > 7000) return null;
        return val.v;
    }
    /**
     * 自定义缓存的设置
     * @param {*} key 
     * @param {*} value 
     */
    set_cache(key, value) {
        this.cache[key] = {
            v: value,
            d: Date.now()
        }
    }
    /**
     * 远程get请求
     * @param {*} url 
     */
    curl(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
    /**
     * 获取token
     */
    getToken() {
        let token = await this.get_cache("wechat_token");
        if (token) return token;

        try {
            let res = await this.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appid}&secret=${this.secret}`);
            if (res.data && res.data.access_token) {
                await this.set_cache("wechat_token", res.data.access_token);
                return res.data.access_token;
            }
        } catch (error) {
            //
        }
        return "";
    }
    /**
     * 获取ticket
     */
    async geticket() {
        let ticket = await this.get_cache("wechat_ticket");
        if (ticket) return ticket;
        const token = await this.getToken();
        if (!token) return "";
        try {
            let res = await this.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`);
            if (res.data && res.data.ticket) {
                await this.set_cache("wechat_ticket", res.data.ticket);
                return res.data.ticket;
            }
        } catch (error) {
            //
        }
        return "";
    }
    /**
     * 拿到最终的jssdk
     * @param {*} url 
     */
    async jssdk(url) {
        const timestamp = parseInt(new Date().getTime() / 1000) + '';
        const noncestr = Math.random().toString(36).substr(2, 15);
        const result = await this.geticket();
        if (!result) return null;
        let str = 'jsapi_ticket=' + result + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
        let signature = crypto.createHash('sha1').update(str).digest('hex');
        return {
            appId: this.appid,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature
        };
    }
}