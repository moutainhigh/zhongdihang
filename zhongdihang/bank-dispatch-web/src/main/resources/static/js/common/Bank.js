var Bank = {
    debug:true,
    profile:"dev",
    permission:[],
    server : {
        local : "http://localhost/mockdata",
        dev : "http://localhost:8080",
        test : "http://192.168.1.30:10000",
        prod : "https://www.zhongcehang.com",
        web : "http://localhost:8082"
    },
    api : {
        login : {url:"/auth",method:"post"},
        logout : {url:"/logout",method:"post"},
        user_list : {url:"/user/list",method:"get"},
        user_dept : {url:"/user/dept",method:"get"},
        user_info : {url:"/user/info",method:"get"},
        user_authInfo : {url:"/user/authInfo",method:"get"},
        user_add : {url:"/user/add",method:"post"},
        user_edit : {url:"/user/edit",method:"post"},
        user_disable : {url:"/user/disable",method:"post"},
        user_delete : {url:"/user/delete",method:"post"},
        user_enable : {url:"/user/enable",method:"post"},
        user_modify_password: {url:"/user/password/modify",method:"post"},
        user_force_password: {url:"/user/password/force",method:"post"},
        user_role: {url:"/user/role",method:"post"},
        role_list: {url:"/role/list",method:"get"},
        role_info: {url:"/role/info",method:"get"},
        role_add: {url:"/role/add",method:"post"},
        role_edit: {url:"/role/edit",method:"post"},
        role_delete: {url:"/role/delete",method:"post"},
        role_userRoletree: {url:"/role/userRoleTree",method:"get"},
        role_tree: {url:"/role/tree",method:"get"},
        role_menu: {url:"/role/menu",method:"post"},
        menu_list: {url:"/menu/list",method:"get"},
        menu_info: {url:"/menu/info",method:"get"},
        menu_add: {url:"/menu/add",method:"post"},
        menu_edit: {url:"/menu/edit",method:"post"},
        menu_delete: {url:"/menu/delete",method:"post"},
        menu_roleMenutree: {url:"/menu/roleMenuTree",method:"get"},
        menu_tree: {url:"/menu/tree",method:"get"},
        menu_nav: {url:"/menu/nav",method:"get"},
        menu_permission: {url:"/menu/permission",method:"get"},
        dict_list: {url:"/dict/list",method:"get"},
        dict_info: {url:"/dict/info",method:"get"},
        dict_add: {url:"/dict/add",method:"post"},
        dict_edit: {url:"/dict/edit",method:"post"},
        dict_delete: {url:"/dict/delete",method:"post"},
        dict_select: {url:"/dict/select",method:"get"},
        bank_list: {url:"/bank/list",method:"get"},
        bank_select: {url:"/bank/select",method:"get"},
        bank_info: {url:"/bank/info",method:"post"},
        bank_add: {url:"/bank/add",method:"post"},
        bank_edit: {url:"/bank/edit",method:"post"},
        bank_bankbyname:{url:"/bank/bankbyname",method:"get"},
        bank_delete: {url:"/bank/delete",method:"post"},
        bank_assess: {url:"bank/assess",method:"post"},
        assess_list: {url:"/assess/list",method:"get"},
        assess_select: {url:"/assess/select",method:"get"},
        assess_info: {url:"/assess/info",method:"get"},
        assess_add: {url:"/assess/add",method:"post"},
        assess_edit: {url:"/assess/edit",method:"post"},
        assess_delete: {url:"/assess/delete",method:"post"},
        dispatch_Assess:{url:"/dispatch/finddispatch",method:"get"},
        dispatch_Bank:{url:"/dispatch/finddispatch",method:"get"},
        dispatch:{url:"/assess/delete",method:"post"}
    },
    page : {
        login : "/login.html",
        index : "/index.html",
        user:"/web/system/user/user.html",
        user_info:"/web/system/user/user_info.html",
        user_add:"/web/system/user/user_add.html",
        user_edit:"/web/system/user/user_edit.html",
        user_chpwd:"/web/system/user/user_chpwd.html",
        user_roleassign:"/web/system/user/user_roleassign.html",
        dict:"/web/system/dict/dict.html",
        dict_add:"/web/system/dict/dict_add.html",
        dict_edit:"/web/system/dict/dict_edit.html",
        dispatch:"/web/system/dispatch/dispatch.html",
        dispatch_add:"/web/system/dispatch/dispatch_add.html",
        dispatch_edit:"/web/system/dispatch/dispatch_edit.html",
        dispatchBank:"/web/system/dispatcgbank/dispatcgbank.html",
        dispatchBank_add:"/web/system/dispatcgbank/dispatcgbank_add.html",
        dispatchBank_edit:"/web/system/dispatcgbank/dispatcgbank_edit.html",
        menu:"/web/system/menu/menu.html",
        menu_add:"/web/system/menu/menu_add.html",
        menu_edit:"/web/system/menu/menu_edit.html",
        role:"/web/system/role/role.html",
        role_add:"/web/system/role/role_add.html",
        role_edit:"/web/system/role/role_edit.html",
        role_menuassign:"/web/system/role/role_menuassign.html",
        bank:"/web/system/bank/bank.html",
        bank_add:"/web/system/bank/bank_add.html",
        bank_edit:"/web/system/bank/bank_edit.html",
        assess:"/web/system/assess/assess.html",
        assess_add:"/web/system/assess/assess_add.html",
        assess_edit:"/web/system/assess/assess_edit.html"
    },
    cache : {
        user : "user"
    },
    header:{
        token:"token",
        bank:"bank-"
    },
    htmlPage:function(page,params){
        if(!page) return;
        var url= this.server.web+page;
        if(!params)return url;
        url+="?";
        for (var o in params){
            if(params[o] != -1){
                url += o + "=" + params[o] + "&";
            }
        }
        url=url.substring(0, url.length-1);
        return url;
    },
    goto:function(page){
        if(!page) return;
        top.window.location.href=this.server.web+page;
    },
    route:function (api) {
        if (!api) {
            return api;
        }
        if(!api.url){
            return api;
        }
        var surl = this.server[this.profile];
        var sapi = api.url;
        if (sapi != undefined) {
            url = surl + sapi;
            if (this.profile == "local") {
                url = url + ".json";
            }
        }
        return url;
    },
    publicPath: "",
    addCtx: function (ctx) {
        if (this.publicPath == "") {
            this.publicPath = ctx;
        }
    },
    formData:function(from){
        var element = $('#'+from);
        var postdata = {};
        element.find('input,select,checkbox').each(function (r) {
            var $this = $(this);
            var name = $this.attr('name');
            var type = $this.attr('type');
            switch (type) {
                case 'checkbox':
                    postdata[name] = $this.is(':checked');
                    break;
                default:
                    postdata[name] = $this.val();
                    break;
            }
        });
        return postdata;
    },
    confirm: function (tip, ensure) {//询问框
        parent.layer.confirm(tip, {
            btn: ['确定', '取消']
        }, function (index) {
            ensure();
            parent.layer.close(index);
        }, function (index) {
            parent.layer.close(index);
        });
    },
    log: function (info) {
        console.log(info);
    },
    alert: function (info, iconIndex) {
        parent.layer.msg(info, {
            icon: iconIndex
        });
    },
    info: function (info) {
        Bank.alert(info, 0);
    },
    success: function (info) {
        Bank.alert(info, 1);
    },
    error: function (info) {
        Bank.alert(info, 2);
    },
    infoDetail: function (title, info) {
        var display = "";
        if (typeof info == "string") {
            display = info;
        } else {
            if (info instanceof Array) {
                for (var x in info) {
                    display = display + info[x] + "<br/>";
                }
            } else {
                display = info;
            }
        }
        parent.layer.open({
            title: title,
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['950px', '600px'], //宽高
            content: '<div style="padding: 20px;">' + display + '</div>'
        });
    },
    getQueryString:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (decodeURI(r[2]));
        return null;
    },
    writeObj: function (obj) {
        var description = "";
        for (var i in obj) {
            var property = obj[i];
            description += i + " = " + property + ",";
        }
        layer.alert(description, {
            skin: 'layui-layer-molv',
            closeBtn: 0
        });
    },
    showInputTree: function (inputId, inputTreeContentId, leftOffset, rightOffset) {
        var onBodyDown = function (event) {
            if (!(event.target.id == "menuBtn" || event.target.id == inputTreeContentId || $(event.target).parents("#" + inputTreeContentId).length > 0)) {
                $("#" + inputTreeContentId).fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);// mousedown当鼠标按下就可以触发，不用弹起
            }
        };

        if(leftOffset == undefined && rightOffset == undefined){
            var inputDiv = $("#" + inputId);
            var inputDivOffset = $("#" + inputId).offset();
            $("#" + inputTreeContentId).css({
                left: inputDivOffset.left + "px",
                top: inputDivOffset.top + inputDiv.outerHeight() + "px"
            }).slideDown("fast");
        }else{
            $("#" + inputTreeContentId).css({
                left: leftOffset + "px",
                top: rightOffset + "px"
            }).slideDown("fast");
        }

        $("body").bind("mousedown", onBodyDown);
    },
    baseAjax: function (url, tip) {
        var ajax = new $ax(Bank.publicPath + url, function (data) {
            Bank.success(tip + "成功!");
        }, function (data) {
            Bank.error(tip + "失败!" + data.responseJSON.message + "!");
        });
        return ajax;
    },
    changeAjax: function (url) {
        return Bank.baseAjax(url, "修改");
    },
    zTreeCheckedNodes: function (zTreeId) {
        var zTree = $.fn.zTree.getZTreeObj(zTreeId);
        var nodes = zTree.getCheckedNodes();
        var ids = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            ids += "," + nodes[i].id;
        }
        return ids.substring(1);
    },
    eventParseObject: function (event) {//获取点击事件的源对象
        event = event ? event : window.event;
        var obj = event.srcElement ? event.srcElement : event.target;
        return $(obj);
    },
    sessionTimeoutRegistry: function () {
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            complete: function (XMLHttpRequest, textStatus) {
                //通过XMLHttpRequest取得响应头，sessionstatus，
                var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
                if (sessionstatus == "timeout") {
                    //如果超时就处理 ，指定要跳转的页面
                    window.location = Bank.publicPath + "/global/sessionError";
                }
            }
        });
    },
    initValidator: function(formId,fields){
        $('#' + formId).bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: fields,
            live: 'enabled',
            message: '该字段不能为空'
        });
    },
    setHeader:function (value){
        localStorage.setItem(Bank.header.token,Bank.header.bank+value);
    },
    getHeader:function (){
        return localStorage.getItem(Bank.header.token);
    },
    timeFormat:function(timeStamp,format){
        if(!format){
            format="yyyy-MM-dd h:m:s";
        }
        var date=new Date(timeStamp);
        return date.format(format);
    },
    initSelect:function(selectId,data,selectVue){
        var selector = $('#'+selectId);
        selector.empty();
        $.each(data, function (i) {
            $("<option></option>").val(data[i].value).text(data[i].name).appendTo(selector);
        });
    }
};

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
$(function(){
   $('button').each(function(){
      if(this.hasAttribute('permission')){
          var permissionResult= hasPermission(this.getAttribute('permission'))
          if (!permissionResult){
              this.remove();
          }
      }
   });
});
function  hasPermission(permission) {
    return $.inArray(permission, $.cookie('bankPermission').split(',')) >= 0;
}
