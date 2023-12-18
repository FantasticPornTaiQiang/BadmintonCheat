const getCurrentDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

let mConfig;

chrome.storage.local.get(['config'], ({ config }) => {
    mConfig = (config != undefined && `${config}` != '{}') ? config : {
        when: {
            date: getCurrentDate(),
            starttime: 20
        },
        where: 117, //场地编号：45：光体，69：西边，117：游泳馆
        who: {
            pwd: "Fb8739B9B4D",
            name: "周毅",
            uid: "M202276594"
        },
        which: [0],
        ensure: true,
        enabled: false,
    };

    const enabledEl = document.getElementById('enabled');
    enabledEl.innerHTML = `${mConfig.enabled ? '已开启' : '已禁用'}`;
    enabledEl.className = `enabled ${mConfig.enabled ? 'success' : 'failure'}`;
    if (!mConfig.enabled) {
        document.getElementById('disable').style.display = 'none';
    }

    document.getElementById('date').setAttribute('value', mConfig.when.date);
    document.getElementById('starttime').setAttribute('value', mConfig.when.starttime);
    document.getElementById('which').setAttribute('value', mConfig.which.join('/'));
    document.getElementById('where').value = mConfig.where;

    document.getElementById('pwd').setAttribute('value', mConfig.who.pwd);
    document.getElementById('name').setAttribute('value', mConfig.who.name);
    document.getElementById('uid').setAttribute('value', mConfig.who.uid);

    document.getElementById('ensure').value = mConfig.ensure;

    const toast = (info, success) => {
        const toastEl = document.getElementById('save-toast');
        toastEl.innerHTML = info;
        toastEl.className = `save-toast ${success}`;
    }

    document.getElementById('save').addEventListener('click', () => {
        let newConfig = {
            when: {
                date: document.getElementById('date').value,
                starttime: document.getElementById('starttime').value.toString().padStart(2, '0')
            },
            where: document.getElementById('where').value,
            who: {
                pwd: document.getElementById('pwd').value,
                name: document.getElementById('name').value,
                uid: document.getElementById('uid').value,
            },
            which: document.getElementById('which').value.split('/'),
            ensure: document.getElementById('ensure').value,
            enabled: true,
        };

        const placeSize = {
            45: 22,
            69: 9,
            117: 9
        };

        if (new Date(newConfig.when.date) < new Date()) {
            toast('选个有效日期呗', 'failure');
        } else if (newConfig.when.starttime > 20 || newConfig.when.starttime < 8 || +newConfig.when.starttime % 2 != 0) {
            toast('填个有效时间呗', 'failure');
        } else if (!newConfig.which.every(i => i >= 0 && i < +placeSize[`${newConfig.where}`])) {
            toast('存在无效场地编号', 'failure');
        } else {
            chrome.storage.local.set({ 'config': newConfig }, () => {
                toast('设置已保存', 'success');
                mConfig = newConfig;

                document.getElementById('disable').style.display = 'block';

                const enabledEl = document.getElementById('enabled');
                enabledEl.style.display = 'block';
                enabledEl.innerHTML = '已开启';
                enabledEl.className = 'enabled success';
                // toastEl.innerHTML = `${JSON.stringify(newConfig)}`;
            })
        }
    });

    document.getElementById('disable').addEventListener('click', () => {
        chrome.storage.local.set({ 'config': { ...mConfig, enabled: false } }, () => {
            toast('', 'success');
            const enabledEl = document.getElementById('enabled');
            enabledEl.style.display = 'block';
            enabledEl.innerHTML = '已禁用';
            enabledEl.className = 'enabled failure';
        })
    });

    document.getElementById('link').addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://pecg.hust.edu.cn/wescms/', });
    })
});
