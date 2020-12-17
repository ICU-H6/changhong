define([], function() {
    return {
        init: function() {
            const $username = $('#username');
            const $password = $('#password');
            const $login = $('#login'); //登录按钮

            $login.on('click', function() {

                $.ajax({
                    type: 'post',
                    url: 'http://192.168.31.28/changhong/php/login.php',
                    data: {
                        user: $username.val(),
                        pass: $password.val()
                    }
                }).done(function(data) {
                    if (!data) { //登录失败
                        alert('用户名或者密码有误!');
                        $password.val(''); //密码清空
                    } else { //登录成功
                        location.href = 'index.html'; //前端和前端进行页面的通信，相对路径即可，如果是前后端的通信一定是觉对路径。
                        //存储用户名，方便首页获取。
                        localStorage.setItem('loginname', $username.val());
                    }
                })
            });



            const $img = $('#img');
            const $ul = $('ul');
            const $else = $('.else'); //其他方式
            const $phone = $('.right');
            const $user = $('.left');
            const $phone1 = $('.phone');
            const $password1 = $('.password');


            $phone.on('click', function() {
                $(this).css("background-color", 'white');
                $user.css("background-color", '#dfe4e8');
                $img.show();
                $ul.hide();
                $phone1.hide();
                $password1.hide();
                $else.hide()



            })
            $user.on('click', function() {

                $(this).css("background-color", 'white')
                $phone.css("background-color", '#dfe4e8')
                $img.hide();
                $ul.show();
                $phone1.show();
                $password1.show();
                $else.show()
            })



        }
    }
})