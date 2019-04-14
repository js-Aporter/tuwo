import { appRouter} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';

const access = {
    state: {
        menuList: [],
    },
    mutations: {
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (item.access !== undefined) {
                    if (Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList;
        },
        // 给角色配置权限
        accessUpdateMenulist(state, data) {
            const list = data;
            let menuList = [];
            appRouter.forEach((item, index) => {
                // 可管理，根据管理tree数据来显示
                let children = item.children;
                if (Util.accessShowThisRoute(item, list)) {
                    if (children === undefined || children.length === 0) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = children.filter(child => {
                            const childItem = list.find(x => x.name == child.name);
                            if (childItem) {
                                return child;
                            }
                        });
                        if (childrenArr.length) {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                } else {
                    if (children !== undefined && children.length !== 0) {
                        let len1 = menuList.push(item);
                        let childrenArr1 = [];
                        childrenArr1 = children.filter(child => {

                            const childItem = list.find(x => x.name == child.name);
                            if (childItem) {
                                return child;
                            }
                        });
                        if (childrenArr1.length) {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len1 - 1]));
                            handledItem.children = childrenArr1;
                            menuList.splice(len1 - 1, 1, handledItem);
                        } else {
                            menuList.splice(len1 - 1, 1);
                        }
                    }
                }
            });
            state.menuList = menuList;
        },
    }
};

export default access;
