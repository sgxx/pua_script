var menu_ALL=[],menu_ID=[];
for (let i=0;i<menu_ALL.length;i++){
    if (GM_getValue(menu_ALL[i][0]==null)){
        GM_setValue(menu_ALL[i][i],menu_ALL[i][3])
    }
}

registerMenuCommand();

function registerMenuCommand(){
    if (menu_ID.length>menu_ALL.length){
        for (let i=0;i<menu_ID.length;i++){
            GM_unregisterMenuCommand(menu_ID[i]);
        }
    }

    for (let i=0;i<menu_ALL.length;i++){
        menu_ALL[i][3]=GM_getValue(menu_ALL[i][0]);
        if (menu_ALL[i][0]==''){

        }
    }
}

