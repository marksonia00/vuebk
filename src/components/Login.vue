<template>
    <div class="body flex-center">
        <form class="loginbox flex-center" @submit.prevent="signin">
            {{warning}}
            <input type="text" v-model="user.account" placeholder="Account" required/>
            <input type="password" v-model="user.password" placeholder="password" required/>
            <button type="submit">Sign in</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'Login',
    data() {
        return{
            warning: " ",
            user: {
                account:"",
                password:""
            }
        }
    },
    methods:{
        async signin() {
            let req = {
                account: this.user.account,
                userKey: this.user.password
            };
            let res = await this.loginAction(req)
            res.CODE === 200 ?
                this.$router.push("/HelloWorld")
                :this.warning = "please check your account & password"
        },
        ...mapActions(["loginAction"])
    }   
}
</script>

<style scoped>
.flex-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.body{
    background: rgb(167, 159, 159) url("../assets/bgp.jpg") left top;
    background-blend-mode: multiply;
    background-size: cover;
    width: 100%;
    height: 99vh;
    color: brown;
    font-size: 14px;
}
.loginbox{
    background-color: rgba(34, 32, 32, 0.363);
    width: 350px;
    height: 275px;
    border-radius: 15px;
}
.loginbox input,button{
    outline: none;
    margin-bottom: 5%;
    padding: 1%;
    width: 70%;
    height: 14%;
    font-size: 17px;
    color: rgb(213, 219, 224);
    background-color: rgba(255, 255, 255, 0);
    border: .1px solid rgba(133, 130, 130, 0);
    border-bottom: 1.5px solid rgba(133, 130, 130, 0.37);
}
.loginbox input:focus{
    border-bottom: 1.5px solid rgba(212, 202, 202, 0.719);
}
.loginbox button{
    margin-top: 5%;
    width: 47%;
    background-color: rgba(125, 150, 173, 0.678);
    border-radius: 11px;
}
.loginbox button:hover{
    background-color: rgba(125, 150, 173, 0.925);
}
</style>