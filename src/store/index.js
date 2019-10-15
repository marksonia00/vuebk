import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        logininfo:{},
        logintoken:"",
        projectinfo:{},
    },
    actions:{
        // ■■ Login ■■■■■■■■■■■
        async loginAction(store, {account, userKey}) {
            const api = `${process.env.API_PATH}/api/Logininfo`
            let postbody = `ACCOUNT=${account}&USERKEY=${userKey}`
            let res
            await axios.post(api, postbody)
                .then(Response => {
                    console.log(res)                        
                    if(Response.data.CODE === 200){
                        store.commit("setlogininfo", Response.data.DATA),
                        store.commit("setlogintoken", Response.data.TOKEN)   
                    }
                    res = Response.data 
                })
                .catch(error => res = error)
            return res    
        },
        // ■■ Logout ■■■■■■■■■■■
        async logoutAction(store) {
            const api = `${process.env.API_PATH}/api/Logoutinfo`;
            let postbody = `ACCOUNT=${store.state.logininfo.ACCOUNT.trim()}&TOKEN=${store.state.logintoken}`;
            let res;
            await axios.post(api, postbody)
                .then(Response => {
                    if(Response.data.CODE === 200) {
                        store.commit('setlogininfo',"")
                        store.commit('setlogintoken',"")
                        res = Response.data
                    }
                })
            return res      
        },
        // ■■ changeowner ■■■■■■■■■■■
        async changeowner(store, {id, owner}){
            const api = `${process.env.API_PATH}/api/updatetaskinfo`;
            let postbody = `ID=${id}&OWNER=${owner}&NAME=${store.state.logininfo.ACCOUNT.trim()}&TOKEN=${store.state.logintoken}`;
            let res;
            await axios.post(api, postbody)
                .then(Response => {
                    if(Response.data.CODE === 200) {
                        res = Response.data
                    }
                })
            return res      
        },
        // ■■ taskinfo ■■■■■■■■■■■
        async gettaskinfo(store,id) {
            let api = `${process.env.API_PATH}/api/taskinfo?NAME=${store.state.logininfo.ACCOUNT.trim()}&ID=${id}`
            let res;
            await axios.get(api)
                .then(Response => {
                    if(Response.data.CODE === 200) {
                        res = Response.data.DATA
                    }
                })
                .catch(error => alert(error))
            return res   
        }
    },
    mutations:{
        setlogininfo: (state, res) => state.logininfo = res,
        setlogintoken: (state, res) => state.logintoken = res,
        setprojectinfo: (state, res) => state.projectinfo = res,
    },
    getters:{
        logininfo: state => state.logininfo,
        logintoken: state => state.logintoken,
        projectinfo: state => state.projectinfo
    }
})