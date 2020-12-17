/*
思路
1.获取cookie - 主要是来自于详情页。
2.渲染购物车列表。(隐藏一块布局，对隐藏的进行克隆，传值)
3.计算总价和总的商品件数
4.全选
5.改变数量 - 增加减少数量 - cookie有关
6.删除商品 - cookie有关
*/

define(['jcookie'], () => {
    return {
        init: function() {
            // 1.获取cookie - 主要是来自于详情页。
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    let $arrsid = $.cookie('cookiesid').split(','); //sid编号 
                    let $arrnum = $.cookie('cookienum').split(','); //num数量
                    $.each($arrsid, function(index, value) {
                        rendergoods($arrsid[index], $arrnum[index]); //index:数组的索引
                    });
                }
            }
            getcookietoarray();

            // 2.渲染购物车列表(隐藏一块布局，对隐藏的进行克隆，传值)
            function rendergoods(sid, num) {
                $.ajax({
                    url: 'http://192.168.31.28/changhong/php/cart.php',
                    dataType: 'json'
                }).done(function(data) {
                    $.each(data, function(index, value) {
                        if (sid === value.sid) { //确定当前的数据。克隆隐藏的盒子，进行赋值
                            let $clonebox = $('.liBox:hidden').clone(true, true); //克隆
                            $clonebox.find('.details img').attr('src', value.url);
                            $clonebox.find('.title').html(value.title);
                            $clonebox.find('.price b').html(value.price);
                            $clonebox.find('article input').val(num);
                            $clonebox.find('.strong').html((value.price * num).toFixed(2)); //计算小计
                            $clonebox.css('display', 'block');
                            $('#main').append($clonebox);
                            calcprice(); //计算总价
                        }
                    });
                });
            }


            // 3.计算总价和总的商品件数 - 单独计算，不同的地方进行调用。
            // 核心：可视的visible  选中的
            // each():jquery遍历元素对象   $.each():遍历数组和对象的
            function calcprice() {
                let $sum = 0; //商品的件数
                let $count = 0; //商品的总价
                $('.liBox:visible').each(function(index, ele) {
                    if ($(ele).find('.input input').prop('checked')) { //复选框是否勾选
                        $sum += parseInt($(ele).find('article input').val());
                        $count += parseFloat($(ele).find('.strong').html());
                    }
                });
                //赋值
                $('.span1').html($sum);
                $('.ri span').find('i').html($count.toFixed(2));
            }

            // 4.全选 - 事件委托。

            $('.top input').on('click', function() {
                $('.liBox:visible').find(':checkbox').prop('checked', $(this).prop('checked')); //将全选的值给下面的几个input
                calcprice(); //计算总价
            });

            //获取克隆的商品列表里面的checkbox,添加事件
            //克隆的商品列表里面：选中的复选框的长度等于存在的复选框的长度
            let $inputs = $('.liBox:visible').find(':checkbox'); //查找复选框
            $('#main').on('click', $inputs, function() {
                //$(this):被委托的元素，checkbox
                if ($('.liBox:visible').find(':checkbox').length === $('.liBox:visible').find('input:checked').size()) {
                    $('.top input').prop('checked', true);
                } else {
                    $('.top input').prop('checked', false);
                }
                calcprice(); //计算总价
            });


            // 5.改变数量 - 增加减少数量 - cookie有关
            $('.em_ri').on('click', function() {
                //parents():获取当前元素的所有的父级(祖先元素)
                //parent():获取当前元素的父级
                let $num = $(this).parents('.liBox').find('article  input').val(); //取值
                $num++; //累加
                if ($num > 99) { //防止数据过大，Bigint：js新增的数据类型，大整型。
                    $num = 99;
                }
                $(this).parents('.liBox').find('article input').val($num); //赋值
                $(this).parents('.liBox').find('.strong').html(singlegoodsprice($(this))); //计算单个商品的总价，进行赋值
                calcprice(); //计算总价
                addcookie($(this)); //数量发生改变，重新存储cookie
            });


            $('.em_le').on('click', function() {
                let $num = $(this).parents('.liBox').find('article input').val(); //取值
                $num--; //累加
                if ($num <= 0) {
                    $num = 1;
                }
                $(this).parents('.liBox').find('article input').val($num); //赋值
                $(this).parents('.liBox').find('.strong').html(singlegoodsprice($(this))); //计算单个商品的总价，进行赋值
                calcprice(); //计算总价
                addcookie($(this)); //数量发生改变，重新存储cookie
            });

            $('article  input').on('input', function() {
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
                $(this).parents('.goods-item').find('.b-sum strong').html(singlegoodsprice($(this))); //计算单个商品的总价，进行赋值
                calcprice(); //计算总价
                addcookie($(this)); //数量发生改变，重新存储cookie
            });

            //封装函数实现计算单个商品的总价
            function singlegoodsprice(obj) { //当前调用函数的元素对象，那条列表进行计算
                let $singleprice = parseFloat(obj.parents('.liBox').find('.price b').html());
                let $num = parseFloat(obj.parents('.liBox').find('article input').val());
                return ($singleprice * $num).toFixed(2); //保留2位小数。
            }

            //将改变后的值存放cookie中 - 获取商品的sid,通过sid找到商品的数量。
            let $arrsid = [];
            let $arrnum = [];

            function cookietoarray() { //cookie转换成数组
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    $arrsid = $.cookie('cookiesid').split(','); //[4,5,6] 
                    $arrnum = $.cookie('cookienum').split(','); //[10,50,60] 
                }
            }

            function addcookie(obj) {
                cookietoarray() //cookie转换成数组
                let $sid = obj.parents('.liBox').find('img').attr('sid'); //获取sid
                $arrnum[$.inArray($sid, $arrsid)] = obj.parents('.liBox').find('article input').val(); //赋值
                $.cookie('cookienum', $arrnum, { expires: 10, path: '/' });

            }


            //6.删除 - 结构+cookie
            //删除当个商品
            $('.delete').on('click', function() {
                cookietoarray(); //cookie转换成数组
                if (window.confirm('手下留情！！')) {
                    $(this).parents('.liBox').remove();
                    calcprice(); //计算总价
                    delcookie($(this).parents('.liBox').find('img').attr('sid'), $arrsid);
                    //传入当前的sid 和 cookiesid的值
                    if ($arrsid.length === 0) {
                        $.cookie('cookiesid', $arrsid, { expires: -1, path: '/' });
                        $.cookie('cookienum', $arrnum, { expires: -1, path: '/' });
                    }
                }
            });



            //删除商品对应的sid和num
            //例如：delcookie(5,[4,5,6]);
            function delcookie(sid, $arrsid) { //sid:删除商品的sid   arrsid:数组，cookie里面的值
                let $sidindex = -1; //假设接收索引的值
                $.each($arrsid, function(index, value) {
                    if (sid === value) {
                        $sidindex = index; //接收删除项的索引值
                    }
                });

                //删除
                $arrsid.splice($sidindex, 1);
                $arrnum.splice($sidindex, 1);

                //重新设置cookie
                $.cookie('cookiesid', $arrsid, { expires: 10, path: '/' });
                $.cookie('cookienum', $arrnum, { expires: 10, path: '/' });
            }

        }
    }
});