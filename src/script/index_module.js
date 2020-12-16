define(['jlazyload'], () => {
    return {
        init: function() {
            // 轮播图
            const $banner = $('#banner');
            const $banLi = $('.banner-ul li');
            const $qh = $('.qh li');
            const $left = $('#left');
            const $right = $('#right');
            let $num = 0;
            let $timer1 = null;
            let $timer2 = null;
            //1.小圆圈切换
            $qh.on('click', function() {
                $num = $(this).index();

                $timer1 = setTimeout(function() {
                    tabswitch()
                }, 300);
                tabswitch()

            });

            $qh.on('click', function() {
                clearTimeout($timer1);
            });

            //2.左右箭头切换
            $banner.on('mouseover', function() {
                $('#left').show().stop(true).animate({
                    left: 80
                });
                $('#right').show().stop(true).animate({
                    right: 80
                })
            })
            $banner.on('mouseout', function() {
                $('#left').hide().stop(true).animate({
                    left: 0
                });
                $('#right').hide().stop(true).animate({
                    right: 0
                })
            })

            $right.on('click', function() {
                $num++;
                if ($num > $qh.length - 1) {
                    $num = 0;
                }
                tabswitch()
            });

            $left.on('click', function() {
                $num--;
                if ($num < 0) {
                    $num = $qh.length - 1;
                }

                tabswitch()
            });

            function tabswitch() {
                $qh.eq($num).addClass('active').siblings().removeClass('active');
                $banLi.eq($num).stop(true).animate({
                    opacity: 1
                }).siblings().stop(true).animate({
                    opacity: 0
                });
            }

            //3.自动轮播
            $timer2 = setInterval(function() {
                $right.click();
            }, 2000);

            //4.鼠标控制定时器停止和开启。
            $banner.hover(function() {
                clearInterval($timer2);
            }, function() {
                $timer2 = setInterval(function() {
                    $right.click();
                }, 3000);
            });





            // // 二级下拉运动

            const $li = $('.listnav li');
            const $ol = $('#box')
            const $hover = $('#box .ol')
            $li.on('mouseover', function() {
                if ($(this).index() > 0) {

                    $hover.eq($(this).index()).show().siblings('.item').hide()
                    console.log($(this).index())
                    $ol.show()

                }
            })
            $li.on('mouseout', function() {

                $ol.hide()
            })
            $ol.hover(() => {
                $ol.show()
            }, () => {
                $ol.hide()
            });



            // // 二级导航
            const $li1 = $('#list li').not('.dle');
            const $ol1 = $('#ol')
            const $hover1 = $('#ol .list-hover')
            $li1.on('mouseover', function() {
                $hover1.eq($(this).index()).show().siblings('.item').hide() //匹配得显示 其他继续隐藏 
                $ol1.show()
            })
            $li1.on('mouseout', function() {

                $ol1.hide()
            })
            $ol1.hover(() => {
                $ol1.show()
            }, () => {
                $ol1.hide()
            });





            // 楼层效果
            const $loutinav = $('#loutinav'); //楼梯
            const $louceng = $('.louceng'); //楼层
            const $louti = $('#loutinav li');
            const $jiantou = $('.jiantou')

            function scroll() {
                const $scrolltop = $(window).scrollTop();
                if ($scrolltop >= 600) {
                    $loutinav.show();
                    $jiantou.show();
                } else {
                    $loutinav.hide();
                    $jiantou.hide();
                }

                $louceng.each(function(index, elemnet) {
                    let $loucengtop = $(elemnet).offset().top; //每一个楼层的top值。


                    if ($loucengtop >= $scrolltop) {
                        $louti.removeClass('active'); //移除前面所有的激活状态
                        $louti.eq(index).addClass('active');
                        //给满足条件的添加状态
                        return false; //终止循环
                    }
                })
            }
            scroll();
            $(window).on('scroll', function() {
                scroll()
            })

            // 2
            $louti.on('click', function() {
                    //点击楼梯，会触发滚轮事件，这个时候激活状态一直加载。干掉滚轮事件。
                    $(window).off('scroll');
                    $(this).addClass('active').siblings('li').removeClass('active'); //当前点击的添加类名

                    const $loucengtop = $louceng.eq($(this).index()).offset().top;

                    $('html').animate({ scrollTop: $loucengtop }, function() {
                        $(window).on('scroll', function() {
                            scroll()
                        })
                    })
                })
                //第三步：回到顶部
            $('.jiantou').on('click', function() {
                $('html').animate({
                    scrollTop: 0
                })
            });





            //1.渲染list.html页面
            const $list = $('#tv .con-img');
            $.ajax({
                url: 'http://192.168.31.28/changhong/php/mian.php',
                dataType: 'json'
            }).done(function(data) {
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="#">
                                <img class="lazy" data-original="${value.url}"/>
                                <p>${value.title}</p>
                                <p>${value.details}</p>
                                <p>￥${value.price}</p>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml);
            });




            //1.渲染list.html页面
            const $list1 = $('#kt .con-img');
            $.ajax({
                url: 'http://192.168.31.28/changhong/php/main1.php',
                dataType: 'json'
            }).done(function(data) {
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                <li>
                <a href="#">
                        <img src="${value.url}"/>
                        <p>${value.title}</p>
                        <p>${value.details}</p>
                        <p>￥${value.price}</p>
                    </a>
                </li>
            `;
                });
                $list1.html($strhtml);
            });


            // 懒加载

            $("img.lazy").lazyload({ effect: "fadeIn" })








        }

    }

});