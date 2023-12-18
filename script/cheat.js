chrome.storage.local.get(['config'], ({ config }) => {
    if (!config || !config.enabled) return;

    // const cdbh = {
    //     45: [110, 133, 215, 216, 218, 217, 219, 220, 221, 222, 223, 224, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377],
    //     69: [134, 295, 296, 297, 298, 299, 300, 301, 584],
    //     117: [587, 588, 589, 590, 591, 592, 593, 594, 595]
    // };

    let interval;

    const cheatStart = () => {
        try {
            try {
                document.querySelector('.window-close').dispatchEvent(new MouseEvent('click'));
            } catch { }

            const putPartner = (schoolno, name, passwd) => {
                document.getElementById('partnerSchoolNo').value = schoolno;
                document.getElementById('partnerName').value = name;
                document.getElementById('partnerPwd').value = passwd;
                document.getElementById('partnerCardType1').setAttribute("checked", "checked");
            }
            putPartner(config.who.uid, config.who.name, config.who.pwd);

            const allAreas = Array.from(document.querySelectorAll('td.getajax'));

            const cdbh = allAreas.map(i => i.getAttribute('pian'));

            const allSelectable = allAreas.filter(i => i.className.includes('appointmentopen'));

            const selectWhich = allSelectable.find(i => {
                return config.which.some(candidate => {
                    const cand = +candidate;
                    return cand > 0 && cand < cdbh.length && cdbh[cand] == i.getAttribute('pian');
                });
            }) ?? (config.ensure || config.ensure == 'true' ? allSelectable[0] : undefined);

            if (selectWhich) {
                selectWhich.dispatchEvent(new MouseEvent('click'));
                selectWhich.className = 'getajax appointmentopen input_checked';
                selectWhich.children[0].setAttribute('checked', 'checked');
                document.querySelector('#command').submit();
                chrome.storage.local.set({ 'config': { ...config, enabled: false } }, () => { });
            }

            clearInterval(interval);
        } catch (e) {
            console.log(e);
        }
    }

    setTimeout(cheatStart, 500);
    interval = setInterval(cheatStart, 600);
});

