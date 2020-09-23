$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 给添加类别按钮添加点击事件
    var index = null
    $('#btnAddCate').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        });
    })

    // 因为form是动态创建的，通过事件委托代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form_add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form_add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                initArtCateList()
                layer.msg('新增文章分类成功')
                layer.close(index)
            }
        })
    })

    // 给编辑按钮添加点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data) //个表单赋值
            }
        })
    })

    // 更新文章分类数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 给删除按钮添加点击事件
    $("body").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function() {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })

        });
    })








})