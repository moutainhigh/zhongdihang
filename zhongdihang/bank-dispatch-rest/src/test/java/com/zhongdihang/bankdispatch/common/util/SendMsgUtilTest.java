package com.zhongdihang.bankdispatch.common.util;

import com.alibaba.fastjson.JSON;
import com.zhongdihang.bankdispatch.common.constant.SMSTemplateEnum;
import com.zhongdihang.bankdispatch.common.sms.DispatchSMSTemplate;
import com.zhongdihang.bankdispatch.common.sms.SendMsgUtil;
import org.junit.Ignore;
import org.junit.Test;

/**
 * @Author: Arthur Han
 * @Description:
 * @CreateTime: 2017/8/25 10:23
 * @Modified By：
 * @Version: V1.0.0
 */
public class SendMsgUtilTest {

    @Test
    @Ignore
    public void sendMsgUtilsTOCompanyTest() {
        DispatchSMSTemplate dispatchSMSTemplate=new DispatchSMSTemplate("邮储银行","韩正天","15962664438");
        System.out.print(JSON.toJSONString(dispatchSMSTemplate));
        SendMsgUtil.sendMsg("15962664438", JSON.toJSONString(dispatchSMSTemplate), SMSTemplateEnum.DISPATCH.getTemplate());
    }

    @Test
    @Ignore
    public void sendMsgUtilsTOManagerTest(){
//        WarrantOrderVo warrantOrderVo = new WarrantOrderVo();
//        warrantOrderVo.setSendTo("15050422169");
//        warrantOrderVo.setLocation("玉兰新村");
//        SendMsgUtil.sendMsg(warrantOrderVo.getSendTo(), "{\"location\":\"" + warrantOrderVo.getLocation() + "\"}", getTemplate(Sms.SMS_COMPLETE_ORDER));
    }
}