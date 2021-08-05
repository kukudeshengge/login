$().ready(() => {
    const dirName = 'zjyd-space-front-loginCenter';
    const mobileReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    const passwordReg = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,16})$');
    //初始化背景图片
    $('body').css('background-image', `url(${window.imageUrl}/${dirName}/login_bg.png)`);
    $('.guide_text').css('background-image', `url(${window.imageUrl}/${dirName}/code_alert.png)`);
    //初始化img的src
    Array.from($('img')).forEach(el => {
        let src = $(el).attr('data-src');
        src && $(el).attr('src', window.imageUrl + src);
    })
    function jump(url) {
        let a = document.createElement('a');
        a.href = url;
        a.click();
    }
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]); return '';
    }
    function errorPlacementFn(error, element) {
        let name = $(element).attr('name');
        if (name === 'code') {
            $(element[0].parentNode.parentNode)
                .append(error);
        } else {
            $(element[0].parentNode)
                .append(error);
        }
    }
    document.addEventListener('keydown', loginDown);
    //绑定键盘事件
    function cancelDownEvent() {
        document.removeEventListener('keydown', loginDown);
        document.removeEventListener('keydown', telLoginDown);
        document.removeEventListener('keydown', forgetDown);
        document.removeEventListener('keydown', registryFnDown);
    }
    //回到首页
    $('.back_btn').click(() => {
        window.history.back();
    })
    //手机号码的form以及登录
    const validator = $("#form1").validate({
        errorPlacement: errorPlacementFn,
        errorElement: "div",
        rules: {
            userName: {
                required: true,
                testTel: 'testTel'
            },
            password: {
                required: true
            }
        },
        messages: {
            userName: {
                required: "请输入手机号"
            },
            password: {
                required: "请输入密码"
            }
        }
    });
    $('.tel_login').click(loginFn)
    function loginFn() {
        $("#form1").valid()
        let arr = ['#userName', '#password'];
        if (isValid(arr) && mobileReg.test($('#userName').val())) {
            axios(requestUrl + '/api/ucenter/api/v1/encode/modulusExponent').then(res => {
                let { modulus, exponent } = res.result;
                let key = RSAUtils.getKeyPair(exponent, '', modulus);
                let data = {
                    username: RSAUtils.encryptedString(key, $('#userName').val()),
                    password: RSAUtils.encryptedString(key, $('#password').val()),
                    loginType: 100003
                }
                axios(requestUrl + '/api/ucenter/api/v1/userLogin/login', data).then(res => {
                    let { code, message, result } = res;
                    if (code === 0) {
                        $.message({
                            message: '登录成功',
                            showClose: true,
                            type: 'success',
                            center: true
                        });
                        setCookie(result);
                        let url = GetQueryString('url');
                        let path = GetQueryString('path');
                        if (url) {
                            let jumpUrl = `${url}/#${path}`
                            jump(jumpUrl);
                        }
                    } else {
                        $.message({
                            message: message,
                            showClose: true,
                            type: 'error',
                            center: true
                        });
                    }
                })
            })
        }
    }
    function loginDown(e) { e.keyCode === 13 && loginFn() };
    /*监听document的回车操作*/
    //_______________________________________________________________________________________________________________
    //手机验证码的form以及登录
    const validator2 = $("#form2").validate({
        errorPlacement: errorPlacementFn,
        errorElement: "div",
        rules: {
            codeuser: {
                testTel: 'testTel'
            }
        },
        messages: {
            codeuser: {
                required: '请输入手机号'
            },
            code: {
                required: '请输入验证码'
            }
        }
    });
    $('.code_login').click(telLoginFn)
    function telLoginFn() {
        $("#form2").valid();
        let arr = ['#codeuser', '#code'];
        if (isValid(arr) && mobileReg.test($('#codeuser').val())) {
            axios(requestUrl + '/api/ucenter/api/v1/encode/modulusExponent').then(res => {
                let { modulus, exponent } = res.result;
                let key = RSAUtils.getKeyPair(exponent, '', modulus);
                let data = {
                    username: RSAUtils.encryptedString(key, $('#codeuser').val()),
                    code: $('#code').val(),
                    loginType: 100002
                }
                axios(requestUrl + '/api/ucenter/api/v1/userLogin/login', data).then(res => {
                    let { code, message, result } = res;
                    if (code === 0) {
                        $.message({
                            message: '登录成功',
                            showClose: true,
                            type: 'success',
                            center: true
                        });
                        setCookie(result);
                        let url = GetQueryString('url');
                        let path = GetQueryString('path');
                        if (url) {
                            let jumpUrl = `${url}/#${path}`
                            jump(jumpUrl);
                        }
                    } else {
                        $.message({
                            message: message,
                            showClose: true,
                            type: 'error',
                            center: true
                        });
                    }
                })
            })
        }
    }
    function telLoginDown(e) { e.keyCode === 13 && telLoginFn() };
    //_______________________________________________________________________________________________________________
    //忘记密码的form以及提交
    const form_forget = $("#form_forget").validate({
        errorPlacement: errorPlacementFn,
        errorElement: "div",
        rules: {
            codeuser: {
                required: true,
                testTel: 'testTel'
            },
            code: {
                required: true
            },
            newPassword: {
                required: true
            }
        },
        messages: {
            codeuser: {
                required: "请输入手机号"
            },
            code: {
                required: "请输入验证码"
            },
            newPassword: {
                required: '请输入密码'
            }
        }
    });
    $('.sure_forget').click(forgetFn);
    function forgetFn() {
        $('#form_forget').valid();
        let arr = ['#forget_codeuser', '#forget_code', '#forget_newPassword'];
        if (isValid(arr) && mobileReg.test($('#forget_codeuser').val())) {
            axios(requestUrl + '/api/ucenter/api/v1/encode/modulusExponent').then(res => {
                let { modulus, exponent } = res.result;
                let key = RSAUtils.getKeyPair(exponent, '', modulus);
                let data = {
                    mobile: $('#forget_codeuser').val(),
                    password: RSAUtils.encryptedString(key, $('#forget_newPassword').val()),
                    code: $('#forget_code').val()
                }
                axios(requestUrl + '/api/ucenter/api/v1/userLogin/password', data).then(res => {
                    let { code, message } = res;
                    if (code === 0) {
                        $.message({
                            message: '密码修改成功',
                            showClose: true,
                            type: 'success',
                            center: true
                        });
                    } else if (code === 400009) {
                        let div = $('<div></div>').text('与上次密码重复');
                        div.attr({
                            id: 'forget_newPassword-error',
                            class: 'error'
                        })
                        $('#forget_newPassword').keyup(() => {
                            $('div').remove('#forget_newPassword-error');
                        });
                        $('.newPassword').append(div);
                        $('#forget_newPassword').addClass('error');
                    } else {
                        alert(message);
                    }
                })
            })
        }
    }
    function forgetDown(e) { e.keyCode === 13 && forgetFn() };
    //注册账号的form以及提交
    const form_registry = $('#registry_form').validate({
        errorPlacement: errorPlacementFn,
        errorElement: "div",
        rules: {
            registry_tel: {
                required: true,
                testTel: 'testTel'
            },
            code: {
                required: true
            },
            registry_password: {
                required: true,
                testPassword: 'testPassword'
            },
            isSure: {
                required: true
            }
        },
        messages: {
            registry_tel: {
                required: '请输入手机号',
            },
            code: {
                required: '请输入验证码'
            },
            registry_password: {
                required: '请设置登录密码'
            },
            isSure: {
                required: '请先勾选注册协议'
            }
        }
    })
    $('.sub_registry').click(registryFn);
    function registryFn() {
        $('#registry_form').valid();
        let arr = ['#registry_tel', '#registry_code', '#registry_password'];
        let checkFlag = $('#check').is(':checked');
        let telFlag = mobileReg.test($('#registry_tel').val());
        let pasFlag = passwordReg.test($('#registry_password').val());
        if (isValid(arr) && telFlag && checkFlag && pasFlag) {
            axios(requestUrl + '/api/ucenter/api/v1/encode/modulusExponent').then(res => {
                let { modulus, exponent } = res.result;
                let key = RSAUtils.getKeyPair(exponent, '', modulus);
                let data = {
                    telNum: $('#registry_tel').val(),
                    code: $('#registry_code').val(),
                    password: RSAUtils.encryptedString(key, $('#registry_password').val())
                }
                axios(requestUrl + '/api/ucenter/api/v1/adminUser/register', data).then(res => {
                    let { code, message } = res;
                    if (code === 0) {
                        $.message({
                            message: '注册成功',
                            showClose: true,
                            type: 'success',
                            center: true
                        });
                    } else {
                        $.message({
                            message: message,
                            showClose: true,
                            type: 'error',
                            center: true
                        });
                    }
                })
            })
        }
    }
    function registryFnDown(e) { e.keyCode === 13 && registryFn() };
    $.validator.addMethod("testTel", function (value, element) {
        var length = value.length;
        return this.optional(element) || (length == 11 && mobileReg.test(value));
    }, "请正确填写您的手机号码");
    $.validator.addMethod("testPassword", function (value, element) {
        var length = value.length;
        return this.optional(element) || (length >= 6 && length <= 16 && passwordReg.test(value));
    }, "设置密码不符合要求");
    //事件委托
    $('.login_box')[0].addEventListener('click', e => {
        var e = e || window.event;   //老式IE的兼容语句
        var el = e.target;
        if ($(el).hasClass('nav_item')) {
            $('.nav,.active').removeClass('active');
            $(el).addClass('active');
            let i = $(el).attr('index');
            if (i === '0') {
                cancelDownEvent();
                document.addEventListener('keydown', loginDown);
            } else if (i === '1') {
                cancelDownEvent();
                document.addEventListener('keydown', telLoginDown);
            }
            // $('#form1')[0].reset();
            // $('#form2')[0].reset();
            changeClass(i);
        }
    })
    //切换登录类型box
    function changeClass(i) {
        Array.from($('.container_item')).forEach((item, index) => {
            if (index != i) {
                $(item).addClass('none');
            } else {
                $(item).removeClass('none');
            }
        })
    }
    //点击联系客服公共fn
    $('.contact').click(() => {
        let div = document.createElement('div');
        div.className = 'modal_box';
        div.innerHTML = `<div class="modal_box">
    <div class="mask"></div>
    <div class="modal_content">
        <div class="left">
            <img src="${window.imageUrl}/${dirName}/modal_phone.png"
                alt="">
        </div>
        <div class="right">
            <h2>联系客服</h2>
            <p class="hlo">
                您好，欢迎点击中教云职业教育云平台客服中心，如果有问题建议在线咨询，给您带来不便敬请谅解，祝您生活愉快！
            </p>
            <p class="con">
                1.在线客服服务时间：08:30--24:00
            </p>
            <p class="con">
                客服邮箱：bd@educloudcn.com
            </p>
            <p class="con">
                2.若有账号安全问题，请编辑邮件【内容包括：问题详情、学校名称、学号、姓名、院专班信息、手机号及本人手持学生证拍照】，发送邮件客服邮箱，我们会在24小时内给您回复！
            </p>
            <div>
                <span class='back_login'>返回登录</span>
            </div>
        </div>
    </div>
</div>`;
        $('body').append(div);
        $('.back_login').click(() => {
            console.log(222)
            $('div').remove('.modal_box');
        })
    })

    //点击右上角切换扫码登录和密码登录
    $('.right_top_logo').click(changeLoginType)
    //切换扫码登录和密码登陆公共fn
    function changeLoginType() {
        let txt = $('.guide_text').text().trim();
        if (txt === '大国匠app扫码登录') {
            $('.guide_text').html('密码登录在这里');
            $('.guide_img').attr('src', `${window.imageUrl}/${dirName}/computed_icon.png`);
            $('.login_c').hide();
            $('.qrcode_c').removeClass('none');
            $('.right_login_box').css('padding-top', '160px');
        } else {
            $('.guide_text').html('大国匠app扫码登录');
            $('.guide_img').attr('src', `${window.imageUrl}/${dirName}/er_icon.png`);
            $('.login_c').show();
            $('.qrcode_c').addClass('none');
            $('.right_login_box').css('padding-top', '117px');
        }
    }
    //手机号登录获取验证码
    $('.get_telLogin_code')[0].addEventListener('click', telGetCode);
    function telGetCode() {
        let val = $('#codeuser').val().trim();
        if (!val) {
            $("#form2").validate().element($("#codeuser"))
            return;
        }
        if (mobileReg.test(val)) {
            getCode('.right_login_box', () => {
                successBack('.right_login_box', $('#codeuser').val().trim(), 0, '.get_telLogin_code', telGetCode);
            });
        }
    }
    //忘记密码获取验证码
    $('.get_forget_code')[0].addEventListener('click', forgetGetCode);
    function forgetGetCode() {
        let val = $('#forget_codeuser').val().trim();
        if (!val) {
            $("#form_forget").validate().element($("#forget_codeuser"))
            return;
        }
        if (mobileReg.test(val)) {
            getCode('.right_forget_box', () => {
                successBack('.right_forget_box', $('#forget_codeuser').val().trim(), 1, '.get_forget_code', forgetGetCode);
            })
        }
    }
    //注册获取验证码
    $('.get_registry_code')[0].addEventListener('click', registryGetCode);
    function registryGetCode() {
        let val = $('#registry_tel').val().trim();
        if (!val) {
            $("#registry_form").validate().element($("#registry_tel"))
            return;
        }
        if (mobileReg.test(val)) {
            getCode('.right_registry_box', () => {
                successBack('.right_registry_box ', $('#registry_tel').val().trim(), 5, '.get_registry_code', registryGetCode);
            })
        }
    }
    //获取验证码公共fn
    /**
     * 
     * @param {获取验证码滑块遮罩追加（父元素的类名）} el 
     * @param {滑块滑动成功的回调函数} callBack 
     */
    function getCode(el, callBack) {
        let div = document.createElement('div');
        div.className = 'two_modal_box';
        div.innerHTML = `<div class="two_modal_box">
        <div class="mask"></div>
        <div class="slider_box">
            <h2>
                <span>请完成安全验证</span>
                <span class="cur close_two_modal"><img src="${window.imageUrl}/${dirName}/close_icon.png" alt=""></span>
            </h2>
            <div class="verBox">
                <div id="imgVer" class="imgVer" style="display:inline-block;"></div>
            </div>
        </div>
    </div>`;
        $(el).append(div);
        imgVer({
            el: '$("#imgVer")',
            width: '350',
            height: '156',
            img: [
                'https://zjyddev.oss-cn-beijing.aliyuncs.com/zjyd-front-img/zjyd-space-front-loginCenter/back_icon.png',
                'https://zjyddev.oss-cn-beijing.aliyuncs.com/zjyd-front-img/zjyd-space-front-loginCenter/computed_icon.png',
                'https://zjyddev.oss-cn-beijing.aliyuncs.com/zjyd-front-img/zjyd-space-front-loginCenter/login_logo.png'
            ],
            success: function () {
                callBack && callBack();
            },
            error: function () {
                //alert('错误执行')
            }
        });
        $('.slider-btn').css('background-image', `url(${window.imageUrl}/${dirName}/sprite.3.2.0.png)`);
        $('.close_two_modal').click(() => {
            $('div').remove('.two_modal_box');
        })
    }
    //验证码接口公共fn
    /**
     * 
     * @param {父级盒子的类名，追加遮罩} el 
     * @param {手机号码} telNum 
     * @param {短信类型} type 
     * @param {获取验证码按钮的类名} codeClass 
     * @param {获取验证码对应的事件函数} fn 
     */
    function successBack(el, telNum, type, codeClass, fn) {
        $('div').remove('.two_modal_box');
        axios(requestUrl + '/api/gongyong/api/v1/sdk/gongYong/sendMeg/sendTelNum', {
            telNum,
            type
        }).then(res => {
            if (res.code === 0) {
                let div = document.createElement('div');
                div.innerHTML = `                <div class="scusess_box">
            <div class="mask"></div>
            <div class="con">
                <img src="${window.imageUrl}/${dirName}/sucess.png"
                    alt="">
                <h2>验证通过</h2>
                <p>验证码发送成功，请注意查收</p>
            </div>
        </div>`;
                $(el).append(div);
                countDown(codeClass, fn);
                let timer = setTimeout(() => {
                    $('div').remove('.scusess_box');
                    clearInterval(timer);
                }, 1000);
                // alert('验证码发送成功');
            } else {
                $.message({
                    message: res.message,
                    showClose: true,
                    type: 'error',
                    center: true
                });
            }
        })
    }
    /**
     * 
     * @param {获取验证码按钮类名} codeClass 
     * @param {获取验证码对应的事件函数} fn 
     */
    //验证码公共倒计时fn
    function countDown(codeClass, fn) {
        let count = 60;
        changeCodeBtn(codeClass, 0, fn);
        let timer = setInterval(() => {
            count--;
            $(codeClass).html(count + 's');
            $(codeClass).addClass('count_down');
            if (count < 1) {
                clearInterval(timer);
                $(codeClass).html('获取验证码');
                $(codeClass).removeClass('count_down');
                changeCodeBtn(codeClass, 1, fn);
            }
        }, 1000);
    }
    /**
     * 
     * @param {获取验证码按钮类名} codeClass 
     * @param {0是解绑事件，1是绑定事件} flag 
     * @param {事件执行函数} fn 
     */
    function changeCodeBtn(codeClass, flag, fn) {
        let handl = flag === 0 ? 'removeEventListener' : 'addEventListener';
        $(codeClass)[0][handl]('click', fn);
    }
    //表单非空校验公共fn
    function isValid(arr) {
        return arr.every(item => $(item).val().trim())
    }
    //返回密码登录
    $('.go_paslogin').click(changeLoginType);
    //去忘记密码
    $('.go_forget').click(e => {
        e.preventDefault();   //阻止a标签默认事件
        // $('#form1')[0].reset();
        // $('#form2')[0].reset();
        $('.right_login_box').hide();
        $('.right_forget_box').show();
        cancelDownEvent();
        document.addEventListener('keydown', forgetDown);
    })
    //去登录
    $('.go_login').click(e => {
        e.preventDefault();   //阻止a标签默认事件
        $('.right_login_box').show();
        $('.right_registry_box').hide();
        $('.right_forget_box').hide();
        let index = $('.active').attr('index');
        if (index === '0') {
            cancelDownEvent();
            document.addEventListener('keydown', loginDown);
        } else if (index === '1') {
            cancelDownEvent();
            document.addEventListener('keydown', telLoginDown);
        }
    })
    //去注册
    $('.go_registry').click(() => {
        $('.right_login_box ').hide();
        $('.right_forget_box').hide();
        $('.right_registry_box').show();
        cancelDownEvent();
        document.addEventListener('keydown', registryFnDown);
    })
    $('#registry_password').keyup(() => {
        console.log('registry_password')
    })
})
//登录成功后存储信息
function setCookie(result) {
    let info = {
        suffix:result.suffix,
        partnerUserId:result.partnerUserId,
        identityId:result.identityId,
        userId: result.id,
        mainOrgId: result.mainOrgId,
        mainOrgName: result.mainOrgName,
        fullName: result.fullName,
        portraitId: result.portraitId,
        telNum: result.telNum,
        token: result.token,
        userName: result.userName,
        userSystemVoList: result.userSystemVoList
    }
    setInfo(JSON.stringify(info), 7);
}

function setInfo(value, time) {
    Cookies.set('info', value, { path: '/', expires: time, domain: '.localhost' });
}
