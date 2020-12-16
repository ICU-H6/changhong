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
                    $('..top input').prop('checked', true);
                } else {
                    $('.top input').prop('checked', false);
                }
                calcprice(); //计算总价
            });
        }
    }
});