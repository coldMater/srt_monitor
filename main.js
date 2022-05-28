import notifier from 'node-notifier'
import axios from 'axios'
import parser from 'node-html-parser'
import path from 'path'

const url = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000"
const dptDt = '20220530'
const dptTm = '060000'
const formData = `stlbTrnClsfCd=05&trnGpCd=109&psgNum=1&seatAttCd=015&isRequest=Y&dptRsStnCd=0036&arvRsStnCd=0551&dptDt=${dptDt}&dptTm=${dptTm}&psgInfoPerPrnb1=1&psgInfoPerPrnb5=0`

async function main() {
    const result = await axios.post(url, formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "WMONID=RqpLFFPgKFJ; PCID=16500982546124641744769; RC_COLOR=24; RC_RESOLUTION=2195*1235; JSESSIONID_ETK=QwWpv62cnpJSlt7E7w60BOpj3LQfJIdN2tu44IuMEc0LroWZ7jhgRUrwFUb70f3a.ZXRrcC9FVEtDT04wMQ=="
        }
    })
    const parsed = parser.parse(result.data)
    const table = parsed.querySelector("#result-form")
    const mainInfo = table.getElementsByTagName('th')[0].text.trim()
    const tbody = table.getElementsByTagName('tbody')[0]
    const trs = tbody.getElementsByTagName('tr')[1] // 시간 바꿀 때 여기 바꿔줘야함
    const tds = trs.getElementsByTagName('td')
    const from = tds[3].text.trim()
    const to = tds[4].text.trim()
    const firstInfo = tds[5]
    const reservationButtonFirst = firstInfo.getElementsByTagName('a')[0]?.text?.trim()
    const standardInfo = tds[6]
    const reservationButtonStandard = standardInfo.getElementsByTagName('a')[0]?.text?.trim()
    const seatReservationWaiting = tds[7].text.trim()
    console.log(`VIP: ${reservationButtonFirst }, GEN: ${reservationButtonStandard } | ${mainInfo} | ${from} -> ${to} | ${new Date().toISOString().slice(0, 19)}`)
    if (reservationButtonFirst === '예약하기') {
        notifier.notify({ title: 'SRT Now Available', message: 'First Available', wait: false });
    }
    if (reservationButtonStandard === '예약하기') {
        notifier.notify({ title: 'SRT Now Available', message: 'Standard Available', wait: false });
    }
}

setInterval(() => {
    main()
}, 5000)