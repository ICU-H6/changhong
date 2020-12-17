define(['jcookie'], () => {
    return {
        init: function() {
            //1.通过地址栏获取列表页面传入的sid。
            let $sid = location.search.substring(1).split('=')[1];

            if (!$sid) { //列表页面没有传入sid，默认为1
                $sid = 1;
            }

            //2.将sid传给后端，后端根据对应的sid返回不同的数据。
            $.ajax({
                url: 'http://192.168.31.28/changhong/php/getsid.php',
                data: {
                    sid: $sid
                },
                dataType: 'json'
            }).done(function(data) {
                //获取数据，将数据放入对应的结构中。
                $('#img').attr('src', data.url);
                $('.title').html(data.title);
                $('.price').html(data.price);
                $('#bpic').attr('src', data.url);

                //渲染放大镜下面的小图
                let $picurl = data.urls.split(','); //将数据转换成数组。
                let $strhtml = '';
                const $list = $('.simg ul');
                $.each($picurl, function(index, value) {
                    $strhtml += `<li><img src="${value}"/></li>`;
                });

                $list.html($strhtml);
            });

            //3.放大镜效果
            const $bimg = $('.bimg');
            const $bpic = $('#bpic');
            const $sf = $('#sf'); //小放
            const $bf = $('#bf'); //大放

            //$bimg 小图   $bpic 大图  

            $bimg.hover(function() {
                    $sf.css({
                        visibility: 'visible'
                    });
                    $bf.css({
                        visibility: 'visible'
                    });
                    // 计算放大镜得尺寸
                    $sf.css({
                            width: $bimg.outerWidth() * $bf.outerWidth() / $bpic.outerWidth(),
                            height: $bimg.outerHeight() * $bf.outerHeight() / $bpic.outerHeight(),
                        })
                        // 计算大图小图得比例
                    let $bili = $bpic.outerWidth() / $bimg.outerWidth();
                    // 黄色小图移动
                    $bimg.on('mousemove', function(e) {
                        let $left = e.pageX - $bimg.offset().left - $sf.width() / 2;
                        let $top = e.pageY - $bimg.offset().top - $sf.height() / 2;
                        //判断出界边框
                        if ($left <= 0) {
                            $left = 0;
                        } else if ($left >= $bimg.width() - $sf.width()) {
                            $left = $left >= $bimg.width() - $sf.width()
                        }
                        if ($top <= 0) {
                            $top = 0;
                        } else if ($top >= $bimg.height() - $sf.height()) {
                            $top = $top >= $bimg.height() - $sf.height()
                        }
                        $sf.css({
                                left: $left,
                                top: $top,
                            })
                            // bili
                        $bpic.css({
                            left: -$bili * $left,
                            top: -$bili * $top
                        })
                    })
                }, function() {
                    $sf.css({
                        visibility: 'hidden'
                    });
                    $bf.css({
                        visibility: 'hidden'
                    })
                })
                // 点击li小图
                //小图切换
            $('.simg ul').on('click', 'li', function() {
                let $imgurl = $(this).find('img').attr('src'); //li的宽度
                $('#img').attr('src', $imgurl);
                $bpic.attr('src', $imgurl);
            });

            //  箭头切换
            let $lilen = 5; //显示得图品得张数
            //li得width
            $('#right').on('click', function() {

                let $liwidth = $('.simg li').outerWidth(true);
                $('#left').css({
                    color: '#ccc'
                })
                if ($('.simg li').length > $lilen) {
                    $lilen++;
                    if ($lilen === $('.simg li').length) {
                        $('#right').css({
                            color: '#fff'
                        })
                    }
                    $('.simg ul').animate({
                        left: -($lilen - 5) * $liwidth
                    })
                }
            });
            $('#left').on('click', function() {
                let $liwidth = $('.simg li').outerWidth(true);

                $('#right').css({
                    color: '#aaa'
                });
                if ($lilen > 5) {
                    $lilen--;
                    if ($lilen === 5) {
                        $('#left').css({
                            color: '#fff'
                        })
                    }
                    $('.simg ul').animate({
                        left: -($lilen - 5) * $liwidth
                    })
                }
            })


            //4.购物车：(商品sid、商品数量)
            //4.1设置存储cookie的变量,因为是多个商品，采用数组存储。
            let arrsid = []; //存储商品的sid
            let arrnum = []; //存储商品的数量

            //4.2核心是判断用户是第一次存储，多次存储。
            //如果是第一次存储，创建商品的列表显示在购物车列表页面。
            //如果是多次存储，购物车列表页面里面的商品数量累加。


            //如何判断是第一次还是第二次
            //通过获取cookie进行判断，每存储一个商品对应的商品编号存入cookie里面，cookie就会发生变化。如果cookie里面存在当前商品的编号，该商品不是第一次存储，直接数量累加。

            //提前预判cookie设置时的key值(cookiesid/cookienum)进行获取cookie
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                } else {
                    arrsid = [];
                    arrnum = [];
                }
            }
            //上面的函数获取cookie值，并且转换成数组，方便判断是否是第一次。
            //第一次存储添加sid进入arrsid，存储数量
            //第二次以上，直接修改数量。

            $('.shop').on('click', function() {
                getcookietoarray(); //获取cookie，变成数组，判断是否存在。
                if ($.inArray($sid, arrsid) === -1) { //第一次添加商品
                    arrsid.push($sid); //添加sid
                    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
                    arrnum.push($('#quantity').val()); //添加数量
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                } else { //多次添加，数量累加
                    //通过$sid获取商品的数量所在的位置。
                    let $index = $.inArray($sid, arrsid);
                    //原来的数量+新加的数量进行重新赋值，添加cookie
                    arrnum[$index] = parseInt(arrnum[$index]) + parseInt($('#quantity').val()); //重新赋值
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                }
                alert('兄台，多买一点！！！');
            });


            //-   +
            $('.i_ri').on('click', function() {


                //parents():获取当前元素的所有的父级(祖先元素)
                //parent():获取当前元素的父级
                let $num = $(this).parents('.amount').find('#quantity').val(); //取值
                console.log($num);
                $num++; //累加
                if ($num > 99) { //防止数据过大，Bigint：js新增的数据类型，大整型。
                    $num = 99;
                }
                $(this).parents('.amount').find('#quantity').val($num); //赋值
            });

            $('.i_le').on('click', function() {
                let $num = $(this).parents('.amount').find('#quantity').val(); //取值
                $num--; //累加
                if ($num <= 0) {
                    $num = 1;
                }
                $(this).parents('.amount').find('#quantity').val($num); //赋值
            });

            $('#quantity').on('input', function() {
                let $reg = /^\d+$/;
                let $value = $(this).val(); //当前的值
                if (!$reg.test($value)) { //不是数字
                    $(this).val(1);
                }
                if ($value > 99) {
                    $(this).val(99);
                }

                if ($value <= 0) {
                    $(this).val(1);
                }

            });
        }
    }
});