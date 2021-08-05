
//axios请求方法
function axios(url, data) {
    return new Promise(function (reslove, reject) {
        $.ajax({
            type: 'post',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            success: function (res) {
                reslove(res);
            },
            error: function (res) {
                reject(res);
            }
        })
    })
}