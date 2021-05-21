var date = new Date(2021,05,30,23,59,59);
setInterval(function() {
var now = new Date();
var gap = date.getTime() - now.getTime();
var day = Math.ceil(gap / (1000 * 60 * 60 * 24));
var hour = Math.ceil((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var min = Math.ceil((gap % (1000 * 60 * 60)) / (1000 * 60));
var sec = Math.ceil((gap % (1000 * 60)) / 1000);
$("#time").html(day + "일 " + hour + "시간 " + min + "분 " + sec + "초");
}, 1000);

$('#uid').focus();

/* 쿠폰 종류 1 ~ 100 */
var strs = ["KINGADEL", "DANJANGNIMLUV", "GUMANKM", "BIGUPDATE", "SENAYAHO", "VELVET", "GOGOSENA", "COMINGSOON", "NEWSCENARIO", "DUGUDUGU", "EVENTMATJIB", "LADY", "LEGENDSENA", "REINFORCE", "DUDUDUNGA", "ONESHOT", "KEEEEE", "8RAID8", "EVAN", "4RAID4", "WOWSENA", "LADYKILLER", "HAPPYCOCO", "OLDRUDY", "IMSOHOT", "UPDATE", "SENAFOREVER", "SEYAHO", "SKNIGHTS2", "HISENA2", "7INFINITE7", "TPQMSSKDLCM2", "GREATEVENT", "2SEVEN2", "SK2FORUM", "SENAINSSA", "2S2E2V2E2N", "COCOJOA", "CHECKCHECK", "2STHGINNEVES", "SENAMOON", "KEKESENA2", "SENAGA", "7S7E7V7E7N", "guildsuccess", "STRONGROCK", "SK2ARENA", "EVANKARIN", "2SENA2", "BOSSKING", "SENA2AGGYOJUSEYO", "JUSEYO", "ANAWIFI", "UHPRETTY", "GIVEMEGIFT", "BIGBIGEVENT", "SENA2YEONHEE", "FROMCOCO", "SENA2LENE", "AYAAPAYO", "SENA2GUIDE", "SENA2RUDY", "LUVCOCO", "INFINITYWAR", "77INFINITE77", "GREATSENA", "BONBUJANGNIM", "SPECIALTICKET", "JJANGSENA", "HAPPYSENAS2", "SENA2KING", "SENA2DOWN", "PLAYSENATWO", "RUNSENA2", "SENADDABONG", "SENA2LUCKY", "SENA2DERUWA", "EVANVSRUDY", "DARKBLACKSHANE", "LUCKYTICKET", "MAINSENA2", "JAEMI2TH", "PUKISENA", "KEKEEVAN", "PRETTYCOCO", "CUTYCOCO", "GOMAWAYOS2", "SIDANEUNGEOJI", "7KNIGHTS2", "GOGOYOEMYEONG", "SENA2JOA", "SENA2FOREVER", "MINGSARANGHE", "DANJANGNIM", "SAYSENA2", "DANJANGNIMTHX", "HEHESENA", "COMEBACKSENA", "WASENADA", "2PRESENTSENA2"];

/* 테이블 초기화 데이터 */
var tData = new Array();
$(strs).each(function (index) {
    tData.push({ id: index + 1, code: this, result: 0, response: '', description: '계정코드를 입력하고 쿠폰을 등록하세요.' });
});
setData(tData);

/* 계정코드로 코드 등록 정보 요청 및 업데이트 */
function req() {
    var uid = $('#uid').val();
    for (var a in tData) {
        let i = a;
        $.ajax({
            type: 'POST',
            url: 'https://couponview.netmarble.com/coupon/sknightsmmo/1290/apply',
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
                    tData[i]['description'] = '알수 없음';
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