$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 补零
    function addZero(n) {
        return n < 10 ? '0' + n : n
    }
    // 定义时间过滤器

    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = addZero(dt.getMonth() + 1)
        var d = addZero(dt.getDate())
        var h = addZero(dt.getHours())
        var mm = addZero(dt.getMinutes())
        var s = addZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }



    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    initTable()
    initCate()


    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类数据

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                var htmlstr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlstr)
                form.render() //渲染全部
                    //有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的
            }
        })
    }


    //  给筛选表单绑定提交事件

    $('#form_search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 给查询参数对象对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pagebox', //分页容器的id
            count: total, //数据总数
            limit: q.pagesize, //每页 显示几条数据
            curr: q.pagenum, //默认被选中的页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            //切换分页时会发生jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调  first的值是undefined
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 first的值是true  这种方法直接调用initTable()会发生死循环
            jump: function(obj, first) {
                // first的值是布尔值，如果为true，就是方式2触发 如果为false就是方式1触发

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit //每条显示几条数据重新复制给q

                // 用方式一才不会发生死循环
                if (!first) {
                    initTable()
                }

            }
        })

    }


    // 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')

                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了 页码值最小必须是 1
                    if ($('.btn-delete').length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })


    // 给编辑按钮添加点击事件
    $("tbody").on('click', '#btn_edit', function() {
        console.log('o');
        location.href = '/article/article_pub.html'

    })




























})