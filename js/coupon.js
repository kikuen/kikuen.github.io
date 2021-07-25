var date = new Date(2021,08,22,23,59,59);
setInterval(function() {
var now = new Date();
var gap = date.getTime() - now.getTime();
var day = Math.floor(gap / (1000 * 60 * 60 * 24));
var hour = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var min = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
var sec = Math.floor((gap % (1000 * 60)) / 1000);
$("#time").html(day + "일 " + hour + "시간 " + min + "분 " + sec + "초");
}, 1000);


$('#uid').focus();

/* 쿠폰 종류 1 ~ 3*/
var strs = ["JMANDJHSGIFT","JJINDANJANGSGIFT","ONTACTSENA2"];

/* 테이블 초기화 데이터 */
var tData = new Array();
$(strs).each(function (index) {
    tData.push({ id: index + 1, code: this, result: 0, response: '', description: '계정코드를 입력하고 쿠폰을 사용하세요.' });
});
setData(tData);

/* 계정코드로 코드 등록 정보 요청 및 업데이트 */
function req() {
    var uid = $('#uid').val();
    for (var a in tData) {
        let i = a;
        $.ajax({
            type: 'POST',
            url: 'https://couponview.netmarble.com/coupon/sknightsmmo/1332/apply',
            data: {
                'pid': uid,
                'channelCode': 100,
                'couponCode': tData[i]['code'],
                'worldId': '',
                'nickname': ''
            },
            success: function (data) {
                if (data['resultCode'] === 'SUCCESS') {
                    tData[i]['result'] = 1;
                    tData[i]['description'] = data['rewardItem']['rewardTitle'];
                } else if (data['resultCode'] === 'NOT_EXISTS_PID') {
                    tData[i]['description'] = '회원번호 오류';
                } else if (data['resultCode'] === 'COUPON_ALREADY_USE') {
                    tData[i]['description'] = '이미 사용한 쿠폰';
                } else if (data['resultCode'] === 'COUPON_WRONG') {
                    tData[i]['description'] = '잘못된 쿠폰 코드';
                } else {
                    tData[i]['description'] = '알수 없는 내용';
                }
                tData[i]['response'] = data['resultCode'];
                setData(tData);
            }
        });
    }
}

// data 초기화
function setData(data) {
    $(".table tbody").html("");
    for (var t in data) {
        var str = "<tr><td>" + tData[t]["id"] + "</td><td>" + tData[t]["code"];
        if (tData[t]["result"] == 0) {
            str += "</td><td class='text-center text-danger'><i class='bi bi-patch-question'></i></td>";
        } else {
            str += "</td><td class='text-center text-success'><i class='bi bi-patch-exclamation'></i></td>";
        }

        str += "<td>" + tData[t]["description"] + "</td></tr>";
        $(".table tbody").append(str);
    }
    $('td').addClass("text-center");
}