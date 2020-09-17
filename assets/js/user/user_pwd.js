$(function() {
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if ($('[name=oldPwd]').val() === value) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次输入不一致！'
            }
        }

    })

    // 发起请求实现重置密码的功能
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功')

                //重置表单使用原生js的reset方法
                $('.layui-form')[0].reset()
            }
        })
    })




















})