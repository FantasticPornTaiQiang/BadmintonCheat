chrome.storage.local.get(['config'], ({ config }) => {
    if (!config || !config.enabled) return;

    const isBetween8amAnd10pm = () => {
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 59, 59);
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0);

        return startTime <= now && now <= endTime;
    }

    if (isBetween8amAnd10pm()) {
    }
    window.location.href = "https://pecg.hust.edu.cn/cggl/front/syqk?cdbh=" + config.where + "&date=" + config.when.date + "&starttime=" + config.when.starttime + ":00:00&endtime=";

});