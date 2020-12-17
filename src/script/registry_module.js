define([], function() {
    return {
        init: function() {
            //1.表单验证。
            let $form = $('#form1'); //form表单。
            let $username = $('[name=username]'); //用户
            let $phone = $('[name=phone]'); //号码
            let $password = $('[name=password]'); //密码
            let $password1 = $('[name=password1]'); //确认密码
            let $span = $('#form1 span'); //4个span  
            let $i = $('#form1 i'); //4个i 


            // 定义检测标记 
            $userflag = true;
            $phoneflag = true;
            $passflag = true;
            $passflag = true;


            // 用户名检测 
            $username.on('focus', function() {
                $span.eq(0).html('支持中文，字母，数字').css('color', '#333');
            });

            $username.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $strLen = $value.replace(/[\u4e00-\u9fa5]/g, '**').length; //中文当做两个字符
                    if ($strLen > 0 && $strLen <= 14) {
                        let $reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                        if ($reg.test($value)) {
                            $i.eq(0).html('√').css('color', 'green');
                            $span.html('');
                            $userflag = true;

                            // 用户名格式没有问题， 将用户名传给后端。
                            $.ajax({
                                type: 'post',
                                url: 'http://192.168.31.28/changhong/php/reg.php',
                                data: {
                                    username: $username.val()
                                }
                            }).done(function(data) {
                                if (!data) { //不存在
                                    $span.eq(0).html('');
                                    $i.eq(0).html('√').css('color', 'green');

                                } else { //存在
                                    $span.eq(0).html('该用户名已存在').css('color', 'red');
                                    $i.eq(0).html('');
                                }
                            });


                        } else {
                            $span.eq(0).html('用户名格式有误').css('color', 'red');
                            $i.eq(0).html('');
                            $userflag = false;
                        }
                    } else {
                        $span.eq(0).html('用户名长度有误').css('color', 'red');
                        $i.eq(0).html('');
                        $userflag = false;
                    }
                } else {
                    $span.eq(0).html('用户名不能为空').css('color', 'red');
                    $i.eq(0).html('');
                }
            });

            //手机
            $phone.on('focus', function() {
                $span.eq(1).html('请输入11位正确的手机号码').css('color', '#333');
            });

            $phone.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $reg = /^1[3|5|8]\d{9}$/;
                    if ($reg.test($value)) {
                        $i.eq(1).html('√').css('color', 'green');
                        $span.html('');
                        $telflag = true;
                    } else {
                        $span.eq(1).html('不是正确的手机号码').css('color', 'red');
                        $i.eq(1).html('')
                        $telflag = false;
                    }
                } else {
                    $span.eq(1).html('手机号码不能为空').css('color', 'red');
                    $i.eq(1).html('');
                    $telflag = false;
                }
            });


            //密码
            $password.on('focus', function() {
                $span.eq(2).html('长度在8~16之间,必须包含字母数字').css('color', '#333');
            });

            $password.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $reg = /\d+/;
                    if ($reg.test($value)) {
                        $i.eq(2).html('√').css('color', 'green');
                        $span.html('');
                        $telflag = true;
                    } else {
                        $span.eq(2).html('长度在8~16之间，必须包含字母和数字').css('color', 'red');
                        $i.eq(2).html('');
                        $telflag = false;
                    }
                } else {
                    $span.eq(2).html('密码不能为空').css('color', 'red');
                    $i.eq(2).html('')
                    $telflag = false;
                }
            });
            //确认密码




            $password1.on('blur', function() {
                if ($password.val() == $password1.val()) {
                    $i.eq(3).html('√').css('color', 'green');
                    $span.html('');
                    $telflag = true;
                } else {
                    $span.eq(3).html('两次密码不一致').css('color', 'red');
                    $i.eq(3).html('');
                    $telflag = false;
                }
            });

            $password1.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $reg = /\d+/;
                    if ($reg.test($value)) {
                        $i.eq(3).html('√').css('color', 'green');
                        $span.html('');
                        $telflag = true;
                    } else {
                        $span.eq(3).html('长度在8~16之间，必须包含字母和数字').css('color', 'red');
                        $i.eq(3).html('');
                        $telflag = false;
                    }
                } else {
                    $span.eq(3).html('密码不能为空').css('color', 'red');
                    $i.eq(3).html('')
                    $telflag = false;
                }
            });
            //阻止表单的直接跳转。
            $form.on('submit', function() {
                if ($username.val() === '') {
                    $span.eq(0).html('请输入用户名').css('color', 'red');
                    $phoneflag = false;
                }

                if ($phone.val() === '') {
                    $span.eq(1).html('请输入手机号').css('color', 'red');
                    $phoneflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(2).html('请输入密码').css('color', 'red');
                    $passflag = false;
                }
                if ($password1.val() === '') {
                    $span.eq(3).html('请确认密码').css('color', 'red');
                    $pass1flag = false;
                }

                if (!$phoneflag || !$passflag || !$pass1flag) {
                    return false;
                }
            });



        }
    }
});